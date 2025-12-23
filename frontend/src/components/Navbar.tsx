import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Art Competition Hub
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-gray-200 transition">
              Competitions
            </Link>

            {user ? (
              <>
                <Link to="/my-bookings" className="hover:text-gray-200 transition">
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-gray-200 transition">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
