import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import {createSession, setSessionCookies} from "../services/auth.js";
import { Session } from "../models/session.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/sendMail.js";
import handlebars from "handlebars";
import path from 'node:path';
import fs from 'node:fs/promises';

//✅СТВОРЮЄМО КОНТРОЛЕР registerUser
export const registerUser=async (req, res, next)=>{
   //1.Отримаємо параметри запиту
const {email, password}= req.body;
//2.Перевіряє, чи користувач із таким email вже існує. Якщо так — повертає через createHttpError помилку зі статусом 400 і повідомленням 'Email in use';
const existingUser=await User.findOne({email});
if(existingUser){
  return next(createHttpError(400, 'Email in use'));
}
//3.Хешує пароль за допомогою bcrypt
const hashedPassword=await bcrypt.hash(password, 10);
//4.Створює нового користувача в базі
const newUser=await User.create({
  email,
  password:hashedPassword,
});
//5.Створює нову сесію (createSession) і додає кукі (setSessionCookies) до відповіді:
const newSession=await createSession(newUser._id);
setSessionCookies(res, newSession);
//6. У разі вдалої обробки запиту повертає відповідь зі статусом 201 і об’єктом створеного користувача (без пароля завдяки методу схеми toJSON)
res.status(201).json(newUser);
};


//✅СТВОРЮЄМО КОНТРОЛЕР  loginUser
export const loginUser=async (req, res, next)=>{
    //1.Отримаємо параметри запиту
    const{email, password}=req.body;
    console.log(req.body);
  //2. Перевіряємо, чи користувач із таким email існує в базі даних. Якщо ні — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Invalid credentials';
const user=await User.findOne({email});
if(!user){
  return next(createHttpError(401, 'Invalid credentials'));
}
//3.Перевіряє чи вірний пароль. Якщо ні — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Invalid credentials';
const isValidPassword=await bcrypt.compare(password, user.password);
if(!isValidPassword){
  return next(createHttpError(401, 'Invalid credentials'));
}
//4.видаляє стару сесію цього користувача:
await Session.deleteOne({userId: user._id});
//5.створює нову (createSession) ta додає кукі (setSessionCookies) до відповіді
const newSession=await createSession(user._id);
setSessionCookies(res, newSession);
//3.У разі вдалої обробки запиту повертає відповідь зі статусом 200 і об’єктом залогіненого користувача (без пароля завдяки методу схеми toJSON) — res.status(200).json(user).
res.status(200).json(user);
};


// ✅СТВОРЮЄМО КОНТРОЛЕР  logoutUser:
export const logoutUser=async (req, res, next)=>{
const {sessionId}=req.cookies;
console.log(req.cookies);
//1.logoutUser, який перевіряє, чи є у cookies sessionId
if(sessionId){
  await Session.deleteOne({_id:sessionId});
};
//2.очищає cookies sessionId, accessToken та refreshToken за допомогою res.clearCookie
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
 //3.повертає відповідь зі статусом 204 (без тіла)
  res.status(204).send();
};


//✅СТВОРЮЄМО КОНТРОЛЕР ОНОВЛЕННЯ СЕСІЇ КОРИСТУВАЧА refreshUserSession:
export const refreshUserSession=async(req, res, next)=>{
  //1.Знаходимо у базі даних сесію за sessionId та refreshToken з cookies;
const session=await Session.findOne({
  _id:req.cookies.sessionId,
  refreshToken:req.cookies.refreshToken,
});
//2. якщо сесія не знайдена — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Session not found':
if(!session){
  return next(createHttpError(401, 'Session not found'));
}
//3.Перевіряє, чи не прострочений refresh-токен
const isSessionTokenExpired=new Date()>new Date(session.refreshTokenValidUntil);
//Якщо термін дії рефреш токена вийшов повертає через createHttpError помилку зі статусом 401 і повідомленням 'Session token expired':
if(isSessionTokenExpired){
  return next(createHttpError(401, 'Session token expired'));
};
  //4.Якщо всі перевірки пройшли добре, видаляємо поточну сесію щоб уникнути накопичення прострочених токенів:
  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
//5.Cтворює нову сесію (createSession) і додає нові кукі (setSessionCookies) до відповіді:
const newSession=await createSession(session.userId);
//Використовуємо setSessionCookies, щоб записати у відповідь нові cookies:
// accessToken (15 хвилин)
// refreshToken (1 день)
// sessionId (1 день)
setSessionCookies(res, newSession);
//6.Y разі вдалої обробки запиту повертає відповідь зі статусом 200 і об’єктом:{"message": "Session refreshed"}:
res.status(200).json({
  message:'Session refreshed'
});
};

