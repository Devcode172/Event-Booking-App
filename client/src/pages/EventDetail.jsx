
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';

import api from '../utlis/axios';
import BookingModal from '../components/BookingModal';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setIsAdmin(user?.role === 'admin');
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this event? All associated bookings will also be removed.'
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="eventDetail-loading">
        <div className="eventDetail-spinner" />
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="eventDetail-notFoundWrapper">
        <div className="eventDetail-notFoundCard">
          <div className="eventDetail-notFoundIcon">🔍</div>
          <p className="eventDetail-notFoundText">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="eventDetail-btnPrimary"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const infoItems = [
    {
      icon: FiCalendar,
      label: 'Date',
      value: new Date(event.event_date).toLocaleDateString(),
      color: 'eventDetail-iconSky',
    },
    {
      icon: FiClock,
      label: 'Time',
      value: new Date(event.event_date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      color: 'eventDetail-iconIndigo',
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: event.location,
      color: 'eventDetail-iconViolet',
    },
    {
      icon: FiDollarSign,
      label: 'Price',
      value: `$${event.ticket_price}`,
      color: 'eventDetail-iconGreen',
      highlight: true,
    },
  ];

  return (
    <>
      <div className="eventDetail-page">
        <button
          onClick={() => navigate('/events')}
          className="eventDetail-btnSecondary"
        >
          <FiArrowLeft size={16} />
          Back to Events
        </button>

        {error && <div className="eventDetail-error">{error}</div>}

        <div className="eventDetail-card">
          {event.image_url && (
            <div className="eventDetail-imageWrapper">
              <img
                src={event.image_url}
                alt={event.title}
                className="eventDetail-image"
              />
              <div className="eventDetail-imageOverlay" />

              <div className="eventDetail-imageTitle">
                {event.title}
              </div>
            </div>
          )}

          <div className="eventDetail-content">
            {!event.image_url && (
              <h1 className="eventDetail-title">{event.title}</h1>
            )}

            <p className="eventDetail-description">
              {event.description}
            </p>

            <div className="eventDetail-infoGrid">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="eventDetail-infoCard"
                >
                  <div className={`eventDetail-icon ${item.color}`}>
                    <item.icon size={20} />
                  </div>

                  <div>
                    <p className="eventDetail-label">
                      {item.label}
                    </p>

                    <p
                      className={
                        item.highlight
                          ? 'eventDetail-valueHighlight'
                          : 'eventDetail-value'
                      }
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="eventDetail-seatBox">
              <div className="eventDetail-seatIcon">
                <FiUsers size={22} />
              </div>

              <div>
                <p className="eventDetail-seatLabel">
                  Available Seats
                </p>
                <p className="eventDetail-seatValue">
                  {event.available_seats}
                </p>
              </div>
            </div>

            <div className="eventDetail-actions">
              {event.available_seats > 0 ? (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="eventDetail-bookBtn"
                >
                  Book Now
                </button>
              ) : (
                <button
                  disabled
                  className="eventDetail-soldOutBtn"
                >
                  Sold Out
                </button>
              )}

              {isAdmin && (
                <div className="eventDetail-adminActions">
                  <Link
                    to={`/admin/edit-event/${event.id}`}
                    className="eventDetail-editBtn"
                  >
                    <FiEdit2 size={16} />
                    Edit Event
                  </Link>

                  <button
                    onClick={handleDeleteEvent}
                    disabled={deleting}
                    className="eventDetail-deleteBtn"
                  >
                    <FiTrash2 size={16} />
                    {deleting ? 'Deleting...' : 'Delete Event'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          event={event}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            navigate('/my-bookings');
          }}
        />
      )}
    </>
  );
}