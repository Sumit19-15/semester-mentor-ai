import Note from "../models/noteModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { subject, topic, title, description, uploadType, fileUrl: bodyFileUrl } = req.body;

    let finalFileUrl = bodyFileUrl;

    if (uploadType === "upload" || !uploadType) { // default to upload if not provided
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (!uploadResponse) {
        return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
      }
      finalFileUrl = uploadResponse.secure_url;
    }

    if (!finalFileUrl) {
       return res.status(400).json({ message: "Link or file is required" });
    }

    const note = await Note.create({
      user: req.user._id,
      subject,
      topic,
      title,
      description,
      fileUrl: finalFileUrl,
      uploadType: uploadType || 'upload'
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

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this note" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
