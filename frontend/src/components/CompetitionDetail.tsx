import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { competitionsAPI, bookingsAPI } from '../api';
import { Competition } from '../types';
import { useAuth } from '../context/AuthContext';

const CompetitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState('');
  const [artworkDescription, setArtworkDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCompetition();
  }, [id]);

  const loadCompetition = async () => {
    try {
      const response = await competitionsAPI.getById(Number(id));
      setCompetition(response.data);
    } catch (error) {
      console.error('Error loading competition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');
    setBookingLoading(true);

    try {
      await bookingsAPI.create({
        competition_id: Number(id),
        artwork_title: artworkTitle,
        artwork_description: artworkDescription,
      });

      setSuccess('Booking successful! Check your bookings page.');
      setArtworkTitle('');
      setArtworkDescription('');
      loadCompetition();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
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
        <div className="text-xl">Loading competition...</div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Competition not found</div>
      </div>
    );
  }

  const spotsRemaining = competition.max_participants - competition.current_participants;
  const isFullyBooked = spotsRemaining <= 0;
  const isClosed = competition.status !== 'open';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {competition.image_url && (
            <img
              src={competition.image_url}
              alt={competition.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold">{competition.title}</h1>
              <span
                className={`px-3 py-1 text-sm rounded ${
                  competition.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : competition.status === 'closed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {competition.status}
              </span>
            </div>

            <p className="text-lg text-gray-600 mb-6">{competition.category}</p>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {competition.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(competition.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{competition.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entry Fee</p>
                <p className="font-semibold text-primary text-xl">
                  ${competition.entry_fee}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Spots Available</p>
                <p className="font-semibold">
                  {spotsRemaining} / {competition.max_participants}
                </p>
              </div>
            </div>

            {user && competition.status === 'open' && !isFullyBooked && (
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Book Your Spot</h2>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
                    {success}
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={artworkTitle}
                      onChange={(e) => setArtworkTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork Description (Optional)
                    </label>
                    <textarea
                      value={artworkDescription}
                      onChange={(e) => setArtworkDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition disabled:opacity-50 text-lg font-semibold"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              </div>
            )}

            {!user && (
              <div className="border-t pt-6">
                <p className="text-center text-gray-600 mb-4">
                  Please login to book this competition
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                >
                  Login to Book
                </button>
              </div>
            )}

            {isFullyBooked && (
              <div className="border-t pt-6">
                <p className="text-center text-red-600 font-semibold">
                  This competition is fully booked
                </p>
              </div>
            )}

            {isClosed && !isFullyBooked && (
              <div className="border-t pt-6">
                <p className="text-center text-gray-600 font-semibold">
                  This competition is closed for bookings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetail;
