import express from "express";
const router = express.Router();
import {createRoom,getallRooms} from "../../Controller/Admin/adminController.js";

router.post("/createRoom/:hostelId",createRoom);
router.get("/getallrooms/:hostelId",getallRooms);

export default router;