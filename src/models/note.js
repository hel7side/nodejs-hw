import mongoose from "mongoose";
import {model} from 'mongoose';


//Створимо схему для документа note. Для цього використаємо клас Schema з бібліотеки mongoose.
const noteSchema=mongoose.Schema(
  {
    title:{
      type: String,
      required:true,
      trim:true,
    },
    content:{
      type: String,
      default: "",
      trim:true,
    },
    tag:{
      type: String,
      default: 'Todo',
      enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'],
    },
  },
  {
    timestamps: true
  },
);

//Створимо модель Student на основі нашої схеми:
export const Note =model('Note', noteSchema);




