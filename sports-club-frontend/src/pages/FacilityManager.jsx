import { useEffect, useState } from 'react';
import axios from 'axios';

const FacilityManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: 0 });
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const headers = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };
  
  axios.get(`${API}/facilities`, headers) // or .post(), .delete(), etc.
  

  const loadFacilities = async () => {
    const res = await axios.get(`${API}/facilities`, headers);
    setFacilities(res.data);
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/facilities`, form, headers);
    setForm({ name: '', description: '' });
    loadFacilities();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/facilities/${id}`, headers);
    loadFacilities();
  };

  return (
    <div className="container">
      <h2>🏗 Facility Manager</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Facility Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price in KES"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <button type="submit">Add Facility</button>
      </form>

      <ul>
        {facilities.map(fac => (
          <li key={fac._id} className="card">
            <strong>{fac.name}</strong>
            <p>{fac.description}</p>
            <button onClick={() => handleDelete(fac._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacilityManager;
