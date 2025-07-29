import React, { useState } from 'react';

// Mock user (in a real app, get this from auth context)
const mockUser = {
  id: 2,
  name: 'John Doe',
  role: 'member',
};

// Mock forum data
const initialThreads = [
  {
    id: 1,
    title: 'Welcome to the Club Forum!',
    author: 'Admin',
    posts: [
      { id: 1, author: 'Admin', content: 'Feel free to introduce yourself and ask questions!', date: '2024-05-01' },
      { id: 2, author: 'John Doe', content: 'Hi everyone! Excited to join the club.', date: '2024-05-02' },
    ],
  },
  {
    id: 2,
    title: 'Looking for Tennis Partners',
    author: 'Alice',
    posts: [
      { id: 1, author: 'Alice', content: 'Anyone up for a game this weekend?', date: '2024-05-03' },
      { id: 2, author: 'Bob', content: 'I am! Let me know what time works.', date: '2024-05-03' },
    ],
  },
];

// Mock stickers and GIFs
const stickers = [
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44d.png', // thumbs up
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png', // party popper
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60d.png', // heart eyes
];
const gifs = [
  'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
];
const emojis = ['😀', '😂', '🎾', '⚽', '🏀', '👍', '🎉', '😍', '🔥', '🙌'];

function insertAtCursor(value, insert) {
  // Helper for textarea insertion
  if (!value.ref || !value.ref.current) return;
  const textarea = value.ref.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = value.state;
  const newText = text.slice(0, start) + insert + text.slice(end);
  value.setState(newText);
  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + insert.length;
  }, 0);
}

const ForumPage = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const replyRef = React.useRef();
  const newThreadRef = React.useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(''); // '' | 'reply' | 'thread'
  const [showStickerPicker, setShowStickerPicker] = useState('');
  const [showGifPicker, setShowGifPicker] = useState('');

  // Create new thread
  const handleCreateThread = (e) => {
    e.preventDefault();
    const newId = threads.length + 1;
    setThreads([
      {
        id: newId,
        title: newThread.title,
        author: mockUser.name,
        posts: [
          {
            id: 1,
            author: mockUser.name,
            content: newThread.content,
            date: new Date().toISOString().slice(0, 10),
          },
        ],
      },
      ...threads,
    ]);
    setShowNewThreadModal(false);
    setNewThread({ title: '', content: '' });
  };

  // Reply to thread
  const handleReply = (e) => {
    e.preventDefault();
    setThreads(
      threads.map((thread) =>
        thread.id === selectedThread.id
          ? {
              ...thread,
              posts: [
                ...thread.posts,
                {
                  id: thread.posts.length + 1,
                  author: mockUser.name,
                  content: replyContent,
                  date: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : thread
      )
    );
    setReplyContent('');
  };

  // Insert emoji/sticker/gif into reply or thread
  const handleInsert = (type, value, target) => {
    if (target === 'reply') {
      setReplyContent(replyContent + value);
      setShowEmojiPicker('');
      setShowStickerPicker('');
      setShowGifPicker('');
    } else if (target === 'thread') {
      setNewThread({ ...newThread, content: newThread.content + value });
      setShowEmojiPicker('');
      setShowStickerPicker('');
      setShowGifPicker('');
    }
  };

  // Render post content (emojis as text, stickers/gifs as images if URL)
  const renderContent = (content) => {
    // If content contains a sticker/gif URL, render as image
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return <img key={i} src={part} alt="media" className="inline h-8 align-middle mx-1" />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Forum</h1>
      {!selectedThread ? (
        <>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => setShowNewThreadModal(true)}
          >
            New Thread
          </button>
          <ul>
            {threads.length === 0 && <li className="text-gray-500">No threads yet.</li>}
            {threads.map((thread) => (
              <li
                key={thread.id}
                className="mb-4 p-4 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedThread(thread)}
              >
                <div className="font-semibold">{thread.title}</div>
                <div className="text-sm text-gray-600">By {thread.author} • {thread.posts.length} posts</div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <button
            className="mb-4 text-blue-600 underline"
            onClick={() => setSelectedThread(null)}
          >
            ← Back to Threads
          </button>
          <div className="mb-4 p-4 border rounded">
            <div className="font-bold text-lg mb-2">{selectedThread.title}</div>
            <ul>
              {selectedThread.posts.map((post) => (
                <li key={post.id} className="mb-3 border-b pb-2">
                  <div className="text-sm text-gray-700 mb-1">{post.author} <span className="text-gray-400">({post.date})</span></div>
                  <div>{renderContent(post.content)}</div>
                </li>
              ))}
            </ul>
          </div>
          <form className="mt-4" onSubmit={handleReply}>
            <div className="flex gap-2 mb-2">
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowEmojiPicker('reply')}>😀</button>
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowStickerPicker('reply')}>🖼️</button>
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowGifPicker('reply')}>GIF</button>
            </div>
            <textarea
              ref={replyRef}
              className="border p-2 w-full rounded mb-2"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Reply
            </button>
          </form>
        </div>
      )}

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow max-w-md w-full" onSubmit={handleCreateThread}>
            <h2 className="text-lg font-bold mb-4">New Thread</h2>
            <input
              className="border p-2 mb-2 w-full rounded"
              type="text"
              placeholder="Thread Title"
              value={newThread.title}
              onChange={e => setNewThread({ ...newThread, title: e.target.value })}
              required
            />
            <div className="flex gap-2 mb-2">
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowEmojiPicker('thread')}>😀</button>
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowStickerPicker('thread')}>🖼️</button>
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowGifPicker('thread')}>GIF</button>
            </div>
            <textarea
              ref={newThreadRef}
              className="border p-2 mb-4 w-full rounded"
              placeholder="Initial Post Content"
              value={newThread.content}
              onChange={e => setNewThread({ ...newThread, content: e.target.value })}
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowNewThreadModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create Thread
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow flex flex-wrap gap-2 max-w-xs">
            {emojis.map((emoji, i) => (
              <button
                key={i}
                className="text-2xl"
                onClick={() => handleInsert('emoji', emoji, showEmojiPicker)}
              >
                {emoji}
              </button>
            ))}
            <button className="ml-auto text-sm text-gray-500" onClick={() => setShowEmojiPicker('')}>Close</button>
          </div>
        </div>
      )}
      {/* Sticker Picker */}
      {showStickerPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow flex flex-wrap gap-2 max-w-xs">
            {stickers.map((url, i) => (
              <button
                key={i}
                onClick={() => handleInsert('sticker', url + ' ', showStickerPicker)}
              >
                <img src={url} alt="sticker" className="h-10 w-10" />
              </button>
            ))}
            <button className="ml-auto text-sm text-gray-500" onClick={() => setShowStickerPicker('')}>Close</button>
          </div>
        </div>
      )}
      {/* GIF Picker */}
      {showGifPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow flex flex-wrap gap-2 max-w-xs">
            {gifs.map((url, i) => (
              <button
                key={i}
                onClick={() => handleInsert('gif', url + ' ', showGifPicker)}
              >
                <img src={url} alt="gif" className="h-14 w-14" />
              </button>
            ))}
            <button className="ml-auto text-sm text-gray-500" onClick={() => setShowGifPicker('')}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPage;
