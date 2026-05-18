import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceType:{
        type:String,
        required:true
    },
      serviceDescription:{
        type:String,
        required:true
    },
    serviceDate:{
        type:String,
        required:true
    },
    notes:{
        type:String,
    }
});


export default mongoose.model("ServiceModel",serviceSchema);