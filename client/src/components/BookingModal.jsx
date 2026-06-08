
import { useState } from 'react';
import api from '../utlis/axios';
import { FiX } from 'react-icons/fi';
import './BookingModal.css';

export default function BookingModal({ event, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [otp, setOtp] = useState('');

  const total = seats * event.ticket_price;

  const handleBookEvent = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/bookings', {
        event_id: event.id,
        number_of_seats: seats,
      });

      setBookingId(response.data.booking.id);
      setStep(2);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError('');

      await api.post('/bookings/send-otp', {
        booking_id: bookingId,
      });

      setStep(3);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setError('');

      await api.post(`/bookings/${bookingId}/confirm`, {
       event_id: event.id,
       number_of_seats: seats,
        otp,
      });

      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
      setLoading(false);
    }
  };

  const stepLabels = ['Select Seats', 'Send OTP', 'Confirm'];

  return (
    <div className="bookingModal-overlay">
      <div className="bookingModal-container">
    
        <div className="bookingModal-header">
          <div>
            <p className="bookingModal-stepText">
              {step === 1 ? 'Booking' : step === 2 ? 'OTP' : 'Confirmation'}
            </p>
            <h3 className="bookingModal-title">
              {step === 1 ? 'Book Event' : step === 2 ? 'Send OTP' : 'Confirm Booking'}
            </h3>
          </div>

          <button onClick={onClose} className="bookingModal-closeBtn">
            <FiX size={22} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bookingModal-stepBar">
          {stepLabels.map((label, i) => (
            <div key={label} className="bookingModal-stepItem">
              <div
                className={`bookingModal-stepLine ${
                  step > i + 1
                    ? 'bookingModal-stepDone'
                    : step === i + 1
                    ? 'bookingModal-stepActive'
                    : 'bookingModal-stepInactive'
                }`}
              />
              <span
                className={`bookingModal-stepLabel ${
                  step >= i + 1
                    ? 'bookingModal-stepLabelActive'
                    : 'bookingModal-stepLabelInactive'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="bookingModal-body">
          {error && <div className="bookingModal-error">{error}</div>}

          {step === 1 && (
            <div className="bookingModal-stepContent">
              <div className="bookingModal-eventBox">
                <p className="bookingModal-labelSmall">Event</p>
                <p className="bookingModal-eventTitle">{event.title}</p>
                <p className="bookingModal-priceText">
                  Price per seat:{' '}
                  <span className="bookingModal-priceHighlight">
                    ${event.ticket_price}
                  </span>
                </p>
              </div>

              <div>
                <label className="bookingModal-label">Number of Seats</label>
                <input
                  type="number"
                  min="1"
                  max={event.available_seats}
                  value={seats}
                  onChange={(e) =>
                    setSeats(
                      Math.min(
                        parseInt(e.target.value) || 1,
                        event.available_seats
                      )
                    )
                  }
                  className="bookingModal-input"
                />
                <p className="bookingModal-availableText">
                  Available: {event.available_seats} seats
                </p>
              </div>

              <div className="bookingModal-totalBox">
                <p className="bookingModal-totalLabel">Total</p>
                <p className="bookingModal-totalValue">${total}</p>
              </div>

              <button
                onClick={handleBookEvent}
                disabled={loading}
                className="bookingModal-btnPrimary"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bookingModal-stepContentCenter">
              <div className="bookingModal-icon">✉️</div>
              <p className="bookingModal-infoText">
                Click the button below to send an OTP to your email.
              </p>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="bookingModal-btnPrimary"
              >
                {loading ? 'Sending...' : 'Send OTP to Email'}
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="bookingModal-stepContent">
              <p className="bookingModal-infoTextCenter">
                We've sent a 6-digit OTP to your email.
              </p>

              <div>
                <label className="bookingModal-label">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  placeholder="000000"
                  className="bookingModal-inputOtp"
                />
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={loading || otp.length !== 6}
                className="bookingModal-btnPrimary"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}