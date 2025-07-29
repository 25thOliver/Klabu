import React, { useState } from 'react';

// Mock user role (in a real app, get this from auth context)
const mockUser = {
  id: 2,
  name: 'John Doe',
  role: 'member', // Change to 'admin' to test admin UI
};

// Mock facilities data
const mockFacilities = [
  { id: 1, name: 'Football Field', description: 'Full-size outdoor football field.' },
  { id: 2, name: 'Tennis Court', description: 'Clay tennis court, well maintained.' },
  { id: 3, name: 'Basketball Court', description: 'Indoor basketball court with seating.' },
];

// Initial mock bookings
const initialBookings = [
  // Example: { id: 1, facilityId: 1, userId: 2, userName: 'John Doe', status: 'pending' }
];

const FacilitiesPage = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Handle booking request
  const handleBook = (facility) => {
    setSelectedFacility(facility);
    setShowBookingForm(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    setBookings([
      ...bookings,
      {
        id: bookings.length + 1,
        facilityId: selectedFacility.id,
        userId: mockUser.id,
        userName: mockUser.name,
        status: 'pending',
      },
    ]);
    setShowBookingForm(false);
    setSelectedFacility(null);
  };

  // Admin approval (UI only)
  const handleApprove = (bookingId) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'approved' } : b
      )
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Facilities</h1>
      <ul className="mb-8">
        {mockFacilities.map((facility) => (
          <li key={facility.id} className="mb-4 p-4 border rounded">
            <div className="font-semibold">{facility.name}</div>
            <div className="text-sm text-gray-600 mb-2">{facility.description}</div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
              onClick={() => handleBook(facility)}
              disabled={mockUser.role === 'admin'}
            >
              Book Facility
            </button>
          </li>
        ))}
      </ul>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow" onSubmit={handleSubmitBooking}>
            <h2 className="text-lg font-bold mb-2">Book {selectedFacility.name}</h2>
            <div className="mb-4">Booking will be pending admin approval.</div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Submit Request
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowBookingForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Booking Requests</h2>
      <ul>
        {bookings.length === 0 && <li className="text-gray-500">No bookings yet.</li>}
        {bookings.map((booking) => {
          const facility = mockFacilities.find(f => f.id === booking.facilityId);
          return (
            <li key={booking.id} className="mb-2 p-3 border rounded flex items-center justify-between">
              <div>
                <span className="font-medium">{facility.name}</span> —
                <span className="ml-1">{booking.userName}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                  {booking.status}
                </span>
              </div>
              {mockUser.role === 'admin' ? (
                booking.status === 'pending' && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleApprove(booking.id)}
                  >
                    Approve
                  </button>
                )
              ) : (
                <button
                  className="bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed"
                  disabled
                  title="Only admins can approve bookings"
                >
                  Approve
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FacilitiesPage;
