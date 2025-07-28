import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  status: string;
  registrationFeePaid?: boolean;
  membershipStatus?: string;
}

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
      return <div className="text-green-700 font-semibold">You are an admin.</div>;
    }
    if (profile.status === 'pending') {
      return (
        <div className="text-yellow-700 font-semibold">
          Your registration is pending. Please pay the KES 500 fee and wait for admin approval.
        </div>
      );
    }
    if (profile.status === 'active' && !profile.registrationFeePaid) {
      return (
        <div className="text-yellow-700 font-semibold">
          Your account is active, but the registration fee has not been marked as paid. Please contact admin.
        </div>
      );
    }
    if (profile.status === 'active' && profile.registrationFeePaid) {
      return (
        <div className="text-green-700 font-semibold">
          Membership active. Welcome to the club!
        </div>
      );
    }
    if (profile.status === 'inactive') {
      return (
        <div className="text-red-700 font-semibold">
          Your account is inactive. Please contact admin for assistance.
        </div>
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
        <div className="space-y-2">
          <div><span className="font-medium">Name:</span> {profile.name}</div>
          <div><span className="font-medium">Email:</span> {profile.email}</div>
          <div><span className="font-medium">Role:</span> {profile.role}</div>
          <div><span className="font-medium">Status:</span> {profile.status}</div>
          {profile.role !== 'admin' && (
            <>
              <div><span className="font-medium">Registration Fee Paid:</span> {profile.registrationFeePaid ? 'Yes' : 'No'}</div>
              <div><span className="font-medium">Membership Status:</span> {profile.membershipStatus || 'N/A'}</div>
            </>
          )}
          <div className="mt-4">{getStatusMessage()}</div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePage;
