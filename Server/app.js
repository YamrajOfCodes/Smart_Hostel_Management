import dbConnect from "./Database/DbConnect.js";
import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import "dotenv/config";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors("*"));

console.log("PUBLIC:", process.env.VAPID_PUBLIC_KEY);
console.log("PRIVATE:", process.env.VAPID_PRIVATE_KEY);

import authRouter from "./Routes/AuthRoutes/authRoutes.js";
app.use("/api/auth",authRouter);

import userRouter from "./Routes/User/userRoutes.js";
app.use("/api/user",userRouter);

import adminRouter from "./Routes/Admin/adminRoutes.js";
app.use("/api/admin",adminRouter);

import SuperAdminRouter from "./Routes/SuperAdmin/superAdminRoutes.js";
app.use("/api/superAdmin",SuperAdminRouter);

import activityRouter from "./Routes/Activity/activityRoutes.js";
app.use("/api/activity",activityRouter);


dbConnect();

const PORT = process.env.PORT

app.listen(4000,()=>{
   console.log("server is started"); 
})