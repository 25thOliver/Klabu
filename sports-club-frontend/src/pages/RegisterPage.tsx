import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role: 'member',
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register for Club Membership</h1>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="mb-1">To become a member, please register below.</p>
        <p className="mb-1 font-semibold">Registration fee: <span className="text-green-700">KES 500</span></p>
        <p className="text-sm text-blue-700">After registering, you will need to pay the fee and wait for admin approval before your membership is activated.</p>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success ? (
        <div className="text-green-600 font-semibold">
          Registration successful! Please pay the KES 500 fee and wait for admin approval. You will be notified once your membership is activated.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
