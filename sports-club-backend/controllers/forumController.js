const Post = require('../models/Post');
const Reply = require('../models/Reply');
const mongoose = require('mongoose');

exports.getAllPosts = async (req, res) => {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
  
    const withFormattedDate = posts.map(p => ({
      ...p._doc,
      createdAt: p.createdAt,
      formattedDate: new Date(p.createdAt).toLocaleString()
    }));
  
    res.json(withFormattedDate);
  };
  

exports.createPost = async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.create({ title, body, author: req.user._id });
  res.status(201).json(post);
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid post ID' });

  const post = await Post.findById(id).populate('author', 'name email');
  if (!post) return res.status(404).json({ message: 'Post not found' });

  res.json(post);
};

exports.deletePost = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  await Post.findByIdAndDelete(req.params.id);
  await Reply.deleteMany({ post: req.params.id });
  res.json({ message: 'Post and replies deleted' });
};

exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const userId = req.user._id;

  if (!post) return res.status(404).json({ message: 'Post not found' });

  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json({ likes: post.likes.length });
};

exports.getReplies = async (req, res) => {
    const replies = await Reply.find({ post: req.params.id })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });
  
    const formatted = replies.map(r => ({
      ...r._doc,
      createdAt: r.createdAt,
      formattedDate: new Date(r.createdAt).toLocaleString()
    }));
  
    res.json(formatted);
  };
  ;

exports.addReply = async (req, res) => {
  const reply = await Reply.create({
    post: req.params.id,
    text: req.body.text,
    author: req.user._id,
  });
  res.status(201).json(reply);
};
