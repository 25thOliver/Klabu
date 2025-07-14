// PostDetail.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import EmojiPicker from '../components/EmojiPicker';

const PostDetail = () => {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    axios.get(`${API}/forum/posts/${id}`, headers)
      .then(res => setPost(res.data))
      .catch(() => console.error('Failed to load post'));

    axios.get(`${API}/forum/posts/${id}/replies`, headers)
      .then(res => setReplies(res.data))
      .catch(() => console.error('Failed to load replies'));
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`${API}/forum/posts/${id}/replies`, { text }, headers);
      setText('');
      const res = await axios.get(`${API}/forum/posts/${id}/replies`, headers);
      setReplies(res.data);
    } catch {
      console.error("Reply failed");
    }
  };

  const handleEmojiSelect = (emoji) => {
    // Insert emoji at cursor position
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    setShowEmoji(false);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 0);
  };

  if (!post) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          by {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleString()}
        </p>
        <p className="mb-4 text-gray-800">{post.body}</p>

        <form onSubmit={handleReply} className="mb-4 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 border border-gray-300 rounded mb-2"
            rows={4}
          />
          <button
            type="button"
            className="absolute right-12 bottom-3 text-2xl hover:bg-gray-100 rounded p-1"
            onClick={() => setShowEmoji(true)}
            tabIndex={-1}
            aria-label="Add emoji"
          >
            😊
          </button>
          <button type="submit" className="btn">💬 Reply</button>
          <EmojiPicker
            isOpen={showEmoji}
            onClose={() => setShowEmoji(false)}
            onEmojiSelect={handleEmojiSelect}
          />
        </form>

        <div>
          <h4 className="font-semibold mb-2">Replies</h4>
          {replies.length === 0 ? (
            <p className="text-gray-500 italic">No replies yet.</p>
          ) : (
            <ul className="space-y-3">
              {replies.map(r => (
                <li key={r._id} className="border border-gray-200 p-3 rounded">
                  <p className="text-sm text-gray-800">{r.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    — {r.author?.name || 'Anonymous'}, {new Date(r.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
