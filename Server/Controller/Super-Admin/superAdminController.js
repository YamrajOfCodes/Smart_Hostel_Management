import Hostel from "../../Model/Hostel/hostelModel.js"
import User from "../../Model/User/userSchema.js"
import cloudinary from "../../Cloudinary/cloudinary.js";

export const getallAdmins = async (req,res)=>{
    try {
        const getalladmins = await User.find({role:"admin"});
        return res.status(200).json(getalladmins);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}



