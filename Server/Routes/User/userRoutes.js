import express from "express";
const router  = express.Router();
import {raiseComplaint,getAllComplaints, requestService, getAllRequestedServices} from "../../Controller/User/userController.js"


router.post("/raise-complaint",raiseComplaint);
router.get("/getallcomplaints",getAllComplaints);

router.post("/request-service",requestService);
router.get("/getallservices",getAllRequestedServices);






export default router;