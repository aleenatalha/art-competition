import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../api';
import { Booking } from '../types';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(id);
      loadBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            You haven't made any bookings yet.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {booking.competition_title}
                    </h3>

                    <div className="space-y-1 text-gray-600 mb-4">
                      <p>Date: {formatDate(booking.competition_date!)}</p>
                      <p>Location: {booking.competition_location}</p>
                      <p>Booked on: {formatDate(booking.booking_date)}</p>
                    </div>

                    {booking.artwork_title && (
                      <div className="bg-gray-50 p-4 rounded mb-4">
                        <p className="font-semibold mb-1">Artwork Title:</p>
                        <p className="text-gray-700">{booking.artwork_title}</p>
                        {booking.artwork_description && (
                          <>
                            <p className="font-semibold mt-2 mb-1">Description:</p>
                            <p className="text-gray-700">{booking.artwork_description}</p>
                          </>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <span
                        className={`px-3 py-1 text-sm rounded ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm rounded ${
                          booking.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : booking.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        Payment: {booking.payment_status}
                      </span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
