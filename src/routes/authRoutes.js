//Цей файл описує які маршрути існують(POST /auth/register  )
// та яка функція-контроллер обробляє цей маршрут(registerUser)

import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshUserSession, requestResetEmail, resetPassword} from "../controllers/authController.js";
import { celebrate } from "celebrate";
import {registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema} from "../validations/authValidation.js";


const router=Router();

//Опис роута POST /auth/register, який буде повертати масив усіх нотаток:
router.post('/auth/register', celebrate(registerUserSchema), registerUser);


//Реалізація маршруті POST /auth/login для логіну зареєстрованого користувача.
router.post('/auth/login', celebrate(loginUserSchema), loginUser );

//реалізуйте маршрут POST /auth/logout для виходу користувача із системи.
router.post('/auth/logout', logoutUser );

//Pеалізуйте маршрут POST /auth/refreshдля для оновлення сесії користувача:
router.post('/auth/refresh', refreshUserSession);

//Опис роута POST /auth/request-reset-email який буде надсилати email для скидання паролю
router.post('/auth/request-reset-email', celebrate(requestResetEmailSchema),  requestResetEmail);

//Опис роута POST /auth/reset-password який буде скидати пароль
router.post('/auth/reset-password', celebrate(resetPasswordSchema), resetPassword);
export default router;

//!!Не забуваємо підключити  маршрут POST /auth/register до src/server.js
