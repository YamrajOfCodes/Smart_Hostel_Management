import express from "express";
const router = express.Router();
import {
createRoom,
getallRooms,
getHostels,
RegisterHostel,
updateHostel,
deleteHostel, 
getHostelById,
assignedRoom, 
unassigneRoom,
swapResidents,
ChangeRoom,
getResidents,
getResidentById,
updateResident,
deleteResident
} from "../../Controller/Admin/adminController.js";
import adminAuthenticate from "../../Middleware/Admin/adminAuthenticate.js";

router.post("/registerHostel/:ownerId",RegisterHostel)
router.get("/getHostels/:ownerId",getHostels)

router.get("/getIndividualHostel/:hostelId",getHostelById)


router.put("/updateHostel/:hostelId",adminAuthenticate,updateHostel)
router.delete("/deleteHostel/:hostelId",adminAuthenticate,deleteHostel)

router.post("/createRoom/:hostelId",adminAuthenticate,createRoom);
router.get("/getallrooms/:hostelId",adminAuthenticate,getallRooms);
router.put("/assignRoom/:hostelId",adminAuthenticate,assignedRoom);

router.put("/unassignRoom/:roomId",adminAuthenticate,unassigneRoom);
router.put("/swaprooms",adminAuthenticate,swapResidents);
router.put("/changeroom",adminAuthenticate,ChangeRoom);


router.get("/getResidents/:hostelId",adminAuthenticate,getResidents);

router.get("/getHostelById/:hostelId",getHostelById)
router.get("/getResidentById/:residentId",adminAuthenticate,getResidentById)
router.put("/updateResident",adminAuthenticate,updateResident)
router.delete("/deleteResident",adminAuthenticate,deleteResident)

export default router;