import {User} from "../models/user.js";
import createHttpError from "http-errors";
import {saveFileToCloudinary} from '../utils/saveFileToCloudinary.js';

//Опис контролера updateUserAvatar завантажеення зображення користувача
export const updateUserAvatar=async(req, res, next)=>{
  //В body він має приймати властивість avatar - файл із зображенням для аватарки користувача

  //Перевірте наявність файлу у реквесті, у разі його відсутності, використовуючи бібліотеку createHttpError, поверніть відповідь зі статусом 400 і повідомленням 'No file'
  if(!req.file){
    throw createHttpError(400, "No file");
  }

  //Використайте утиліту saveFileToCloudinary, щоб завантажити файл у Cloudinary
  const result=await saveFileToCloudinary(req.file.buffer);

  const user=await User.findByIdAndUpdate(
    req.user._id,
    {avatar: result.secure_url},
    {new:true},
  );
  res.status(200).json({url: user.avatar});
};


//Для маршруту PATCH /users/me/avatar потрібно:
//реалізувати захист маршруту, щоб до нього доступ був тільки у авторизованого користувача
//обробити файл із зображенням для аватарки користувача через middleware upload.
//Для цього створіть middleware upload у файлі src/middleware/multer.js,

//Спочатку встановимо і налаштуємо middleware multer для завантаження зображень:npm i multer
