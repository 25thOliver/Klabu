import { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [facilities, setFacilities] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    axios.get(`${API}/facilities`, headers).then(res => {
      const userBookings = res.data.map(f => ({
        name: f.name,
        bookings: f.bookings.filter(b => b.user?._id === user.id)
      })).filter(f => f.bookings.length > 0);
      setFacilities(userBookings);
    });
  }, []);

  return (
    <div className="container">
      <h2>📝 My Bookings</h2>
      {facilities.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        facilities.map(f => (
          <div key={f.name} className="card">
            <h3>{f.name}</h3>
            <ul>
              {f.bookings.map((b, idx) => (
                <li key={idx}>
                  📆 {b.date} ⏰ {b.time}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
