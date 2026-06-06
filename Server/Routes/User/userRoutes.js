import express from "express";
const router  = express.Router();
import {raiseComplaint,getallComplaints,deleteComplaint} from "../../Controller/User/userComplaintController.js"
import userAuthenticate from "../../Middleware/Resident/adminAuthenticate.js"

router.post("/raisecomplaint/:hostelId",userAuthenticate,raiseComplaint);
router.get("/getallcomplaints/:hostelId",getallComplaints);
router.delete("/deletecomplaint/:complaintId",userAuthenticate,deleteComplaint);










export default router;