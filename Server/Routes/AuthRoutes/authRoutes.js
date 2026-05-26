import express from "express";
const router = express.Router();
import {RegisterUser,Login,logout} from "../../Controller/AuthController/authController.js"

router.post("/insertUser",RegisterUser);
router.post("/login",Login);
router.post("/logout",logout);


export default router;