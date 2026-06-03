import Resource from "../models/resourceModel.js";

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res) => {
  try {
    const { subject, topic, title, link, type, description } = req.body;

    if (!title || !link || !type) {
      return res
        .status(400)
        .json({ message: "Title, link, and type are required." });
    }

    const resource = await Resource.create({
      user: req.user._id,
      subject,
      topic,
      title,
      link,
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
    const resources = await Resource.find({ user: req.user._id })
      .populate("subject", "name")
      .populate("topic", "title");

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
