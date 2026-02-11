import { Joi, Segments } from "celebrate";
import { TAGS } from "../constants/tags.js";
import { isValidObjectId } from "mongoose";

//ВАЛІДАЦІЯ маршруту GET /notes потрібно валідувати параметри рядка запиту:
//page - ціле число, мінімальне значення 1, за замовчуванням 1.
//perPage - ціле число, мінімальне значення 5, максимальне 20, за замовчуванням 10.
//tag - рядок, одне із можливих значень із файла src/constants/tags.js, необов’язкове поле
//search - рядок, можливо передавати порожній рядок
export const getAllNotesSchema={
  [Segments.QUERY]:Joi.object({
page:Joi.number().integer().min(1).default(1),
perPage:Joi.number().integer().min(5).max(20).default(10),
tag: Joi.string().valid(...TAGS),
search: Joi.string().trim().allow(''),
  })
};


//ВАЛІДАЦІЯ маршруту GET /notes/:noteId потрібно валідувати параметр запиту noteId:
//noteId - валідуємо як рядок із кастомною валідацію через isValidObjectId із mongoose.
// Кастомний валідатор для ObjectId
const objectIdValidator=(value, helpers)=>{
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
// Схема для перевірки параметра noteId
export const noteIdSchema={
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  })
};

//ВАЛІДАЦІЯ маршруту POST /notes: потрібно валідувати тіло запиту як об’єкт із наступними властивостями:
//title - рядок, мінімум 1 символ, обов’язкове поле
//content - рядок, може бути порожнім рядком, необов’язкове поле
//tag - одне зі значень із файла src/constants/tags.js, необов’язкове поле
export const createNoteSchema={
  [Segments.BODY]:Joi.object({
title: Joi.string().min(1).required(),
content: Joi.string().allow(''),
tag:Joi.string().valid(...TAGS),
  })
};


//Для маршруту PATCH /notes/:noteId потрібно валідувати параметр запиту noteId (валідуємо як рядок із кастомною валідацію через isValidObjectId із mongoose) та тіло запиту як об’єкт із наступними властивостями:
//title - рядок, мінімум 1 символ, необов’язкове поле
//ontent - рядок, може бути порожнім рядком, необов’язкове поле
//tag - одне із значень із файла src/contacts/tags.js, необов’язкове поле
//Додайте перевірку, що хоча б одне з полів `title`, `content` або `tag` буде присутнім, тобто тіло запиту не має бути порожнім. Для цього створіть схему валідації updateNoteSchema (не змінюйте назву) у файлі src/validations/notesValidation.js та використайте noteIdSchema.
export const updateNoteSchema={
[Segments.PARAMS]:Joi.object({
  noteId: Joi.string().custom(objectIdValidator).required(),
}),
[Segments.BODY]:Joi.object({
  title: Joi.string().min(1),
  content:Joi.string().allow(''),
  tag:Joi.string().valid(...TAGS),
}).min(1),
};
