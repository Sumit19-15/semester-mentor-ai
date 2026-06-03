import Pyq from "../models/pyqModel.js";

// @desc    Upload a new PYQ
// @route   POST /api/pyqs
// @access  Private
export const createPyq = async (req, res) => {
  try {
    const { subject, topic, title, fileUrl, year } = req.body;

    if (!subject || !title || !fileUrl || !year) {
      return res
        .status(400)
        .json({ message: "Subject, title, fileUrl, and year are required." });
    }

    const pyq = await Pyq.create({
      user: req.user._id,
      subject,
      topic, // Optional, as some PYQs cover the whole subject
      title,
      fileUrl,
      year,
    });

    res.status(201).json(pyq);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all PYQs for the logged-in student
// @route   GET /api/pyqs
// @access  Private
export const getPyqs = async (req, res) => {
  try {
    const pyqs = await Pyq.find({ user: req.user._id })
      .populate("subject", "name")
      .populate("topic", "title");

    res.status(200).json(pyqs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
