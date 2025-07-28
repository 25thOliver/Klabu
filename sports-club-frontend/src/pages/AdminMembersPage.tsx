import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Applicant {
  _id: string;
  name: string;
  email: string;
  status: string;
  registrationFeePaid: boolean;
  role: string;
}

const AdminMembersPage = () => {
  const [pending, setPending] = useState<Applicant[]>([]);
  const [members, setMembers] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter for active members only
      setMembers(res.data.filter((u: Applicant) => u.status === 'active' && u.role === 'member'));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchMembers();
    // eslint-disable-next-line
  }, []);

  const approveApplicant = async (id: string) => {
    setApproving(id);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending((prev) => prev.filter((a) => a._id !== id));
      // Refresh members list after approval
      fetchMembers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve applicant');
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Membership Approvals</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : pending.length === 0 ? (
        <div>No pending applicants.</div>
      ) : (
        <table className="min-w-full border mb-8">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((applicant) => (
              <tr key={applicant._id}>
                <td className="border px-2 py-1">{applicant.name}</td>
                <td className="border px-2 py-1">{applicant.email}</td>
                <td className="border px-2 py-1">{applicant.status}</td>
                <td className="border px-2 py-1">{applicant.role}</td>
                <td className="border px-2 py-1">
                  <Button
                    onClick={() => approveApplicant(applicant._id)}
                    disabled={approving === applicant._id}
                  >
                    {approving === applicant._id ? 'Approving...' : 'Approve'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2 className="text-xl font-bold mb-2 mt-8">Registered Members</h2>
      {loading ? (
        <div>Loading...</div>
      ) : members.length === 0 ? (
        <div>No registered members found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td className="border px-2 py-1">{member.name}</td>
                <td className="border px-2 py-1">{member.email}</td>
                <td className="border px-2 py-1">{member.status}</td>
                <td className="border px-2 py-1">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMembersPage;
