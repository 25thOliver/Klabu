import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const sportsOptions = [
  'Football',
  'Basketball',
  'Volleyball',
  'Tennis',
  'Athletics',
  'Swimming',
  'Other',
];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    sport: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        ...form,
        role: 'member',
      });
      setSuccess(true);
      setForm({
        name: '', email: '', password: '', dob: '', gender: '', phone: '', address: '', emergencyContact: '', sport: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg border border-blue-200">
        <h1 className="text-2xl font-bold mb-4 text-center">Register for Club Membership</h1>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="mb-1">To become a member, please fill in your details below.</p>
          <p className="mb-1 font-semibold">Registration fee: <span className="text-green-700">KES 500</span></p>
          <p className="text-sm text-blue-700">After registering, you will need to pay the fee and wait for admin approval before your membership is activated.</p>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success ? (
          <div className="text-green-600 font-semibold text-center">
            Registration successful! Please pay the KES 500 fee and wait for admin approval. You will be notified once your membership is activated.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Preferred Sport/Position</label>
              <select
                name="sport"
                value={form.sport}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
              >
                <option value="">Select</option>
                {sportsOptions.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
