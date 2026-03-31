import express from "express";
import superAdminStorage from "../../Multer/SuperAdmin/superAdminStorage.js";
import {RegisterUser} from "../../Controller/Super-Admin/superAdminController.js"
const router  = express.Router();


router.post("/insertUser",superAdminStorage.single("hostelLogo"),RegisterUser);









export default router;