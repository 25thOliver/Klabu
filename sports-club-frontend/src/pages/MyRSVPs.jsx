// MyRSVPs.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { eventAPI } from '../services/api';

const MyRSVPs = () => {
  const [events, setEvents] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    axios.get(`${API}/events`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const filtered = res.data.filter(evt =>
          evt.attendees?.some(u => u._id === userId)
        );

        const sorted = filtered.sort((a, b) => (b.attendees.length || 0) - (a.attendees.length || 0));
        setEvents(sorted);
      })
      .catch(() => {
        useNotification('error', 'Failed to load events');
      });
  }, []);

  return (
    <Layout>
      <div className="container">
        <h2 className="events-title">📌 My RSVP'd Events</h2>
        {events.length === 0 ? (
          <p className="no-events">You haven’t RSVP’d to any events yet.</p>
        ) : (
          <ul className="events-list">
            {events.map(evt => {
              const isUpcoming = new Date(evt.date) >= new Date();
              return (
                <li key={evt._id} className={`event-card ${isUpcoming ? 'upcoming' : ''}`}>
                  <div className="event-title">{evt.title}</div>
                  <div className="event-date">{evt.date?.slice(0, 10)} at {evt.time}</div>
                  <div className="event-description">{evt.description}</div>
                  <div className="event-attendees">👥 Attendees: {evt.attendees?.length}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default MyRSVPs;