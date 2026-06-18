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

    let systemContent = "You are Semester Mentor AI. Help the student with their academic inquiries.";

    if (chatSession.subject) {
      const Subject = (await import('../models/Subject.js')).default;
      const Topic = (await import('../models/Topic.js')).default;
      
      const subjectDoc = await Subject.findById(chatSession.subject);
      if (subjectDoc) {
        const topics = await Topic.find({ subject: subjectDoc._id });
        const completedTopics = topics.filter(t => t.isCompleted).length;
        
        systemContent += `\nThe student is asking about the subject: "${subjectDoc.name}". `;
        if (topics.length > 0) {
          systemContent += `They have completed ${completedTopics} out of ${topics.length} modules. `;
          systemContent += `Here are the modules:\n` + topics.map((t, i) => `${i+1}. ${t.title} (${t.isCompleted ? 'Completed' : 'Not Completed'})`).join('\n');
        } else {
          systemContent += `The student has not uploaded a syllabus for this subject yet.`;
        }
      }
    }

    const formattedMessages = [
      { role: "system", content: systemContent },
      ...history.map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content
      }))
    ];

    // 3. Get AI Response
    const abortController = new AbortController();

    req.on('close', () => {
      abortController.abort();
    });

    const aiResponse = await generateChatResponseWithAi({ messages: formattedMessages, signal: abortController.signal });

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
    if (error.name === 'AbortError') {
      console.log('Chat generation aborted by client');
      return; // Do nothing if aborted
    }
    res.status(500).json({ message: "Failed to process message", error: error.message });
  }
};

// @desc    Delete a chat session and all its messages
// @route   DELETE /api/chats/:id
// @access  Private
export const deleteChatSession = async (req, res) => {
  try {
    const chatSession = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Delete all messages in the session
    await ChatMessage.deleteMany({ chatSession: chatSession._id });

    // Delete the session itself
    await ChatSession.deleteOne({ _id: chatSession._id });

    res.status(200).json({ message: "Chat session removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete chat session", error: error.message });
  }
};

// @desc    Update a chat session (e.g. rename)
// @route   PUT /api/chats/:id
// @access  Private
export const updateChatSession = async (req, res) => {
  try {
    const { title } = req.body;

    const chatSession = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    if (title) chatSession.title = title;

    chatSession.updatedAt = Date.now();
    const updatedChat = await chatSession.save();

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Failed to update chat session", error: error.message });
  }
};
