import {Router} from "express";
import { authenticate } from "../middleware/authenticate.js";
import { updateUserAvatar } from "../controllers/userController.js";
//обробити файл із зображенням для аватарки користувача через middleware upload
import {upload} from '../middleware/multer.js';


const router=Router();

//Опис роута PATCH /users/me/avatar завантаження зображення користувача
//Middleware authenticate гарантує, що змінювати аватар може лише автентифікований користувач від свого імені.
router.patch('/users/me/avatar', authenticate,
// Додаємо після авторизації, але до контролера:
//Метод single(fieldname) обробляє рівно один файл. У запиті очікується поле з іменем, яке ви вказали ("avatar"), і Multer прикріплює цей файл до req.file.
upload.single('avatar'),
  updateUserAvatar);

export default router;

