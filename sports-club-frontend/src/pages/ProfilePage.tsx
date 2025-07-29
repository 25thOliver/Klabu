import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  status: string;
  registrationFeePaid?: boolean;
  membershipStatus?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  sport?: string;
  team?: string;
  joinDate?: string;
  membershipStart?: string;
  membershipEnd?: string;
  annualFeeStatus?: 'pending' | 'paid' | 'approved';
}

const statusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    case 'expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewalSubmitted, setRenewalSubmitted] = useState(false);

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
    if (profile.status === 'active' && profile.annualFeeStatus === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Annual Fee Pending</Badge>
      );
    }
    if (profile.status === 'active' && profile.annualFeeStatus === 'paid') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Awaiting Admin Approval</Badge>
      );
    }
    if (profile.status === 'active' && profile.annualFeeStatus === 'approved') {
      return (
        <Badge className="bg-green-100 text-green-800">Active Member</Badge>
      );
    }
    if (profile.status === 'expired') {
      return (
        <Badge className="bg-red-100 text-red-800">Membership Expired</Badge>
      );
    }
    if (profile.status === 'inactive') {
      return (
        <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      );
    }
    return null;
  };

  // Helper to check if renewal is needed
  const needsRenewal = (profile: UserProfile) => {
    if (!profile.membershipEnd) return false;
    const end = new Date(profile.membershipEnd);
    const now = new Date();
    return end < now;
  };

  // Mock renewal payment submission
  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRenewalSubmitted(true);
    setShowRenewModal(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : profile ? (
        <Card className="p-6 flex flex-col items-center shadow-lg animate-fade-in w-full">
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
          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="flex justify-between">
              <span className="font-medium">Date of Birth:</span>
              <span>{profile.dob || <span className="text-gray-400">-</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{profile.gender || <span className="text-gray-400">-</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{profile.phone || <span className="text-gray-400">-</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span>{profile.address || <span className="text-gray-400">-</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Emergency Contact:</span>
              <span>{profile.emergencyContact || <span className="text-gray-400">-</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Preferred Sport/Position:</span>
              <span>{profile.sport || <span className="text-gray-400">-</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Team:</span>
              <span>{profile.team || <span className="text-gray-400">Not assigned</span>}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Membership Period:</span>
              <span>
                {profile.membershipStart ? new Date(profile.membershipStart).toLocaleDateString() : <span className="text-gray-400">-</span>}
                {' '}–{' '}
                {profile.membershipEnd ? new Date(profile.membershipEnd).toLocaleDateString() : <span className="text-gray-400">-</span>}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Annual Fee Status:</span>
              <Badge className={
                profile.annualFeeStatus === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : profile.annualFeeStatus === 'paid'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }>
                {profile.annualFeeStatus ? profile.annualFeeStatus.charAt(0).toUpperCase() + profile.annualFeeStatus.slice(1) : 'N/A'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Join Date:</span>
              <span>{profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : <span className="text-gray-400">-</span>}</span>
            </div>
          </div>
          {needsRenewal(profile) && !renewalSubmitted && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-center">
              Membership expired. Please pay KES 2,000 to renew. Admin approval required after payment.<br />
              <Button className="mt-2" onClick={() => setShowRenewModal(true)}>
                Renew Membership
              </Button>
            </div>
          )}
          {renewalSubmitted && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-center">
              Payment submitted. Awaiting admin approval.
            </div>
          )}
        </Card>
      ) : null}
      {/* Renewal Payment Modal (mock) */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow max-w-md w-full" onSubmit={handleRenewalSubmit}>
            <h2 className="text-lg font-bold mb-4">Renew Membership</h2>
            <div className="mb-4">Pay <span className="font-bold">KES 2,000</span> for annual membership renewal.</div>
            <input
              className="border p-2 mb-4 w-full rounded"
              type="text"
              placeholder="Payment Reference (mock)"
              required
            />
            <div className="flex justify-end">
              <Button type="button" className="bg-gray-300 mr-2" onClick={() => setShowRenewModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 text-white">
                Submit Payment
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
