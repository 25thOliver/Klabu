import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { facilityAPI } from '../services/api';

const FacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [booking, setBooking] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState({});
  const { success, error } = useNotification();

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilityAPI.getAll();
      setFacilities(response.data);
    } catch (err) {
      error('Failed to load facilities');
      console.error('Facilities fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleBook = async (facilityId) => {
    if (!booking.date || !booking.time) {
      error('Please select both date and time');
      return;
    }

    try {
      setBookingLoading(prev => ({ ...prev, [facilityId]: true }));
      const response = await facilityAPI.book(facilityId, booking);
      success(response.data.message || 'Booking successful!');
      // Reset booking form
      setBooking({ date: '', time: '' });
    } catch (err) {
      error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(prev => ({ ...prev, [facilityId]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading facilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800 mb-2">🏟️ Book a Facility</h1>
          <p className="text-secondary-600">Reserve sports facilities for your training sessions</p>
        </div>

        {/* Booking Form */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-dark-800 mb-4">📅 Select Date & Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                value={booking.date}
                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                value={booking.time}
                onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Facilities List */}
        {facilities.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-accent-600 text-2xl">🏟️</span>
            </div>
            <h3 className="text-lg font-semibold text-dark-800 mb-2">No Facilities Available</h3>
            <p className="text-secondary-600">Check back later or contact an admin to add facilities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map(facility => (
              <div key={facility._id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-dark-800 mb-2">{facility.name}</h3>
                  {facility.description && (
                    <p className="text-secondary-600 text-sm mb-3 line-clamp-3">
                      {facility.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary-600">
                      {formatPrice(facility.price)}
                    </div>
                    {facility.capacity && (
                      <div className="text-sm text-secondary-600">
                        👥 Capacity: {facility.capacity}
                      </div>
                    )}
                  </div>
                </div>

                {facility.amenities && facility.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-dark-700 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {facility.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleBook(facility._id)}
                  disabled={!booking.date || !booking.time || bookingLoading[facility._id]}
                  className={`w-full btn-primary ${
                    (!booking.date || !booking.time) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {bookingLoading[facility._id] ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </div>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Tips */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-dark-800 mb-3">💡 Booking Tips</h3>
          <ul className="space-y-2 text-sm text-secondary-600">
            <li>• Book at least 24 hours in advance for better availability</li>
            <li>• Cancellations must be made at least 2 hours before the booking time</li>
            <li>• Please arrive 10 minutes before your scheduled time</li>
            <li>• Bring your own equipment unless specified otherwise</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FacilityBooking;
