import Thread from '../models/thread.js';
import Reply from '../models/reply.js';

export const createThread = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const thread = new Thread({
      title,
      description,
      category,
      author: req.user.userId,
    });
    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Error creating thread', error: error.message });
  }
};

export const getThreads = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const threads = await Thread.find(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .lean();

    const threadsWithLatestReply = await Promise.all(
      threads.map(async (thread) => {
        const latestReply = await Reply.findOne({ thread: thread._id })
          .sort({ createdAt: -1 })
          .lean();
        return {
          ...thread,
          latestReplyDate: latestReply ? latestReply.createdAt : null,
        };
      })
    );

    res.json(threadsWithLatestReply);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching threads', error: error.message });
  }
};

export const getThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
    .populate('author', 'username')
    .populate('category', 'name');
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    const replies = await Reply.find({ thread: req.params.id }).populate('author', 'username');
    res.json({ thread, replies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thread', error: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const reply = new Reply({
      content,
      author: req.user.userId,
      thread: req.params.threadId,
    });
    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reply', error: error.message });
  }
};

export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    if (thread.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }
    await Thread.findByIdAndDelete(req.params.id);
    await Reply.deleteMany({ thread: req.params.id });
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting thread', error: error.message });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    if (reply.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }
    await Reply.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reply', error: error.message });
  }
};