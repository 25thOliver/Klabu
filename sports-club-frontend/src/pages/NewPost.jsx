import React, { useState, useRef } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import EmojiPicker from '../components/EmojiPicker';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);
  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL;

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/forum/posts`, { title, body }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/forum';
    } catch {
      alert("Error submitting post");
    }
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = body.slice(0, start) + emoji + body.slice(end);
    setBody(newText);
    setShowEmoji(false);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 0);
  };

  return (
    <Layout>
      <div className="container">
        <h2>Create New Post</h2>
        <form onSubmit={submitPost}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <div className="relative mb-2">
            <textarea
              ref={textareaRef}
              placeholder="Body"
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
              rows={6}
            />
            <button
              type="button"
              className="absolute right-2 bottom-2 text-2xl hover:bg-gray-100 rounded p-1"
              onClick={() => setShowEmoji(true)}
              tabIndex={-1}
              aria-label="Add emoji"
            >
              😊
            </button>
            <EmojiPicker
              isOpen={showEmoji}
              onClose={() => setShowEmoji(false)}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
          <button type="submit">Post</button>
        </form>
      </div>
    </Layout>
  );
};

export default NewPost;
