//обробити файл із зображенням для аватарки користувача через middleware upload.
//ля цього створіть middleware upload у файлі src/middleware/multer.js, який:
//зберігає файл у пам’яті (memoryStorage);
//обмежує розмір файлу до 2MB;
//дозволяє тільки файли з mimetype, що починається з image/. У випадку невідповідності повертає помилку "Only images allowed".

import multer from 'multer';

//Цей middleware підключається не глобально, а безпосередньо до потрібного маршруту.
//  Додаємо його потім  у PATCH /users/me/avatar:

export const upload=multer({
  //storage: multer.memoryStorage() - зберігає файл у пам’яті сервера (не на диску):
  storage:multer.memoryStorage(),
  //limits.fileSize - обмежує розмір завантаження до 2 МБ:
  limits:{
    fileSize: 2*1024*1024,
  },
//fileFilter - визначає, які файли дозволено приймати. У цьому випадку - лише ті, чий mimetype співпадає із можливими значеннями.
//fileFilter - це функція, яку multer викликає для кожного завантаженого файлу. Вона отримує три аргументи:
//req - HTTP-запит, як у звичайному Express;
//file - інформація про файл (назва, MIME-тип, розмір тощо);
//cb - callback, який повідомляє multer, що робити з файлом.
  fileFilter:(req, file, cb)=>{

//Варіанти виклику cb:
//cb(null, true) - файл дозволено (приймаємо);
//cb(null, false) - файл відхилено без помилки;
//cb(new Error('...')) - файл відхилено з помилкою, обробка переривається.
    if(file.mimetype.startsWith('image/')){
      cb(null, true);
    }else{
      cb(new Error('Only images allowed'));
    };
  },
});
