import {Session} from "../models/session.js";
import crypto from "crypto";
import {FIFTEEN_MINUTES, ONE_DAY} from "../constants/time.js";

export const createSession=async (userId)=>{
  const accessToken=crypto.randomBytes(30).toString('base64');
  const refreshToken=crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now()+FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now()+ONE_DAY),
  });
};




//Cookies (кукі) — це невеликі фрагменти даних, які сайт зберігає у браузері користувача.
// Вони допомагають «пам’ятати» стан між запитами: хто залогінений, які налаштування обрано,
// що лежить у кошику тощо. Для аутентифікації це ключовий механізм: ми зберігатимемо у куках
// окени доступу та ідентифікатор сесії.

//1.Встановлюємо пакет і підключаємо його як middleware:npm i cookie-parser src/server.js
//2.Після створення сесії відповідаємо трьома куками:
// accessToken — короткоживучий токен доступу (у нас ~15 хв);
// refreshToken — токен для оновлення пари токенів (у нас ~1 день);
// sessionId — ідентифікатор поточної сесії (у нас ~1 день).
// При встановленні кожної кукі обов’язково використовуйте однакові параметри:
// httpOnly: true
// secure: true
// sameSite: 'none'
// maxAge: для accessToken — 15 хв, для refreshToken і sessionId — 1 день.
export const setSessionCookies=(res, session)=>{
  res.cookie('accessToken', session.accessToken, {
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:ONE_DAY,
    });
};



