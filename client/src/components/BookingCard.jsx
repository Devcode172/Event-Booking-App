
import { useState } from 'react';
import api from '../utlis/axios';
import './BookingCard.css';

export default function BookingCard({ booking, onCancel, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bookingCard-status bookingCard-status-pending';
      case 'confirmed':
        return 'bookingCard-status bookingCard-status-confirmed';
      case 'cancelled':
        return 'bookingCard-status bookingCard-status-cancelled';
      default:
        return 'bookingCard-status bookingCard-status-default';
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await api.post('/bookings/send-otp', {
        booking_id: booking.id,
      });
      alert('OTP sent to your email');
      setLoading(false);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      await api.post(`/bookings/${booking.id}/confirm`, {
        otp,
      });

      setLoading(false);
      if (onRefresh) {
        await onRefresh();
      }
      setStep(1);
      setOtp('');
      alert('Booking confirmed successfully');
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const eventDate = new Date(booking.event_date);
  const isEventPast = eventDate < new Date();

  return (
    <div className="bookingCard-card">
      {/* Header */}
      <div className="bookingCard-header">
        <div>
          <h3 className="bookingCard-title">{booking.event_title}</h3>

          <span className={getStatusStyle(booking.status)}>
            {booking.status}
          </span>
        </div>

        <div className="bookingCard-amountBox">
          <p className="bookingCard-amountLabel">Total Amount</p>
          <p className="bookingCard-amountValue">${booking.total_amount}</p>
        </div>
      </div>

      {/* Grid Info */}
      <div className="bookingCard-grid">
        {[
          { label: 'Seats', value: booking.number_of_seats },
          { label: 'Booking Date', value: new Date(booking.created_at).toLocaleDateString() },
          { label: 'Event Date', value: new Date(booking.event_date).toLocaleDateString() },
          { label: 'Booking ID', value: `#${booking.id}` },
        ].map((item) => (
          <div key={item.label} className="bookingCard-item">
            <p className="bookingCard-itemLabel">{item.label}</p>
            <p className="bookingCard-itemValue">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bookingCard-actions">
        {booking.status === 'pending' && !isEventPast && (
          <>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="bookingCard-btn bookingCard-btn-primary"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <button
              onClick={onCancel}
              className="bookingCard-btn bookingCard-btn-danger"
            >
              Cancel Booking
            </button>
          </>
        )}

        {step === 2 && (
          <div className="bookingCard-otpBox">
            <p className="bookingCard-otpText">
              We've sent a 6-digit OTP to your email.
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bookingCard-input"
              placeholder="000000"
              maxLength="6"
            />

            <button
              onClick={handleConfirmBooking}
              disabled={loading || otp.length !== 6}
              className="bookingCard-btn bookingCard-btn-success bookingCard-btn-full"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {booking.status === 'confirmed' && !isEventPast && (
          <button
            onClick={onCancel}
            className="bookingCard-btn bookingCard-btn-danger"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}