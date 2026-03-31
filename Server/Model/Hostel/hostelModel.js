import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    hostelName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    room: {
      type: String,
      default: null
    },

    rentAmount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active"
    },

    hostelImage: {
      type: String, 
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model("Hostel", hostelSchema);

export default userModel;