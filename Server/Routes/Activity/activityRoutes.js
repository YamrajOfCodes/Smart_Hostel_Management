import express from "express";
const router = express.Router();

import {subscribePush,unsubscribePush} from "../../Controller/Activity/activityController.js"
import adminAuthenticate from "../../Middleware/Admin/adminAuthenticate.js"


router.post("/subscribe",adminAuthenticate, subscribePush);
router.delete("/unsubscribe",adminAuthenticate, unsubscribePush);




export default router;