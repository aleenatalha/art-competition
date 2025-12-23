import React, { useState, useEffect } from 'react';
import { competitionsAPI, bookingsAPI } from '../api';
import { Competition, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'competitions' | 'bookings'>('competitions');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Painting',
    date: '',
    location: '',
    max_participants: 50,
    entry_fee: 0,
    image_url: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadCompetitions();
    loadBookings();
  }, [user, navigate]);

  const loadCompetitions = async () => {
    try {
      const response = await competitionsAPI.getAll({});
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error loading competitions:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await competitionsAPI.create(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'Painting',
        date: '',
        location: '',
        max_participants: 50,
        entry_fee: 0,
        image_url: '',
      });
      loadCompetitions();
      alert('Competition created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create competition');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this competition?')) {
      return;
    }

    try {
      await competitionsAPI.delete(id);
      loadCompetitions();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete competition');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await competitionsAPI.update(id, { status });
      loadCompetitions();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

        <div className="mb-6 flex gap-4 justify-center">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`px-6 py-2 rounded ${
              activeTab === 'competitions'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Competitions
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded ${
              activeTab === 'bookings'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            All Bookings
          </button>
        </div>

        {activeTab === 'competitions' && (
          <div>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90"
              >
                {showForm ? 'Cancel' : 'Add New Competition'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Create New Competition</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Painting">Painting</option>
                        <option value="Sculpture">Sculpture</option>
                        <option value="Photography">Photography</option>
                        <option value="Digital Art">Digital Art</option>
                        <option value="Mixed Media">Mixed Media</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Participants
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.max_participants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_participants: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entry Fee ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.entry_fee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            entry_fee: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90"
                  >
                    Create Competition
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {competitions.map((competition) => (
                <div
                  key={competition.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{competition.title}</h3>
                      <p className="text-gray-600 mb-2">{competition.category}</p>
                      <p className="text-gray-700 mb-4">{competition.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>Date: {formatDate(competition.date)}</p>
                        <p>Location: {competition.location}</p>
                        <p>
                          Participants: {competition.current_participants} /{' '}
                          {competition.max_participants}
                        </p>
                        <p>Entry Fee: ${competition.entry_fee}</p>
                      </div>
                    </div>

                    <div className="ml-4 space-y-2">
                      <select
                        value={competition.status}
                        onChange={(e) =>
                          handleStatusChange(competition.id, e.target.value)
                        }
                        className="px-3 py-1 border border-gray-300 rounded"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleDelete(competition.id)}
                        className="block w-full px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Competition</p>
                    <p className="font-semibold">{booking.competition_title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User</p>
                    <p className="font-semibold">{booking.user_name}</p>
                    <p className="text-sm text-gray-600">{booking.user_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  {booking.artwork_title && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Artwork</p>
                      <p className="font-semibold">{booking.artwork_title}</p>
                      {booking.artwork_description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.artwork_description}
                        </p>
                      )}
                    </div>
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

export default AdminPanel;
