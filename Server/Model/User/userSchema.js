import mongoose from "mongoose"
import bcrypt from "bcrypt"
const USER_SECRET = process.env.USER_SECRET
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required:true
  },

  role: {
    type: String,
    enum: ["superadmin", "owner", "student"],
    default: "student"
  },

  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel"
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },

  joiningDate: {
    type: Date
  },

  rentAmount: {
    type: Number
  },

 tokens: [
    {
      token: {
        type:String
      }
    }
  ],


  createdAt: {
    type: Date,
    default: Date.now
  }

});


userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


userSchema.methods.generateToken=async function(req,res){
    try {
     const newtoekn=jwt.sign({_id:this._id},USER_SECRET,{
       expiresIn:"1d"
     });
     this.tokens=this.tokens.concat({token:newtoekn})
     await this.save();
     return newtoekn
   
    } catch (errors) {
    console.log(errors);
    }
   }

export default mongoose.model("User", userSchema);