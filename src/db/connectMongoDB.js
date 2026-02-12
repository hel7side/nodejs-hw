import mongoose from 'mongoose';
import { Note } from '../models/note.js';

export const connectMongoDB = async ()=>{
  try {
    //читаємо рядок підключення (MONGO_URL) зі змінних оточення:
    const mongoUrl=process.env.MONGO_URL;

    //викликаємо mongoose.connect(...) для встановлення з’єднання:
    await mongoose.connect(mongoUrl);

    //у разі успіху виводимо повідомлення
    console.log('✅ MongoDB connection established successfully');

    //Гарантія, що індекси в БД відповідають схемі
    await Note.syncIndexes();
    console.log('Indexes synced successfully');
  } catch (error) {
    //у разі помилки завершуємо роботу процесу (process.exit(1)), щоб сервер не залишався "напівживим".
    console.error('❌ Failed to connect to MongoDB:', error.message);
    //аварійне заверщення програми:
    process.exit(1);
  }
};


