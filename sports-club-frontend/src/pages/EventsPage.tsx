import React, { useState } from 'react';

// Mock user role (in a real app, get this from auth context)
const mockUser = {
  id: 2,
  name: 'John Doe',
  role: 'member', // Change to 'admin' to test admin UI
};

// Mock events data
const initialEvents = [
  {
    id: 1,
    title: 'Annual Football Tournament',
    description: 'Join us for the annual football tournament. Teams from all over the city will compete!',
    date: '2024-07-15',
    location: 'Main Football Field',
  },
  {
    id: 2,
    title: 'Tennis Doubles Night',
    description: 'A fun night of doubles tennis matches. All skill levels welcome.',
    date: '2024-06-20',
    location: 'Tennis Court 1',
  },
  {
    id: 3,
    title: 'Basketball Skills Clinic',
    description: 'Improve your basketball skills with our expert coaches.',
    date: '2024-05-10',
    location: 'Indoor Basketball Court',
  },
];

const EventsPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  // Sort events by date
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

  // View event details
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Add event (admin only, UI only)
  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([
      ...events,
      {
        id: events.length + 1,
        ...newEvent,
      },
    ]);
    setShowAddEventModal(false);
    setNewEvent({ title: '', description: '', date: '', location: '' });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      {mockUser.role === 'admin' && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setShowAddEventModal(true)}
        >
          Add Event
        </button>
      )}

      <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
      <ul className="mb-8">
        {upcomingEvents.length === 0 && <li className="text-gray-500">No upcoming events.</li>}
        {upcomingEvents.map(event => (
          <li key={event.id} className="mb-4 p-4 border rounded cursor-pointer hover:bg-gray-50" onClick={() => handleViewEvent(event)}>
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-gray-600">{event.date} @ {event.location}</div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Past Events</h2>
      <ul>
        {pastEvents.length === 0 && <li className="text-gray-500">No past events.</li>}
        {pastEvents.map(event => (
          <li key={event.id} className="mb-4 p-4 border rounded cursor-pointer hover:bg-gray-50" onClick={() => handleViewEvent(event)}>
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-gray-600">{event.date} @ {event.location}</div>
          </li>
        ))}
      </ul>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">{selectedEvent.title}</h2>
            <div className="mb-2 text-gray-700">{selectedEvent.date} @ {selectedEvent.location}</div>
            <div className="mb-4">{selectedEvent.description}</div>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowEventModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Event Modal (Admin Only) */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow max-w-md w-full" onSubmit={handleAddEvent}>
            <h2 className="text-lg font-bold mb-4">Add New Event</h2>
            <input
              className="border p-2 mb-2 w-full rounded"
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
            <textarea
              className="border p-2 mb-2 w-full rounded"
              placeholder="Description"
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
            <input
              className="border p-2 mb-2 w-full rounded"
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
            <input
              className="border p-2 mb-4 w-full rounded"
              type="text"
              placeholder="Location"
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowAddEventModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
