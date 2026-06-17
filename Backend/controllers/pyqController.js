import Pyq from "../models/pyqModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// @desc    Upload a new PYQ
// @route   POST /api/pyqs
// @access  Private
export const createPyq = async (req, res) => {
  try {
    const { subject, year, title, uploadType, fileUrl: bodyFileUrl } = req.body;

    if (!subject || !year) {
      return res
        .status(400)
        .json({ message: "Subject and Year are required." });
    }

    let finalFileUrl = bodyFileUrl;

    if (uploadType === "upload" || !uploadType) {
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

    const pyq = await Pyq.create({
      user: req.user._id,
      subject,
      title: title || `PYQ ${year}`,
      fileUrl: finalFileUrl,
      uploadType: uploadType || 'upload',
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
    const query = { user: req.user._id };

    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const pyqs = await Pyq.find(query).populate("subject", "name");

    res.status(200).json(pyqs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
