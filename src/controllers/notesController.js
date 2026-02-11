import {Note} from '../models/note.js';
import createHttpError from 'http-errors';

//Опис контролера getAllNotes:
export const getAllNotes = async (req, res)=>{
  const notes =await Note.find();
  //У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200 та містити масив нотаток:
  res.status(200).json(notes);
};


//Опис контролера getNoteById
export const getNoteById = async (req, res)=>{
  const {noteId}=req.params;

  const note=await Note.findById(noteId);

  //Додайте перевірку чи нотатка за переданим ідентифікатором була знайдена. Якщо нотатку не було знайдено, то використовуючи бібліотеку createHttpError поверніть відповідь зі сатусом 404 і повідомленням 'Note not found'
  if(!note){
  throw createHttpError(404,'Note not found');
}
//У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200 та містити об’єкт відповідної нотатки:
res.status(200).json(note);
};


//Опис контролера createNote.Тіло запиту має містити поля згідно з Mongoose-моделлю Note.
export const createNote=async (req, res)=>{
  //У разі вдалої обробки запиту і успішного створення нової нотатки відповідь сервера має бути зі
  // статусом 201 та містити створений об’єкт нотатки
  const note = await Note.create(req.body);
res.status(201).json(note);
};

//Опис контролера deleteNote
export const deleteNote=async(req, res)=>{
  const {noteId}=req.params;
  const note=await Note.findOneAndDelete({
    _id:noteId
  });

  //Додайте перевірку чи нотатка за переданим ідентифікатором була знайдена.
  // Якщо нотатку не було знайдено, то використовуючи бібліотеку createHttpError
  // поверніть відповідь зі сатусом 404 і повідомленням 'Note not found'.
if(!note){
  throw createHttpError(404, "Note not found");
}
  //У разі вдалої обробки запиту і успішного видалення нотатки
  // відповідь сервера має бути зі статусом 200 та містити видалений об’єкт нотатки.
res.status(200).json(note);
};


//Опис контролера updateNote
export const updateNote=async(req, res)=>{
  const {noteId}=req.params;

  const note =await Note.findOneAndUpdate({_id: noteId}, req.body,{new:true},);

//Додайте перевірку чи нотатка за переданим ідентифікатором була знайдена.
// Якщо нотатку не було знайдено, то використовуючи бібліотеку createHttpError
// поверніть відповідь зі сатусом 404 і повідомленням 'Note not found':
if(!note){
  throw createHttpError(404,'Note not found');
}
//У разі вдалої обробки запиту і успішного оновлення нотатки відповідь сервера має бути зі статусом 200
// та містити оновлений об’єкт нотатки:
res.status(200).json(note);

};

