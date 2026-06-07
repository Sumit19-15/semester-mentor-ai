import Note from "../models/noteModel.js";

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { subject, topic, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const fileUrl = `/${req.file.path}`;

    const note = await Note.create({
      user: req.user._id,
      subject,
      topic,
      title,
      description,
      fileUrl,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notes for the logged-in student
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const query = { user: req.user._id };

    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const notes = await Note.find(query)
      .populate("subject", "name")
      .populate("topic", "title");

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
