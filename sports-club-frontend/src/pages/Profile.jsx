import { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const { success, error } = useNotification();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      const userData = response.data.data || response.data;
      setProfile(userData);
      setFormData({ name: userData.name, email: userData.email });
    } catch (err) {
      const message = err.response?.data?.message || 'Error fetching profile';
      error(message);
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = e => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setUpdatingProfile(true);
    
    try {
      const response = await userAPI.updateProfile(formData);
      const updatedProfile = response.data.data || response.data;
      setProfile(updatedProfile);
      success('Profile updated successfully');
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      error(message);
      console.error('Failed to update profile:', err);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setUpdatingPassword(true);
    
    try {
      await userAPI.updatePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '' });
      success('Password updated successfully');
    } catch (err) {
      const message = err.response?.data?.message || 'Password update failed';
      error(message);
      console.error('Failed to update password:', err);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto my-8 px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto my-8 px-4 max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">👤 Profile</h2>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updatingProfile}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updatingProfile}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updatingProfile}
            >
              {updatingProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">🔐 Change Password</h3>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updatingPassword}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updatingPassword}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updatingPassword}
            >
              {updatingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Account Information */}
        {profile && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Role</p>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium capitalize">{profile.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Membership</p>
                <p className={`font-medium capitalize ${
                  profile.membershipStatus === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {profile.membershipStatus}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Member Since</p>
                <p className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
