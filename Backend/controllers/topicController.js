import Topic from "../models/topicModel.js";

// @desc    Create a new topic under a specific subject
// @route   POST /api/topics
// @access  Private
export const createTopic = async (req, res) => {
  try {
    const { subject, title, description } = req.body;

    if (!subject || !title) {
      return res
        .status(400)
        .json({ message: "Subject ID and Title are required." });
    }

    const topic = await Topic.create({
      user: req.user._id,
      subject,
      title,
      description,
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update topic progress (Mark as completed)
// @route   PUT /api/topics/:id/complete
// @access  Private
export const completeTopic = async (req, res) => {
  try {
    // Find the topic by the ID passed in the URL
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (topic.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this topic" });
    }

    topic.completed = true;
    topic.completedAt = Date.now();

    const updatedTopic = await topic.save();
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
