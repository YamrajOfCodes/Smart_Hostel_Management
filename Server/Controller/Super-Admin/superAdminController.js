import User from "../../Model/User/userSchema.js";
import cloudinary from "../../Cloudinary/cloudinary.js";

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    const existingMob  = await User.findOne({phone});

    if (existingUser || existingMob) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      role
    });

    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      message: "User registered successfully",
      data: userData,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const RegisterHostel = (req,res)=>{
  
}
