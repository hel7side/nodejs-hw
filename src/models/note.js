import mongoose from "mongoose";
import {model, Schema} from 'mongoose';
import { TAGS } from "../constants/tags.js";


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
      enum: TAGS,
    },
    //Розширте модель Note обов’язковим полем userId (тип ObjectId, посилання на модель User):
    userId:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
  },
  {
    timestamps: true
  },
);

// Додаємо текстовий індекс: кажемо MongoDB, що по полю name можна робити $text
noteSchema.index({title: 'text', content: 'text'});


//Створимо модель Student на основі нашої схеми:
export const Note =model('Note', noteSchema);




