import express from 'express';
import cors from 'cors';
import 'dotenv/config';
//щоб помилки правильно відображалися при валідації, потрібно підключити спеціальний middleware errors() від celebrate.
import { errors } from 'celebrate';
import helmet from 'helmet';
import { loggerPino } from './middleware/logger.js';
import {connectMongoDB} from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js';


const app=express();

//Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

//Middleware дозволяє обробляти дані у форматі JSON, які надходять у body запиту:
app.use(express.json({limit: "10mb"}));

app.use(helmet());

app.use(cookieParser());

// Middleware дозволяє робити запити з інших доменів;
app.use(cors());

//Middleware — логування HTTP-запитів за допомогою pino-http:
app.use(loggerPino);

//Реєстрація користувача
app.use(authRoutes);

//Реєстрація загального роута для роботи з колекцією нотаток  після службових Middleware(express, cors, loggerPino) і  перед Middleware notFoundHandler :
app.use(notesRoutes);

//Реєстрацію загального роута користувача для завантаження зображення користувача
app.use(userRoutes);


//Middleware 404 notFoundHandler(додана після всіх маршрутів) для обробки всіх запитів, що не відповідають жодному наявному маршруту:повертає статус 400:
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
//Усі middleware виконуються у порядку, в якому вони оголошені.
//Тому errors() має бути підключений до глобального errorHandler.
//Це потрібно для того, щоб спочатку відловлювались помилки валідації celebrate, а вже потім — усі інші.
app.use(errors());

//Middleware errorHandler.js(middleware як остання у стеку) — глобальна обробка помилок: повертає статус 500:
app.use(errorHandler);

//викликаємо функцію для підключення до бази даних перед запуском сервера:
await connectMongoDB();

//Запуск сервера
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});
