import { useEffect, useState } from 'react';
import { eventAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data.data || response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Error loading events';
      error(message);
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editId) {
        await eventAPI.update(editId, form);
        success('Event updated successfully');
      } else {
        await eventAPI.create(form);
        success('Event created successfully');
      }
      
      setForm({ title: '', description: '', date: '', time: '' });
      setEditId(null);
      fetchEvents();
    } catch (err) {
      const message = err.response?.data?.message || 'Operation failed';
      error(message);
      console.error('Failed to save event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (evt) => {
    setEditId(evt._id);
    setForm({
      title: evt.title,
      description: evt.description,
      date: evt.date.slice(0, 10),
      time: evt.time || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventAPI.delete(id);
      success('Event deleted successfully');
      fetchEvents();
    } catch (err) {
      const message = err.response?.data?.message || 'Delete failed';
      error(message);
      console.error('Failed to delete event:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', date: '', time: '' });
    setEditId(null);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🛠️ Admin Event Manager</h2>
          
          {/* Event Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editId ? 'Edit Event' : 'Create New Event'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editId ? 'Update Event' : 'Create Event')}
                </button>
                
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Events List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">📅 All Events</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No events found. Create your first event above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map(evt => (
                  <div
                    key={evt._id}
                    className={`border rounded-lg p-4 ${
                      evt.attendees?.length >= (evt.maxAttendees || 999) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {evt.title}
                        {evt.attendees?.length >= (evt.maxAttendees || 999) && (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            Full
                          </span>
                        )}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(evt)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(evt._id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      📅 {new Date(evt.date).toLocaleDateString()} at {evt.time}
                    </p>
                    
                    {evt.description && (
                      <p className="text-gray-700 mb-3">{evt.description}</p>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      👥 Attendees: {evt.attendees?.length || 0} / {evt.maxAttendees || "∞"}
                    </div>
                    
                    {evt.attendees?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Attendees:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {evt.attendees.map((user, idx) => (
                            <li key={user._id || idx}>
                              • {user.name} ({user.email})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminEvents;
