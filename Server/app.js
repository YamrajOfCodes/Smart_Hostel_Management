import dbConnect from "./Database/DbConnect.js";
import express from "express";
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(express.json());



import authRouter from "./Routes/AuthRoutes/authRoutes.js";
app.use("/api/auth",authRouter);

import SuperAdminRouter from "./Routes/SuperAdmin/superAdminRoutes.js";
app.use("/api/superAdmin",SuperAdminRouter);


dbConnect();

const PORT = process.env.PORT

app.listen(PORT,()=>{
   console.log("server is started"); 
})