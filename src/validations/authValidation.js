import {Joi, Segments } from "celebrate";


//Схема валідації registerUserSchema для тіла запиту
export const registerUserSchema={
  [Segments.BODY]:Joi.object({
email: Joi.string().email().required(),
password: Joi.string().min(8).required(),
  }),
};

//Схема валідації loginUserSchema для тіла запиту
export const loginUserSchema={
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

//Схема валідації loginUserSchema для тіла запиту
export const requestResetEmailSchema={
  [Segments.BODY]: Joi.object({
    email:Joi.string().email().required(),
  }),
};

//Схема валідації resetPasswordSchema що дозволяє встановити новий пароль за токеном із листа
export const resetPasswordSchema={
  [Segments.BODY]:Joi.object({
  //password — новий пароль, який користувач хоче встановити:
    password: Joi.string().min(8).required(),
  //token — підписаний JWT, який ми надіслали в листі (дійсний упродовж 15 хв).
    token: Joi.string().required(),
  }),
};





