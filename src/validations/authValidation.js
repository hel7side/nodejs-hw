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


