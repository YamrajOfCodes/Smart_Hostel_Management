import User from "../../Model/User/userSchema.js";
import bcrypt from "bcrypt";

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


 export  const Login = async (req,res) => {

    try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Both fields are required" });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
        return res.status(400).json({ error: "invalid credentials" });
    }

    const validpassword = await bcrypt.compare(password, validUser.password);
    console.log('Password comparison result:', validpassword);

    if (!validpassword) {
        return res.status(400).json({ error: "Password is incorrect" });
    }

    const token = await validUser.generateToken();
    
    const result = {
        validUser,
        token
    };

    res.status(200).json(result);
} catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ error: "Internal Server Error" });
}
 }
