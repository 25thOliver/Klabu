import { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import Layout from '../components/Layout';

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filtered, setFiltered] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API}/events`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEvents(res.data))
      .catch(() => console.error('Error loading events'));
  }, []);

  useEffect(() => {
    const dateStr = selectedDate.toLocaleDateString('en-CA');
    const matches = events.filter(e => e.date?.slice(0, 10) === dateStr);
    setFiltered(matches);
  }, [selectedDate, events]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-6 shadow rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">📆 Event Calendar</h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              className="w-full rounded border border-gray-300 calendar-fix"
              tileClassName={({ date, view }) => {
                const dateStr = date.toLocaleDateString('en-CA');
                const hasEvent = events.some(e => e.date?.slice(0, 10) === dateStr);
                return hasEvent ? 'bg-blue-100 font-semibold' : '';
              }}
            />
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Events on {selectedDate.toDateString()}:
            </h3>
            {filtered.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No events scheduled.</p>
            ) : (
              <ul className="space-y-4">
                {filtered.map(evt => (
                  <li key={evt._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded border shadow-sm">
                    <strong className="block text-gray-900 dark:text-white">{evt.title}</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{evt.time}</p>
                    <p className="text-gray-600 italic dark:text-gray-400">{evt.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">👥 {evt.attendees?.length || 0} attending</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
