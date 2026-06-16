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
      subjects,
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
      subjects,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Student registered successfully!",
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// login user 
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
        subjects: user.subjects,
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
      subjects: req.user.subjects,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.collegeName = req.body.collegeName || user.collegeName;
      user.branch = req.body.branch || user.branch;
      user.semester = req.body.semester || user.semester;
      user.interests = req.body.interests || user.interests;
      user.dailyFreeHours = req.body.dailyFreeHours || user.dailyFreeHours;
      user.subjects = req.body.subjects || user.subjects;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        subjects: updatedUser.subjects,
        interests: updatedUser.interests,
        dailyFreeHours: updatedUser.dailyFreeHours,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in updateUserProfile: " + error.message });
  }
};
