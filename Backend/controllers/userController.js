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
      if (req.body.name !== undefined) user.name = req.body.name;
      if (req.body.email !== undefined) user.email = req.body.email;
      if (req.body.collegeName !== undefined) user.collegeName = req.body.collegeName;
      if (req.body.branch !== undefined) user.branch = req.body.branch;
      if (req.body.semester !== undefined) user.semester = req.body.semester;
      if (req.body.interests !== undefined) user.interests = req.body.interests;
      if (req.body.dailyFreeHours !== undefined) user.dailyFreeHours = req.body.dailyFreeHours;
      if (req.body.subjects !== undefined) user.subjects = req.body.subjects;

      if (req.body.password) {
        if (!req.body.oldPassword) {
          return res.status(400).json({ message: "Old password is required to set a new password." });
        }
        const isMatch = await user.matchPassword(req.body.oldPassword);
        if (!isMatch) {
          return res.status(400).json({ message: "Incorrect old password." });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        collegeName: updatedUser.collegeName,
        branch: updatedUser.branch,
        semester: updatedUser.semester,
        interests: updatedUser.interests,
        dailyFreeHours: updatedUser.dailyFreeHours,
        subjects: updatedUser.subjects,
        token: generateToken(updatedUser._id),
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

export const logoutUser = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const TokenBlacklist = (await import("../models/TokenBlacklistModel.js")).default;
      await TokenBlacklist.create({ token });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({ message: "Server error during logout" });
  }
};
