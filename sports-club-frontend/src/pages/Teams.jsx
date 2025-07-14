import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { teamAPI } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import image19 from '../assets/image19.jpg';
import image20 from '../assets/image20.jpg';
import image17 from '../assets/image17.jpg';
import image18 from '../assets/image18.jpg';
import image15 from '../assets/image15.jpg';
import image16 from '../assets/image16.jpg';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const { success, error } = useNotification();
  const { user } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (err) {
      error('Failed to load teams');
      console.error('Teams fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const createTeam = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(prev => ({ ...prev, create: true }));
      await teamAPI.create(form);
      success("Team created successfully");
      setForm({ name: '', description: '' });
      await fetchTeams();
    } catch (err) {
      error(err.response?.data?.message || "Team creation failed");
    } finally {
      setActionLoading(prev => ({ ...prev, create: false }));
    }
  };

  const requestJoin = async (teamId) => {
    try {
      setActionLoading(prev => ({ ...prev, [teamId]: true }));
      await teamAPI.requestJoin(teamId);
      success("Join request sent successfully");
      await fetchTeams();
    } catch (err) {
      error(err.response?.data?.message || "Request failed");
    } finally {
      setActionLoading(prev => ({ ...prev, [teamId]: false }));
    }
  };

  const leaveTeam = async (teamId) => {
    try {
      setActionLoading(prev => ({ ...prev, [teamId]: true }));
      await teamAPI.leaveTeam(teamId);
      success("Left team successfully");
      await fetchTeams();
    } catch (err) {
      error(err.response?.data?.message || "Leave failed");
    } finally {
      setActionLoading(prev => ({ ...prev, [teamId]: false }));
    }
  };

  const approveUser = async (teamId, userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`approve-${teamId}-${userId}`]: true }));
      await teamAPI.approveUser(teamId, userId);
      success("User approved successfully");
      await fetchTeams();
    } catch (err) {
      error(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve-${teamId}-${userId}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50 py-8">
      {/* Hero/Banner Section */}
      <section className="relative mb-12">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-500/90 via-accent-500/80 to-secondary-500/80 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg uppercase tracking-tight">Meet the Teams</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">Join, create, and collaborate with fellow club members.</p>
            <button
              className="btn-accent text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              onClick={() => document.getElementById('teams-list')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {user?.role === 'admin' ? 'Create a Team' : 'Find a Team'}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={image19}
              alt="Teams Hero"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable'; }}
              className="w-72 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/40"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800 mb-2">🏆 Teams</h1>
          <p className="text-secondary-600">Join teams and collaborate with other members</p>
        </div>

        {/* Admin Create Team */}
        {user?.role === 'admin' && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-dark-800 mb-4">Create New Team</h2>
            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label htmlFor="teamName" className="form-label">Team Name</label>
                <input
                  id="teamName"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter team name"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="teamDescription" className="form-label">Description</label>
                <textarea
                  id="teamDescription"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter team description"
                  className="form-input"
                  rows="3"
                />
              </div>
              <button 
                type="submit" 
                disabled={actionLoading.create}
                className="btn-primary"
              >
                {actionLoading.create ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Team'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Teams List */}
        <div className="space-y-6" id="teams-list">
          {teams.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-600 text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-dark-800 mb-2">No Teams Available</h3>
              <p className="text-secondary-600">Check back later or contact an admin to create teams.</p>
            </div>
          ) : (
            teams.map((team, idx) => {
              const isMember = team.members?.some(m => m._id === user?.id || m === user?.id);
              const hasRequested = team.joinRequests?.some(r => r._id === user?.id || r === user?.id);

              return (
                <div key={team._id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-dark-800">{team.name}</h3>
                      <p className="text-secondary-600 mt-1">{team.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isMember && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Member
                        </span>
                      )}
                      {hasRequested && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-dark-700 mb-2">👥 Members ({team.members?.length || 0})</h4>
                    {team.members?.length === 0 ? (
                      <p className="text-accent-600 italic">No members yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {team.members.map((member, idx) => (
                          <div key={member._id || idx} className="flex items-center space-x-2 p-2 bg-accent-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {member.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-dark-800">
                                {member.name || 'Unknown'}
                              </p>
                              <p className="text-xs text-secondary-600">
                                {member.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Member Actions */}
                  {user?.role === 'member' && (
                    <div className="flex space-x-3">
                      {!isMember && !hasRequested && (
                        <button 
                          onClick={() => requestJoin(team._id)}
                          disabled={actionLoading[team._id]}
                          className="btn-secondary"
                        >
                          {actionLoading[team._id] ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Requesting...
                            </div>
                          ) : (
                            'Request to Join'
                          )}
                        </button>
                      )}
                      {hasRequested && (
                        <span className="text-sm text-yellow-600 font-medium">
                          ⏳ Pending approval...
                        </span>
                      )}
                      {isMember && (
                        <button 
                          onClick={() => leaveTeam(team._id)}
                          disabled={actionLoading[team._id]}
                          className="btn-accent"
                        >
                          {actionLoading[team._id] ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Leaving...
                            </div>
                          ) : (
                            'Leave Team'
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Admin sees join requests */}
                  {user?.role === 'admin' && team.joinRequests?.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-dark-800 mb-3">🔒 Pending Join Requests</h4>
                      <div className="space-y-3">
                        {team.joinRequests.map((req) => (
                          <div key={req._id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-yellow-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {req.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-dark-800">
                                  {req.name || 'Unknown'}
                                </p>
                                <p className="text-xs text-secondary-600">
                                  {req.email || 'No email'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => approveUser(team._id, req._id)}
                              disabled={actionLoading[`approve-${team._id}-${req._id}`]}
                              className="btn-primary text-sm px-4 py-2"
                            >
                              {actionLoading[`approve-${team._id}-${req._id}`] ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                  Approving...
                                </div>
                              ) : (
                                'Approve'
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
