import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
      hostelId:{
        type:String,
        required:true
    },
    userId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User"
    },
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
    },
    status:{
      type:String,
      required:true
    }
});


export default mongoose.model("ComplaintModel",complaintSchema);