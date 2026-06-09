import express from "express";
const router  = express.Router();
import {raiseComplaint,getallComplaints,deleteComplaint} from "../../Controller/User/userComplaintController.js"
import {submitNoticePeriod,getMyNoticePeriod,getAllNoticesForHostel,withdrawNoticePeriod} from "../../Controller/User/userNoticePeriodController.js"
import userAuthenticate from "../../Middleware/Resident/residentAuthenticate.js"
import AdminAuthenticate from "../../Middleware/Admin/adminAuthenticate.js";

router.post("/raisecomplaint/:hostelId",userAuthenticate,raiseComplaint);
router.get("/getallcomplaints/:hostelId",getallComplaints);
router.delete("/deletecomplaint/:complaintId",AdminAuthenticate,deleteComplaint);


// notice period routes

router.post("/submitnoticeperiod",userAuthenticate,submitNoticePeriod);
router.get("/getmynoticeperiod/:email",userAuthenticate,getMyNoticePeriod);
router.put("/withdrawnoticeperiod",userAuthenticate,withdrawNoticePeriod);












export default router;