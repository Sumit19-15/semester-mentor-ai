import Note from "../models/noteModel.js";

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { subject, topic, title, fileUrl, description } = req.body;

    if (!subject || !topic || !title || !fileUrl) {
      return res
        .status(400)
        .json({ message: "Subject, topic, title, and fileUrl are required." });
    }

    const note = await Note.create({
      user: req.user._id,
      subject,
      topic,
      title,
      fileUrl,
      description,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all notes for the logged-in student
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .populate("subject", "name")
      .populate("topic", "title");

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
