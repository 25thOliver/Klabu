import React, { useState, useRef } from 'react';
import Picker from '@emoji-mart/react';

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

const GIPHY_API_KEY = '7oRgyuHNPBYWiZ7SsNGXfuy3wi2yrB6J';

const ForumPage = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const replyRef = useRef();
  const newThreadRef = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(''); // '' | 'reply' | 'thread'
  const [showStickerPicker, setShowStickerPicker] = useState('');
  const [showGifPicker, setShowGifPicker] = useState('');
  const [giphyResults, setGiphyResults] = useState([]);
  const [giphyQuery, setGiphyQuery] = useState('');
  const [giphyLoading, setGiphyLoading] = useState(false);

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
    setGiphyResults([]);
    setGiphyQuery('');
    setGiphyLoading(false);
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

  // Giphy search (GIF or sticker)
  const handleGiphySearch = async (type, query) => {
    setGiphyLoading(true);
    setGiphyResults([]);
    setGiphyQuery(query);
    let endpoint =
      type === 'gif'
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=18&rating=pg`
        : `https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=18&rating=pg`;
    const res = await fetch(endpoint);
    const data = await res.json();
    setGiphyResults(data.data.map((item) => item.images.fixed_height.url));
    setGiphyLoading(false);
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

      {/* Emoji Picker (emoji-mart) */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">
            <Picker
              onEmojiSelect={emoji => handleInsert('emoji', emoji.native, showEmojiPicker)}
              title="Pick your emoji"
              emoji="point_up"
              previewPosition="none"
              skinTonePosition="none"
            />
            <button className="mt-2 text-sm text-gray-500" onClick={() => setShowEmojiPicker('')}>Close</button>
          </div>
        </div>
      )}
      {/* Sticker Picker (Giphy) */}
      {showStickerPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow max-w-xs w-full">
            <div className="mb-2 font-semibold">Search Stickers</div>
            <input
              className="border p-2 w-full rounded mb-2"
              type="text"
              placeholder="Search stickers..."
              value={giphyQuery}
              onChange={e => handleGiphySearch('sticker', e.target.value)}
              autoFocus
            />
            {giphyLoading && <div>Loading...</div>}
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {giphyResults.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleInsert('sticker', url + ' ', showStickerPicker)}
                >
                  <img src={url} alt="sticker" className="h-14 w-14" />
                </button>
              ))}
            </div>
            <button className="mt-2 text-sm text-gray-500" onClick={() => { setShowStickerPicker(''); setGiphyResults([]); setGiphyQuery(''); }}>Close</button>
          </div>
        </div>
      )}
      {/* GIF Picker (Giphy) */}
      {showGifPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow max-w-xs w-full">
            <div className="mb-2 font-semibold">Search GIFs</div>
            <input
              className="border p-2 w-full rounded mb-2"
              type="text"
              placeholder="Search GIFs..."
              value={giphyQuery}
              onChange={e => handleGiphySearch('gif', e.target.value)}
              autoFocus
            />
            {giphyLoading && <div>Loading...</div>}
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {giphyResults.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleInsert('gif', url + ' ', showGifPicker)}
                >
                  <img src={url} alt="gif" className="h-20 w-20" />
                </button>
              ))}
            </div>
            <button className="mt-2 text-sm text-gray-500" onClick={() => { setShowGifPicker(''); setGiphyResults([]); setGiphyQuery(''); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPage;
