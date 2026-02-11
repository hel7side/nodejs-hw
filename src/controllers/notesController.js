import {Note} from '../models/note.js';
import createHttpError from 'http-errors';


//Опис контролера getAllNotes:
export const getAllNotes = async (req, res)=>{
  //Отримаємо параметри запиту
  const {page=1, perPage=10, tag, search}=req.query;

  const skip=(page-1)*perPage;

  //Створюємо базовий запит до колекції
  const notesQuery = Note.find();

  //Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if(search){
    notesQuery.where({$text: {$search: search}});
  }

  //Фільтр за tag
  if(tag){
    notesQuery.where('tag').equals(tag);
  }

  //Виконуємо одразу два запити паралельно
  const [totalNotes, notes]=await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  //Обчислюємо загальну кількість сторінок
  const totalPages=Math.ceil(totalNotes / perPage);

  //У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200 та містити масив нотаток:
  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes});
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

