import {Note} from '../models/note.js';
import createHttpError from 'http-errors';


//Опис контролера getAllNotes:
export const getAllNotes = async (req, res)=>{
  //Отримаємо параметри запиту
  const {page=1, perPage=10, tag, search}=req.query;

  const skip=(page-1)*perPage;

  //Створюємо базовий запит до колекції
  //getAllNotes — повертайте лише нотатки, що належать поточному користувачу userId:req.user._id.
  const notesQuery = Note.find({userId:req.user._id});

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
export const getNoteById = async (req, res, next)=>{
  const {noteId}=req.params;


//getNoteById — шукайте нотатку за _id, яка належить поточному користувачу;
  const note=await Note.findOne({
    _id:noteId,
    userId:req.user._id,
  });

  //Додайте перевірку чи нотатка за переданим ідентифікатором була знайдена. Якщо нотатку не було знайдено, то використовуючи бібліотеку createHttpError поверніть відповідь зі сатусом 404 і повідомленням 'Note not found'
  if(!note){
  return next (createHttpError(404,'Note not found'));
}
//У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200 та містити об’єкт відповідної нотатки:
res.status(200).json(note);
};


//Опис контролера createNote.Тіло запиту має містити поля згідно з Mongoose-моделлю Note.
export const createNote=async (req, res)=>{

  const note = await Note.create({
    ...req.body,
  //Оновлюємо контролер створення студента: при створенні додавайте userId з req.user._id.
  // Коли ми створюємо нового студента, потрібно вказати, якому користувачу він належить.
  // Для цього використаємо властивість req.user, яку ми отримуємо завдяки middleware authenticate.
  userId:req.user._id,
  });
 //У разі вдалої обробки запиту і успішного створення нової нотатки відповідь сервера має бути зі
// статусом 201 та містити створений об’єкт нотатки
res.status(201).json(note);
};

//Опис контролера deleteNote
export const deleteNote=async(req, res, next)=>{
  const {noteId}=req.params;
  const note=await Note.findOneAndDelete({
    _id:noteId,
    //видаляти можна лише нотатку, яка належить поточному користувачу:
    userId:req.user._id,
  });

  //Додайте перевірку чи нотатка за переданим ідентифікатором була знайдена.
  // Якщо нотатку не було знайдено, то використовуючи бібліотеку createHttpError
  // поверніть відповідь зі сатусом 404 і повідомленням 'Note not found'.
if(!note){
  next (createHttpError(404, "Note not found"));
  return;
}
  //У разі вдалої обробки запиту і успішного видалення нотатки
  // відповідь сервера має бути зі статусом 200 та містити видалений об’єкт нотатки.
res.status(200).json(note);
};


//Опис контролера updateNote
export const updateNote=async(req, res)=>{
  const {noteId}=req.params;

  const note =await Note.findOneAndUpdate(
 //оновлювати можна лише нотатку, яка належить поточному користувачу;
    {_id: noteId, userId:req.user._id}, req.body,{new:true},);

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

