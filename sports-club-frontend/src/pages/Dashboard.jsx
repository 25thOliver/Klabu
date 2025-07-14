import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { paymentAPI } from "../services/api";
import { eventAPI } from "../services/api";
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { error } = useNotification();

  const [profile, setProfile] = useState({});
  const [events, setEvents] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, eventsRes, membershipRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        eventAPI.getAll(),
        paymentAPI.checkMembership()
      ]);
      
      setProfile(profileRes);
      setEvents(eventsRes.data);
      setMembershipStatus(membershipRes.data);
    } catch (err) {
      error('Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingRSVPs = events.filter(evt =>
    evt.attendees?.some(a => a._id === user?.id) &&
    new Date(evt.date) >= new Date()
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMembershipBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading dashboard...</p>
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg uppercase tracking-tight">Welcome to Your Sports Club</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">Stay connected, join events, and celebrate your passion for sports with our vibrant community.</p>
            <button
              className="btn-accent text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              onClick={() => navigate('/events')}
            >
              Explore Events
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {/* Example sports image/illustration (replace src as needed) */}
            <img
              src={image1}
              alt="Sports Club Hero"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
              className="w-72 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/40"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Photo Gallery Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-6 uppercase tracking-wide">Club Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[image2, image3, image4, image5, image6, image1].map((img, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200 group cursor-pointer">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={img}
                    alt={`Club Highlight ${idx + 1}`}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-dark-800 mb-1">Highlight Title {idx + 1}</h3>
                  <p className="text-sm text-secondary-600">A short description of this club moment or achievement goes here.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800 mb-2">
            Welcome back, {profile.name || user?.name}! 👋
          </h1>
          <p className="text-secondary-600">Here's what's happening with your sports club membership</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile & Membership Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {profile.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-dark-800">{profile.name || user?.name}</h2>
                  <p className="text-secondary-600">{profile.email || user?.email}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {profile.role?.toUpperCase() || 'MEMBER'}
                  </span>
                </div>
              </div>

              {/* Membership Status */}
              <div className="space-y-4">
                <div className="p-4 bg-accent-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-dark-800">Membership Status</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipBadge(membershipStatus?.membershipStatus)}`}>
                      {membershipStatus?.membershipStatus?.toUpperCase() || 'INACTIVE'}
                    </span>
                  </div>
                  
                  {membershipStatus?.isActive ? (
                    <div className="space-y-2">
                      <p className="text-sm text-secondary-600">
                        <span className="font-medium">Expires:</span> {formatDate(membershipStatus.expiresAt)}
                      </p>
                      <p className="text-sm text-secondary-600">
                        <span className="font-medium">Days remaining:</span> {membershipStatus.daysUntilExpiry}
                      </p>
                      
                      {membershipStatus.daysUntilExpiry <= 30 && membershipStatus.daysUntilExpiry > 0 && (
                        <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                          <p className="text-xs text-yellow-800">
                            ⚠️ Membership expires soon! Consider renewing.
                          </p>
                        </div>
                      )}
                      
                      {membershipStatus.daysUntilExpiry <= 0 && (
                        <div className="p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs text-red-800">
                            🚫 Membership expired! Renew to restore access.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-secondary-600 mb-3">No active membership</p>
                      <button
                        onClick={() => navigate('/membership')}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Get Membership
                      </button>
                    </div>
                  )}
                </div>

                {profile.role === "admin" && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <span className="text-purple-600 mr-2">🛡️</span>
                      <div>
                        <p className="text-sm font-medium text-purple-800">Admin Access</p>
                        <p className="text-xs text-purple-600">Full system access enabled</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full btn-accent"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">{upcomingRSVPs.length}</div>
                <p className="text-sm text-secondary-600">Upcoming Events</p>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-secondary-600 mb-1">
                  {membershipStatus?.isActive ? membershipStatus.daysUntilExpiry : 0}
                </div>
                <p className="text-sm text-secondary-600">Membership Days Left</p>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-accent-600 mb-1">
                  {profile.role === 'admin' ? '∞' : 'Limited'}
                </div>
                <p className="text-sm text-secondary-600">Admin Features</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-800 mb-4">📋 Upcoming Events</h2>
              {upcomingRSVPs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent-600 text-2xl">📅</span>
                  </div>
                  <p className="text-secondary-600 mb-4">No upcoming events RSVP'd yet</p>
                  <button
                    onClick={() => navigate('/events')}
                    className="btn-secondary"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingRSVPs.slice(0, 5).map(evt => (
                    <div key={evt._id} className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-dark-800">{evt.title}</h3>
                        <p className="text-sm text-secondary-600">
                          {formatDate(evt.date)} at {evt.time}
                        </p>
                        {evt.description && (
                          <p className="text-xs text-accent-600 mt-1">{evt.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          RSVP'd
                        </span>
                      </div>
                    </div>
                  ))}
                  {upcomingRSVPs.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => navigate('/my-events')}
                        className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                      >
                        View all {upcomingRSVPs.length} events →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-800 mb-4">🚀 Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/events')}
                  className="p-4 bg-primary-50 rounded-lg text-left hover:bg-primary-100 transition-colors"
                >
                  <div className="text-primary-600 text-xl mb-2">🎯</div>
                  <h3 className="font-semibold text-dark-800">Browse Events</h3>
                  <p className="text-sm text-secondary-600">Find and join upcoming events</p>
                </button>
                
                <button
                  onClick={() => navigate('/facilities/book')}
                  className="p-4 bg-secondary-50 rounded-lg text-left hover:bg-secondary-100 transition-colors"
                >
                  <div className="text-secondary-600 text-xl mb-2">🏟️</div>
                  <h3 className="font-semibold text-dark-800">Book Facilities</h3>
                  <p className="text-sm text-secondary-600">Reserve sports facilities</p>
                </button>
                
                <button
                  onClick={() => navigate('/teams')}
                  className="p-4 bg-accent-50 rounded-lg text-left hover:bg-accent-100 transition-colors"
                >
                  <div className="text-accent-600 text-xl mb-2">👥</div>
                  <h3 className="font-semibold text-dark-800">Join Teams</h3>
                  <p className="text-sm text-secondary-600">Connect with other members</p>
                </button>
                
                <button
                  onClick={() => navigate('/forum')}
                  className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors"
                >
                  <div className="text-green-600 text-xl mb-2">💬</div>
                  <h3 className="font-semibold text-dark-800">Community Forum</h3>
                  <p className="text-sm text-secondary-600">Join discussions</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}