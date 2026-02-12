import mongoose from 'mongoose';
import { model } from 'mongoose';


//Створимо схемудля моделі User. Для цього використаємо клас Schema з бібліотеки mongoose.
const userSchema=mongoose.Schema(
{
username:{
  type:String,
  trim:true
},
email:{
  type:String,
  unique: true,
  required:true,
  trim:true,
},
password:{
  type:String,
  required:true,
},
avatar:{
  type:String,
  required:false,
  default:"https://ac.goit.global/fullstack/react/default-avatar.jpg",
}
},
{timestamps:true, versionKey:false}
);

//Створення хук pre('save'), щоб за замовчуванням встановлювати username таким самим, як email, при створенні користувача.
userSchema.pre('save', function(){
  if(!this.username){
    this.username=this.email;
  }
});

// Додаємо до схеми userSchema метод toJSON, щоб видаляти пароль із об'єкта користувача перед відправкою у відповідь.
userSchema.methods.toJSON=function(){
  const obj=this.toObject();
  delete obj.password;
  return obj;
};


//Створимо модель User на основі нашої схеми:
export const User =model('User', userSchema);





