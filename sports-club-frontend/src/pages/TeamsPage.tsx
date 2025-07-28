import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  members: User[];
  joinRequests: User[];
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  // Fetch current user info (for role and id)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {}
    };
    fetchUser();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Create team
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/teams`, newTeam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreate(false);
      setNewTeam({ name: '', description: '' });
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  // Edit team
  const startEdit = (team: Team) => {
    setEditingId(team._id);
    setEditForm({ name: team.name, description: team.description });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };
  const saveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/teams/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      setEditForm({ name: '', description: '' });
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  // Delete team
  const confirmDelete = (id: string) => setDeletingId(id);
  const cancelDelete = () => setDeletingId(null);
  const deleteTeam = async () => {
    if (!deletingId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/teams/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletingId(null);
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete team');
    } finally {
      setLoading(false);
    }
  };

  // Join/Leave team
  const joinTeam = async (id: string) => {
    setApproving(id);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/teams/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request join');
    } finally {
      setApproving(null);
    }
  };
  const leaveTeam = async (id: string) => {
    setApproving(id);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/teams/${id}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to leave team');
    } finally {
      setApproving(null);
    }
  };

  // Admin: Approve join request
  const approveJoin = async (teamId: string, userId: string) => {
    setApproving(teamId + userId);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/teams/${teamId}/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve join request');
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {user?.role === 'admin' && (
        <div className="mb-4">
          <Button onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancel' : 'Create New Team'}
          </Button>
        </div>
      )}
      {showCreate && user?.role === 'admin' && (
        <form onSubmit={handleCreateTeam} className="mb-6 p-4 bg-blue-50 rounded border border-blue-200 max-w-md">
          <div className="mb-2">
            <label className="block mb-1 font-bold text-blue-900">Team Name</label>
            <input
              type="text"
              name="name"
              value={newTeam.name}
              onChange={handleCreateChange}
              required
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-bold text-blue-900">Description</label>
            <textarea
              name="description"
              value={newTeam.description}
              onChange={handleCreateChange}
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>
          <Button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Team'}
          </Button>
        </form>
      )}
      {loading ? (
        <div>Loading teams...</div>
      ) : teams.length === 0 ? (
        <div>No teams found.</div>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => {
            const isMember = !!user && team.members.some((m) => m._id === user._id);
            const hasRequested = !!user && team.joinRequests.some((r) => r._id === user._id);
            return (
              <div key={team._id} className="border rounded p-4 bg-white shadow">
                <div className="flex justify-between items-center mb-2">
                  {editingId === team._id ? (
                    <>
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border px-2 py-1 rounded mb-1 w-full"
                        />
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm">Save</Button>
                        <Button onClick={cancelEdit} size="sm" variant="secondary">Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-xl font-bold text-blue-900">{team.name}</div>
                        <div className="text-gray-700 mb-1">{team.description}</div>
                        <div className="text-xs text-gray-500">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</div>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="flex gap-2">
                          <Button onClick={() => startEdit(team)} size="sm">Edit</Button>
                          <Button onClick={() => confirmDelete(team._id)} size="sm" variant="destructive">Delete</Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Members:</span>
                  {team.members.length === 0 ? (
                    <span className="ml-2 text-gray-500">No members yet.</span>
                  ) : (
                    <ul className="ml-4 list-disc">
                      {team.members.map((m) => (
                        <li key={m._id}>{m.name} ({m.email})</li>
                      ))}
                    </ul>
                  )}
                </div>
                {team.joinRequests.length > 0 && (
                  <div className="mt-2">
                    <span className="font-semibold text-yellow-700">Join Requests:</span>
                    <ul className="ml-4 list-disc">
                      {team.joinRequests.map((r) => (
                        <li key={r._id} className="flex items-center gap-2">
                          {r.name} ({r.email})
                          {user?.role === 'admin' && (
                            <Button
                              size="sm"
                              onClick={() => approveJoin(team._id, r._id)}
                              disabled={approving === team._id + r._id}
                            >
                              {approving === team._id + r._id ? 'Approving...' : 'Approve'}
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Member join/leave actions */}
                {user && user.role === 'member' && (
                  <div className="mt-2">
                    {isMember ? (
                      <Button size="sm" onClick={() => leaveTeam(team._id)} disabled={approving === team._id}>
                        {approving === team._id ? 'Leaving...' : 'Leave Team'}
                      </Button>
                    ) : hasRequested ? (
                      <span className="text-yellow-700 font-semibold">Join requested</span>
                    ) : (
                      <Button size="sm" onClick={() => joinTeam(team._id)} disabled={approving === team._id}>
                        {approving === team._id ? 'Requesting...' : 'Request to Join'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Delete confirmation dialog */}
      {deletingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this team?</p>
            <div className="flex gap-4 justify-end">
              <Button onClick={deleteTeam} variant="destructive">Yes, Delete</Button>
              <Button onClick={cancelDelete} variant="secondary">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
