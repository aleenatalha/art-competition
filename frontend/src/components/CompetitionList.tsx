import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { competitionsAPI } from '../api';
import { Competition } from '../types';

const CompetitionList: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', status: 'open' });

  useEffect(() => {
    loadCompetitions();
  }, [filter]);

  const loadCompetitions = async () => {
    try {
      const response = await competitionsAPI.getAll(filter);
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error loading competitions:', error);
    } finally {
      setLoading(false);
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
        <div className="text-xl">Loading competitions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Art Competitions</h1>

        <div className="mb-6 flex gap-4">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            <option value="Painting">Painting</option>
            <option value="Sculpture">Sculpture</option>
            <option value="Photography">Photography</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Mixed Media">Mixed Media</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {competitions.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No competitions found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {competition.image_url && (
                  <img
                    src={competition.image_url}
                    alt={competition.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{competition.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
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

                  <p className="text-sm text-gray-600 mb-2">{competition.category}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {competition.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Date: {formatDate(competition.date)}</p>
                    <p>Location: {competition.location}</p>
                    <p>
                      Participants: {competition.current_participants} /{' '}
                      {competition.max_participants}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Entry Fee: ${competition.entry_fee}
                    </p>
                  </div>

                  <Link
                    to={`/competition/${competition.id}`}
                    className="block w-full text-center bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionList;
