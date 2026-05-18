import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  floor: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    enum: ["AC", "Non-AC"],
    default: "Non-AC",
  },
  beds: {
    type: Number,     
    required: true,
  },
  roomRent: {
    type: Number,
    required: true,
  },
  hostelId: {
    type: String,
    required: true,
  },
  roomMembers: {
    type: [String],     
    default: [],
  },
  status: {
    type: String,
    enum: ["vacant", "occupied", "partial", "maintenance"],
    default: "vacant",
  },
  amenities: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// Unique room number per hostel
roomSchema.index({ roomNumber: 1, hostelId: 1 }, { unique: true });

const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;