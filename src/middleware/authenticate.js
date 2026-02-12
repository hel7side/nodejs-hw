import createHttpError from 'http-errors';
import {Session} from '../models/session.js';
import {User} from '../models/user.js';

//Щоб обмежити доступ до приватних колекцій, ми створимо middleware authenticate,
// який перевірятиме токени у cookies і визначатиме, чи користувач може виконати запит
export const authenticate=async(req, res, next)=>{
//1.перевіряє наявність кукі accessToken.
// Якщо accessToken відсутній — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Missing access token'
if(!req.cookies.accessToken){
  next(createHttpError(401, 'Missing access token'));
  return;
}
//2.Якщо access токен присутній — шукає у базі даних сесію за цим токеном:
const session=await Session.findOne({
  accessToken: req.cookies.accessToken,
});
//3.//3.Якщо така сесія відсутня — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Session not found';
if(!session){
  next(createHttpError(401, 'Session not found'));
  return;
};
//4.перевіряє, чи не прострочений access-токен:
const isAccessTokenExpired=new Date()>new Date(session.accessTokenValidUntil);
//Якщо прострочений — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Access token expired';
if(isAccessTokenExpired){
  return next(createHttpError(401, 'Access token expired'));
};
//5. Якщо з токеном все добре і сесія існує, шукаємо користувача
const user =await User.findById(session.userId);
//6. Якщо такий користувач не знайдено — повертає через createHttpError помилку зі статусом 401 без повідомлення:
 if(!user){
next(createHttpError(401));
return;
 };
 //7.Y разі успіху додає об’єкт знайденого користувача в req.user і викликає next():
 req.user=user;
next();
};
