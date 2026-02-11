//Цей файл описує які маршрути існують('/notes', /notes/:noteId,  )
// та яка функція-контроллер обробляє цей маршрут(getAllNotes, getNoteById )

import {Router} from "express";
import { getAllNotes, getNoteById, createNote, deleteNote, updateNote} from "../controllers/notesController.js";
import {celebrate} from 'celebrate';
import {createNoteSchema, getAllNotesSchema, noteIdSchema, updateNoteSchema} from '../validations/notesValidation.js';
const router = Router();

//Опис роута GET /notes, який буде повертати масив усіх нотаток:
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

//роут GET /notes/:noteId, який буде повертати дані нотатки за переданим ID
// або повертати помилку 404, якщо нотатка не знайдена
router.get('/notes/:noteId',celebrate(noteIdSchema), getNoteById);

//Опис роута POST /notes для створення нової нотатки:
router.post('/notes', celebrate(createNoteSchema), createNote);

//Опис роута DELETE /notes/:noteId для видалення існуючої нотатки за її ідентифікатором:
router.delete('/notes/:noteId',celebrate(noteIdSchema), deleteNote );

//Опис роута PATCH /notes/:noteId:
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);


export default router;
