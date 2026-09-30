import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Send a message to another user
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, jobId, attachment } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      job: jobId || null,
      content,
      attachment: attachment || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email profilePhoto role')
      .populate('receiver', 'name email profilePhoto role')
      .populate('job', 'title company');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get message history with a specific user
// @route   GET /api/messages/:otherUserId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email profilePhoto role')
      .populate('receiver', 'name email profilePhoto role')
      .populate('job', 'title company');

    // Mark unread messages sent to me as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of conversations / recent contacts for logged in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email profilePhoto role tagline location')
      .populate('receiver', 'name email profilePhoto role tagline location')
      .populate('job', 'title company');

    const conversationMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender._id.toString() === userId.toString();
      const partner = isSender ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          receiver: userId,
          read: false,
        });

        conversationMap.set(partnerId, {
          user: partner,
          lastMessage: msg,
          unreadCount,
        });
      }
    }

    const conversations = Array.from(conversationMap.values());

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
