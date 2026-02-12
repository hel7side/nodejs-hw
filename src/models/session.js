import mongoose from "mongoose";
import  {model, Schema } from "mongoose";

export const sessionSchema=mongoose.Schema(
  {
userId:{type: Schema.Types.ObjectId, ref:'User', require: true },
accessToken:{type:String, required:true},
refreshToken:{type:String, required:true},
accessTokenValidUntil: {type:Date, requred:true},
refreshTokenValidUntil:{type:Date, required:true},
  },
  {timestamps:true, versionKey:false},
);


export const Session =model('Session', sessionSchema);

