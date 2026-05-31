import Resource from "../models/resourceModel.js";

export const createResource = async (req, res) => {
  try {
    const { title, subject, link, description } = req.body;

    if (!title || !subject || !link) {
      return res
        .status(400)
        .json({ message: "Please provide title, subject, and link" });
    }

    const resource = await Resource.create({
      user: req.user._id,
      title,
      subject,
      link,
      description,
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
