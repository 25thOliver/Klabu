import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  status: string;
  registrationFeePaid?: boolean;
  membershipStatus?: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getStatusMessage = () => {
    if (!profile) return null;
    if (profile.role === 'admin') {
      return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
    }
    if (profile.status === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
      );
    }
    if (profile.status === 'active' && !profile.registrationFeePaid) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Fee Not Paid</Badge>
      );
    }
    if (profile.status === 'active' && profile.registrationFeePaid) {
      return (
        <Badge className="bg-green-100 text-green-800">Active Member</Badge>
      );
    }
    if (profile.status === 'inactive') {
      return (
        <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : profile ? (
        <Card className="p-6 flex flex-col items-center shadow-lg animate-fade-in">
          <Avatar className="mb-4 h-20 w-20 text-3xl bg-blue-200">
            {profile.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="text-xl font-semibold mb-1">{profile.name}</div>
          <div className="text-gray-600 mb-2">{profile.email}</div>
          <div className="flex gap-2 mb-4">
            <Badge className="bg-gray-100 text-gray-800 capitalize">{profile.role}</Badge>
            <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${statusColor(profile.status)}`}>{profile.status}</span>
            {getStatusMessage()}
          </div>
          {profile.role !== 'admin' && (
            <div className="w-full flex flex-col gap-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Registration Fee Paid:</span>
                <Badge className={profile.registrationFeePaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {profile.registrationFeePaid ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Membership Status:</span>
                <Badge className={profile.membershipStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {profile.membershipStatus || 'N/A'}
                </Badge>
              </div>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
};

export default ProfilePage;
