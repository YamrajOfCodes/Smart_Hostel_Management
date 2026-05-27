import express from "express";
import superAdminStorage from "../../Multer/SuperAdmin/superAdminStorage.js";
import {getallAdmins} from "../../Controller/Super-Admin/superAdminController.js"
import superAdminAuthenticate from "../../Middleware/SuperAdmin/superAdminAuthenticate.js";
const router  = express.Router();


// router.post("/insertUser",superAdminStorage.single("hostelLogo"),RegisterUser);

router.get("/getallAdmins",superAdminAuthenticate,getallAdmins);





export default router;