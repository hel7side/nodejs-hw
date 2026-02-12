//Реалізація утиліти для збереження файлу в хмарне сховище
//використайте бібліотеку cloudinary npm install cloudinary

import {Readable} from 'node:stream';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  secure:true,
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//реалізуйте функцію saveFileToCloudinary(buffer), яка приймає буфер файлу та повертає проміс, який резолвить об’єкт із даними завантаженого зображення;
export async function saveFileToCloudinary(buffer){
  return new Promise((resolve, reject)=>{
//завантаження організуйте через cloudinary.uploader.upload_stream та Node.js Readable стрім
    const uploadStream=cloudinary.uploader.upload_stream(
      {
        folder:'nodejs-hw/avatars',
        resource_type: 'image',
        overwrite:true,
        unique_filename:false,
      },
      (err, result)=>(err ? reject(err): resolve(result)),
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}
