import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["security","water","maintenance","electricity","amenities","other"],
        default:"other"
    },
    body:{
        type:String,
        required:true
    },
    hostelId:{
        type:String,
        required:true
    },
    urgency:{
        type:String,
        enum:["low","medium","high"],
        default:"low"
    },
    pin:{
        type:Boolean
    },
    createdAt:{
        type:Date,
        default:Date.now
     },
})

export default mongoose.model("Notice",noticeSchema)