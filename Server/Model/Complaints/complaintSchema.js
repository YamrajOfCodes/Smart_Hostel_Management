import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    issueTitle:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true
    }
});


export default mongoose.model("ComplaintModel",complaintSchema);