import User from "../../Model/User/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, phone,role} = req.body;

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
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Both fields are required"
      });
    }

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const validpassword = await bcrypt.compare(
      password,
      validUser.password
    );

    if (!validpassword) {
      return res.status(401).json({
        message: "Password is incorrect"
      });
    }

    const access_token = await validUser.generateToken();

    res.status(200).json({
      validUser,
      access_token
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token,"sdoskdok");

    // Find user by decoded id
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the token
    user.tokens = user.tokens.filter((element) => {
      return element.token !== token;
    });

    await user.save();

    return res.status(200).json({ message: "User is logged out" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};