//✅СТВОРЮЄМО КОНТРОЛЕР СКИДАННЯ ПАРОЛЮ через email requestResetEmail
export const requestResetEmail=async (req, res, next)=>{
const {email}=req.body;
console.log(req.body);
//1.Знайдіть користувача за переданим email:
const user=await User.findOne({email});
//2. Якщо користувача нема -навмисно повертаємо ту саму успішну відповідь без відправлення листа (anti user enumeration):
if(!user){
  return res.status(200).json({message: 'If this email exists, a reset link has been sent',});
}
//3. Користувач є -генеруємо короткоживучий JWT і відправляємо лист
const resetToken=jwt.sign(
  {sub:user._id, email},
  process.env.JWT_SECRET,
  {expiresIn:'15m'},//Термін дії токена — 15 хвилин. Цього достатньо, щоб перейти за лінком, і це знижує ризики компрометації.
);
console.log(resetToken);
//4.Формуємо шлях до шаблона
const templatePath=path.resolve('src/templates/reset-password-email.html');
//5.Читаємо шаблон
const templateSource=await fs.readFile(templatePath, 'utf-8');
//6.Готуємо шаблон до заповнення
const template=handlebars.compile(templateSource);
//4.Формуємо із шаблона HTML документ з динамічними даними
const html=template({
  name:user.username,
  link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
});

//Обгортання sendEmail у try/catch дає коректну відповідь 500 у випадку збою поштового сервісу.
try{
  await sendEmail({
    from:process.env.SMTP_FROM,
    to:email,
    subject:'Reset your password',
    html,
  });
}catch{
  next(createHttpError(500, 'Failed to send the email, please try again later.'));
  return;
}
//4.Якщо користувача не знайдено, то поверніть відповідь зі сатусом 200 і повідомленням:
res.status(200).json({ message: 'Password reset email sent successfully'});
};


//✅СТВОРЮЄМО КОНТРОЛЕР СКИДАННЯ ПАРОЛЮ перевіряє токен, знаходить користувача, хешує новий пароль і оновлює запис.
export const resetPassword=async(req, res, next)=>{
  const {token, password}=req.body;
  //1. Перевіряємо/декодуємо токен
  let payload;
  try{
//Перевірка токена. jwt.verify() гарантує дійсність і непідробність токена, а також перевіряє строк дії (expiresIn).
    payload=jwt.verify(token, process.env.JWT_SECRET);
  }catch{
    //Якщо токен невалідний або прострочений, використовуючи бібліотеку createHttpError, поверніть відповідь зі статусом 401 і повідомленням 'Invalid or expired token'.
next(createHttpError(401, 'Invalid or expired token'));
return;
  }
  //2. Знайдіть користувача за sub та email, які містяться в токені.
  const user=await User.findOne({_id:payload.sub, email:payload.email});
  //Якщо користувача не знайдено, використовуючи бібліотеку createHttpError, поверніть відповідь зі статусом 404 і повідомленням 'User not found':
  if(!user){
    next(createHttpError(404, 'User not found'));
    return;
  }
  // 3. Якщо користувач існує
  //створюємо новий пароль, зашифруйте новий пароль за допомогою бібліотеки bcrypt:
  const hashedPassword=await bcrypt.hash(password, 10);
  //  і оновлюємо користувача  в базі даних
  await User.updateOne(
    {_id:user._id},
    {password:hashedPassword}
  );

  //4. Видаляємо всі сесії які можуть існувати для цього користувача.
  await Session .deleteMany({userId:user._id});

  //5. Повертаємо успішну відповідь
  res.status(200).json({
    message: 'Password reset successfully',
  });
};

