import ChatSession from "../models/chatSessionModel.js";
import ChatMessage from "../models/chatMessageModel.js";
import { generateChatResponseWithAi } from "../services/aiProviderService.js";

// @desc    Get all chat sessions for a user (can filter by type, subject, topic)
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const { type, subjectId, topicId } = req.query;

    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (subjectId) filter.subject = subjectId;
    if (topicId) filter.topic = topicId;
    // For global chats where subject/topic are null, we can check for them explicitly if needed.
    // If we want specifically Global chats, type='GLOBAL' is sufficient.

    const chats = await ChatSession.find(filter).sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chats", error: error.message });
  }
};

// @desc    Create a new chat session
// @route   POST /api/chats
// @access  Private
export const createChatSession = async (req, res) => {
  try {
    const { title, type, subjectId, topicId } = req.body;

    const newChatSession = await ChatSession.create({
      user: req.user._id,
      title: title || "New Conversation",
      type: type || "MODULE",
      subject: subjectId || null,
      topic: topicId || null,
    });

    res.status(201).json(newChatSession);
  } catch (error) {
    res.status(500).json({ message: "Failed to create chat session", error: error.message });
  }
};

// @desc    Get messages for a specific chat session
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req, res) => {
  try {
    const chatSession = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    const messages = await ChatMessage.find({ chatSession: chatSession._id }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

// @desc    Send a message to a chat session and get AI response
// @route   POST /api/chats/:id/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    const chatSession = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // 1. Save user message
    const userMessage = await ChatMessage.create({
      chatSession: chatSession._id,
      role: "user",
      content,
    });

    // 2. Fetch recent history for context (limit to last 10 messages to save tokens)
    const history = await ChatMessage.find({ chatSession: chatSession._id })
      .sort({ createdAt: 1 })
      .limit(10);

    // Format for AI provider
    const formattedMessages = [
      { role: "system", content: "You are Semester Mentor AI. Help the student with their academic inquiries." },
      ...history.map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content
      }))
    ];

    // 3. Get AI Response
    const aiResponse = await generateChatResponseWithAi({ messages: formattedMessages });

    // 4. Save AI message
    const aiMessage = await ChatMessage.create({
      chatSession: chatSession._id,
      role: "ai",
      content: aiResponse.content,
    });

    // Update chat session updatedAt
    chatSession.updatedAt = Date.now();
    await chatSession.save();

    res.status(200).json({
      userMessage,
      aiMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to process message", error: error.message });
  }
};
