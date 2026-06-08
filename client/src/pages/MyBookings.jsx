
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import api from '../utlis/axios';
import BookingCard from '../components/BookingCard';
import './MyBookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      setBookings((response.data.bookings || []).reverse());
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.delete(`/bookings/${bookingId}`);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="myBooking-loading">
        <div className="myBooking-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="myBooking-page">
      <div className="myBooking-headerCard">
        <div className="myBooking-header">
          <div>
            <p className="myBooking-subtitle">Your Tickets</p>

            <h1 className="myBooking-title">
              My Bookings
            </h1>

            <p className="myBooking-description">
              Manage your ticket confirmations and review booking details.
            </p>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="myBooking-browseButton"
          >
            <FiSearch size={16} />
            Browse Events
          </button>
        </div>
      </div>

      {error && (
        <div className="myBooking-error">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="myBooking-emptyCard">
          <div className="myBooking-emptyIcon">
            🎟️
          </div>

          <p className="myBooking-emptyTitle">
            No bookings yet
          </p>

          <p className="myBooking-emptyText">
            Start browsing events and book your first experience today.
          </p>

          <button
            onClick={() => navigate('/events')}
            className="myBooking-browseButton myBooking-emptyButton"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="myBooking-list">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancelBooking(booking.id)}
              onRefresh={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
}