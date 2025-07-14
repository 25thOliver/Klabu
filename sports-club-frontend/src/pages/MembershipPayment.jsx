// MembershipPayment.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { paymentAPI } from '../services/api';
import { useAuth } from '../auth/AuthContext';

const MembershipPayment = () => {
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('manual');
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const { user } = useAuth();

  const MEMBERSHIP_FEE = 1500;
  const MEMBERSHIP_DURATION = 365; // days

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setLoading(true);
      const [statusResponse, historyResponse] = await Promise.all([
        paymentAPI.checkMembership(),
        paymentAPI.getMembershipHistory()
      ]);
      
      setMembershipStatus(statusResponse.data);
      setPaymentHistory(historyResponse.data);
    } catch (err) {
      error('Failed to load membership data');
      console.error('Membership data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await paymentAPI.activateMembership(selectedPaymentMethod);
      success('✅ Membership activated successfully for 1 year!');
      await loadMembershipData(); // Reload data to show updated status
    } catch (err) {
      error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading membership information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-800 mb-2">🏆 Membership Management</h1>
          <p className="text-secondary-600">Manage your sports club membership and payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Membership Status Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-dark-800">Membership Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(membershipStatus?.membershipStatus)}`}>
                  {membershipStatus?.membershipStatus?.toUpperCase() || 'INACTIVE'}
                </span>
              </div>

              {membershipStatus?.isActive ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-accent-50 rounded-lg">
                      <p className="text-sm text-secondary-600">Started</p>
                      <p className="font-semibold text-dark-800">{formatDate(membershipStatus.startedAt)}</p>
                    </div>
                    <div className="p-4 bg-accent-50 rounded-lg">
                      <p className="text-sm text-secondary-600">Expires</p>
                      <p className="font-semibold text-dark-800">{formatDate(membershipStatus.expiresAt)}</p>
                    </div>
                  </div>

                  {membershipStatus.daysUntilExpiry > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Days Remaining</p>
                          <p className="text-2xl font-bold text-blue-800">{membershipStatus.daysUntilExpiry}</p>
                        </div>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xl">📅</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {membershipStatus.daysUntilExpiry <= 30 && membershipStatus.daysUntilExpiry > 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <p className="text-yellow-800">
                          Your membership expires soon! Consider renewing to maintain access to all club services.
                        </p>
                      </div>
                    </div>
                  )}

                  {membershipStatus.daysUntilExpiry <= 0 && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">🚫</span>
                        <p className="text-red-800">
                          Your membership has expired. Renew now to restore access to all club services.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent-600 text-2xl">💳</span>
                  </div>
                  <h3 className="text-lg font-semibold text-dark-800 mb-2">No Active Membership</h3>
                  <p className="text-secondary-600 mb-6">
                    Purchase a membership to access all sports club services including facility bookings, events, and more.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-800 mb-6">Purchase Membership</h2>
              
              <div className="space-y-6">
                {/* Membership Details */}
                <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">KES {MEMBERSHIP_FEE.toLocaleString()}</p>
                    <p className="text-sm text-secondary-600">Annual Membership</p>
                    <div className="mt-2 text-xs text-accent-600">
                      <p>✓ Access to all facilities</p>
                      <p>✓ Event participation</p>
                      <p>✓ Team membership</p>
                      <p>✓ Forum access</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="form-input"
                    disabled={processing}
                  >
                    <option value="manual">Manual Payment (Cash/Check)</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing || (membershipStatus?.isActive && membershipStatus?.daysUntilExpiry > 30)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    processing || (membershipStatus?.isActive && membershipStatus?.daysUntilExpiry > 30)
                      ? 'bg-accent-300 text-accent-600 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : membershipStatus?.isActive && membershipStatus?.daysUntilExpiry > 30 ? (
                    'Membership Active'
                  ) : (
                    'Purchase Membership'
                  )}
                </button>

                {membershipStatus?.isActive && membershipStatus?.daysUntilExpiry <= 30 && (
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-3 px-4 rounded-lg font-semibold bg-secondary-500 text-white hover:bg-secondary-600 transition-colors duration-200"
                  >
                    {processing ? 'Processing...' : 'Renew Membership'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <div className="mt-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-dark-800 mb-6">Payment History</h2>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-dark-800">KES {payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-secondary-600">
                        {formatDate(payment.paidAt)} • {payment.method}
                      </p>
                      <p className="text-xs text-accent-600">Ref: {payment.reference}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPayment;
