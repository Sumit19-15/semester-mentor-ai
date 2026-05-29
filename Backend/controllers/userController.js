import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      collegeName,
      branch,
      semester,
      interests,
      dailyFreeHours,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      collegeName,
      branch,
      semester,
      interests,
      dailyFreeHours,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Student registered successfully!",
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        branch: user.branch,
        semester: user.semester,
        interests: user.interests,
        dailyFreeHours: user.dailyFreeHours,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      collegeName: req.user.collegeName,
      branch: req.user.branch,
      semester: req.user.semester,
      interests: req.user.interests,
      dailyFreeHours: req.user.dailyFreeHours,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
