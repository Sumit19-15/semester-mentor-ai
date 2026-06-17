import Resource from "../models/resourceModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res) => {
  try {
    const { subject, topic, title, link, type, description, uploadType } = req.body;

    let finalLink = link;

    if (uploadType === "upload") {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (!uploadResponse) {
        return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
      }
      finalLink = uploadResponse.secure_url;
    }

    if (!title || !finalLink || !type) {
      return res
        .status(400)
        .json({ message: "Title, link, and type are required." });
    }

    const resource = await Resource.create({
      user: req.user._id,
      subject,
      topic,
      title,
      link: finalLink,
      uploadType: uploadType || "link",
      type,
      description,
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all resources for the logged-in student
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res) => {
  try {
    const query = { user: req.user._id };

    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const resources = await Resource.find(query)
      .populate("subject", "name")
      .populate("topic", "title");

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Server Error ", error: error.message });
  }
};
