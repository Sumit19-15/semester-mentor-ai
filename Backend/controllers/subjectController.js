import Subject from "../models/subjectModel.js";

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private (Requires JWT)
export const createSubject = async (req, res) => {
  try {
    const { name, courseCode } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a subject name." });
    }

    const subject = await Subject.create({
      user: req.user._id,
      name,
      courseCode,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all subjects for the logged-in student
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
