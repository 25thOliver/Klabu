import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { eventAPI } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import image7 from '../assets/image7.jpg';
import image8 from '../assets/image8.jpg';
import image9 from '../assets/image9.jpg';
import image10 from '../assets/image10.jpg';
import image11 from '../assets/image11.jpg';
import image12 from '../assets/image12.jpg';

const MemberEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      setEvents(response.data);
    } catch (err) {
      error('Failed to load events');
      console.error('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      const response = await eventAPI.rsvp(eventId);
      success(response.data.message || 'RSVP successful!');
      await fetchEvents(); // Reload events to update attendance
    } catch (err) {
      error(err.response?.data?.message || 'RSVP failed');
    }
  };

  const handleCancelRSVP = async (eventId) => {
    try {
      const response = await eventAPI.cancelRsvp(eventId);
      success(response.data.message || 'RSVP cancelled successfully!');
      await fetchEvents(); // Reload events to update attendance
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel RSVP');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    return timeString;
  };

  const isEventUpcoming = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) >= new Date();
  };

  const isUserAttending = (event) => {
    return event.attendees?.some(attendee => 
      attendee._id === user?.id || attendee === user?.id
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading events...</p>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => isEventUpcoming(event.date));
  const pastEvents = events.filter(event => !isEventUpcoming(event.date));

  return (
    <div className="min-h-screen bg-light-50 py-8">
      {/* Hero/Banner Section */}
      <section className="relative mb-12">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-500/90 via-accent-500/80 to-secondary-500/80 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg uppercase tracking-tight">All Club Events</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">Join, compete, and celebrate with your club community.</p>
            <button
              className="btn-accent text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
            >
              See Past Highlights
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={image7}
              alt="Club Event Hero"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
              className="w-72 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/40"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800 mb-2">📅 Club Events</h1>
          <p className="text-secondary-600">Discover and join exciting sports club events</p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-dark-800 mb-6">Upcoming Events</h2>
          
          {upcomingEvents.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-600 text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-dark-800 mb-2">No Upcoming Events</h3>
              <p className="text-secondary-600 mb-4">Check back later for new events or contact an admin to suggest one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => {
                const attending = isUserAttending(event);
                
                return (
                  <div key={event._id} className="card hover:shadow-lg transition-shadow duration-200">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-dark-800 mb-2">{event.title}</h3>
                      <div className="flex items-center text-secondary-600 text-sm mb-2">
                        <span className="mr-2">📅</span>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-secondary-600 text-sm mb-3">
                        <span className="mr-2">🕒</span>
                        {formatTime(event.time)}
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-accent-600 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-secondary-600">
                        <span className="mr-1">👥</span>
                        {event.attendees?.length || 0} attending
                      </div>
                      {attending && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          You're attending
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {attending ? (
                        <button
                          onClick={() => handleCancelRSVP(event._id)}
                          className="flex-1 btn-accent text-sm"
                        >
                          Cancel RSVP
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRSVP(event._id)}
                          className="flex-1 btn-primary text-sm"
                        >
                          RSVP
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-dark-800 mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.slice(0, 6).map(event => {
                const attended = isUserAttending(event);
                
                return (
                  <div key={event._id} className="card opacity-75 hover:opacity-100 transition-opacity duration-200">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-dark-800 mb-2">{event.title}</h3>
                      <div className="flex items-center text-secondary-600 text-sm mb-2">
                        <span className="mr-2">📅</span>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-secondary-600 text-sm mb-3">
                        <span className="mr-2">🕒</span>
                        {formatTime(event.time)}
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-accent-600 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-secondary-600">
                        <span className="mr-1">👥</span>
                        {event.attendees?.length || 0} attended
                      </div>
                      {attended && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          You attended
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {pastEvents.length > 6 && (
              <div className="text-center mt-6">
                <p className="text-secondary-600">
                  Showing 6 of {pastEvents.length} past events
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{upcomingEvents.length}</div>
            <p className="text-sm text-secondary-600">Upcoming Events</p>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-1">
              {upcomingEvents.filter(event => isUserAttending(event)).length}
            </div>
            <p className="text-sm text-secondary-600">Your RSVPs</p>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-accent-600 mb-1">{pastEvents.length}</div>
            <p className="text-sm text-secondary-600">Past Events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberEvents;