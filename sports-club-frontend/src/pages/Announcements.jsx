import { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../auth/AuthContext';
import { announcementAPI } from '../services/api';
import image11 from '../assets/image11.jpg';
import image12 from '../assets/image12.jpg';
import image13 from '../assets/image13.jpg';
import image14 from '../assets/image14.jpg';
import image15 from '../assets/image15.jpg';
import image16 from '../assets/image16.jpg';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [read, setRead] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const [annRes, userRes] = await Promise.all([
          announcementAPI.getAll(),
          announcementAPI.getUserReadStatus(user.id)
        ]);
        setAnnouncements(annRes.data);
        setRead(userRes.data.readAnnouncements || []);
      } catch (err) {
        error("Failed to load announcements");
        console.error('Failed to load announcements:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user, error]);

  const markAsRead = async (id) => {
    try {
      await announcementAPI.markAsRead(id);
      setRead(prev => [...prev, id]);
    } catch (err) {
      error('Failed to mark announcement as read');
      console.error('Mark as read failed:', err);
    }
  };

  const unreadCount = announcements.filter(a => !read.includes(a._id)).length;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-accent-200">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50 py-8">
      {/* Hero/Banner Section */}
      <section className="relative mb-12">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-500/90 via-accent-500/80 to-secondary-500/80 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg uppercase tracking-tight">Latest Announcements</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">Stay up to date with club news and updates.</p>
            <button
              className="btn-accent text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
            >
              {user?.role === 'admin' ? 'Post Announcement' : 'See All News'}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={image11}
              alt="Announcements Hero"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
              className="w-72 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/40"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Announcement Highlights Gallery */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-6 uppercase tracking-wide">Announcement Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[image12, image13, image14, image15, image16, image11].map((img, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200 group cursor-pointer">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={img}
                    alt={`Announcement Highlight ${idx + 1}`}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-dark-800 mb-1">Announcement Highlight {idx + 1}</h3>
                  <p className="text-sm text-secondary-600">A short description of this announcement or achievement goes here.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <h2 className="text-2xl font-bold mb-6 text-dark-800 flex items-center">
          📢 Announcements
          {unreadCount > 0 && (
            <span className="ml-3 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {unreadCount} New
            </span>
          )}
        </h2>

        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-secondary-600 text-lg">No announcements yet.</p>
            <p className="text-accent-600 text-sm mt-2">Check back later for updates!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map(ann => {
              const isRead = read.includes(ann._id);
              return (
                <div
                  key={ann._id}
                  className={`card ${isRead ? 'opacity-75' : 'border-l-4 border-primary-500'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-dark-800">
                      {ann.title}
                      {!isRead && <span className="ml-2 text-primary-500 text-sm">• New</span>}
                    </h3>
                    {!isRead && (
                      <button
                        onClick={() => markAsRead(ann._id)}
                        className="bg-primary-500 text-white text-xs px-3 py-1 rounded hover:bg-primary-600 transition-colors duration-200"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <p className="text-secondary-700 mb-2">{ann.message}</p>
                  <p className="text-xs text-accent-600 flex items-center gap-1">
                    🕒 {new Date(ann.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
