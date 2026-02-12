import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import {createSession, setSessionCookies} from "../services/auth.js";
import { Session } from "../models/session.js";

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
export const logoutUser=async (req, res)=>{
const {sessionId}=req.cookies;
console.log(req.cookies);
//1.logoutUser, який перевіряє, чи є у cookies sessionId
if(sessionId){
  await Session.deleteOne({_id:sessionId});
  //2.очищає cookies sessionId, accessToken та refreshToken за допомогою res.clearCookie
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  //3.повертає відповідь зі статусом 204 (без тіла)
  res.status(204).send();
};
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
  message:'Sessionrefreshed'
});
};
