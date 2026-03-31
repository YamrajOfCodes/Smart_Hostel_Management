import express from "express";
const router = express.Router();
import {RegisterUser,Login} from "../../Controller/AuthController/authController.js"

router.post("/inserUser",RegisterUser);
router.post("/login",Login);



export default router;