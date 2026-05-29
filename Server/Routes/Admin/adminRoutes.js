import express from "express";
const router = express.Router();
import {createRoom,getallRooms,getHostels,RegisterHostel,updateHostel,deleteHostel, getHostelById,assignedRoom} from "../../Controller/Admin/adminController.js";
import adminAuthenticate from "../../Middleware/Admin/adminAuthenticate.js";

router.post("/registerHostel/:ownerId",RegisterHostel)
router.get("/getHostels/:ownerId",getHostels)

router.get("/getIndividualHostel/:hostelId",getHostelById)


router.put("/updateHostel/:hostelId",adminAuthenticate,updateHostel)
router.delete("/deleteHostel/:hostelId",adminAuthenticate,deleteHostel)

router.post("/createRoom/:hostelId",adminAuthenticate,createRoom);
router.get("/getallrooms/:hostelId",adminAuthenticate,getallRooms);
router.put("/assignRoom/:hostelId",adminAuthenticate,assignedRoom)

export default router;