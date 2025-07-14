import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import image13 from '../assets/image13.jpg';
import image14 from '../assets/image14.jpg';
import image15 from '../assets/image15.jpg';
import image16 from '../assets/image16.jpg';
import image17 from '../assets/image17.jpg';
import image18 from '../assets/image18.jpg';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/forum/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setPosts(res.data))
      .catch(() => console.error("Failed to load posts"));
  }, []);

  return (
    <Layout>
      {/* Hero/Banner Section */}
      <section className="relative mb-12">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-500/90 via-accent-500/80 to-secondary-500/80 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg uppercase tracking-tight">Community Forum</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">Share, discuss, and connect with fellow members.</p>
            <Link
              to="/forum/new"
              className="btn-accent text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform inline-block"
            >
              Start a Discussion
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={image13}
              alt="Forum Hero"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
              className="w-72 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/40"
            />
          </div>
        </div>
      </section>

      <div className="container">
        {/* Forum Moments Gallery */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-6 uppercase tracking-wide">Forum Moments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                title: 'Best Debate',
                desc: 'Members passionately discussing the big match.'
              },
              {
                img: 'https://images.unsplash.com/photo-1505843279827-4b522b6c1d57?auto=format&fit=crop&w=400&q=80',
                title: 'Top Post',
                desc: 'A post that sparked the most engagement this month.'
              },
              {
                img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
                title: 'Fan Cheers',
                desc: 'Fans celebrating a last-minute goal together.'
              },
              {
                img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                title: 'Team Spirit',
                desc: 'Members showing their club pride.'
              },
              {
                img: 'https://images.unsplash.com/photo-1505843279827-4b522b6c1d57?auto=format&fit=crop&w=400&q=80',
                title: 'Community Support',
                desc: 'Coming together to support a good cause.'
              },
              {
                img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
                title: 'Celebration Night',
                desc: 'A night of fun after a big win.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200 group cursor-pointer">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={`https://picsum.photos/400/300?random=${idx}`}
                    alt={item.title}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-dark-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-secondary-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🗣 Community Forum</h2>
          <Link to="/forum/new" className="btn">+ New Post</Link>
        </div>

        {posts.length === 0 ? (
          <p>No forum posts yet.</p>
        ) : (
          <ul>
            {posts.map(post => (
              <li key={post._id} className="card">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  By {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleString()}
                </p>
                <p>{post.body.slice(0, 100)}...</p>
                <Link to={`/forum/posts/${post._id}`} className="text-blue-600 hover:underline mt-1 block">
                  Read More →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Forum;
