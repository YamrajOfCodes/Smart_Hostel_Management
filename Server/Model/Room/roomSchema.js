import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roomSchema = new Schema(
  {
    hostelId: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },

    roomCategory:{
      type:String,
      enum:["AC","NON_AC"],
      required:true
    },

    roomType:{
      type:String,
      required:true,
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: String,
      required: true,
      trim: true,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Quad", "Dormitory"],
      required: true,
    },

    totalBeds: {
      type: Number,
      required: true,
      min: 1,
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["vacant", "partial", "occupied", "maintenance"],
      default: "vacant",
    },

    roomMembers: [
      {
        tenantId: {
          type: Schema.Types.ObjectId,
          ref: "Tenant",
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        bedNumber: {
          type: Number,
        },
      },
    ],

    amenities: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────
roomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true }); // no duplicate room numbers per hostel
roomSchema.index({ hostelId: 1, status: 1 });                      

roomSchema.virtual("availableBeds").get(function () {
  return this.totalBeds - this.roomMembers.length;
});

roomSchema.virtual("occupancyPercent").get(function () {
  if (this.totalBeds === 0) return 0;
  return Math.round((this.roomMembers.length / this.totalBeds) * 100);
});


const Room = model("Room", roomSchema);
export default Room;