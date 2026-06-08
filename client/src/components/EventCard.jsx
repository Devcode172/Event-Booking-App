
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';

import './EventCard.css';

export default function EventCard({ event, isAdmin, onDelete }) {
  const eventDate = new Date(event.event_date);
  const dateString = eventDate.toLocaleDateString();
  const timeString = eventDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete?.(event.id);
  };

  return (
    <div className="eventCard-card">
  
      <div className="eventCard-imageWrapper">
        {event.image_url ? (
          <>
            <img
              src={event.image_url}
              alt={event.title}
              className="eventCard-image"
            />
            <div className="eventCard-imageOverlay" />
          </>
        ) : (
          <div className="eventCard-noImage">
            <span>No image available</span>
          </div>
        )}

        <div className="eventCard-priceTag">
          ${event.ticket_price}
        </div>

        <div className="eventCard-seatTag">
          {event.available_seats} seats left
        </div>
      </div>

      <div className="eventCard-content">
        <h3 className="eventCard-title">{event.title}</h3>

        <div className="eventCard-meta">
          <p className="eventCard-metaItem">
            <FiCalendar className="eventCard-iconSky" />
            {dateString}
          </p>

          <p className="eventCard-metaItem">
            <FiClock className="eventCard-iconIndigo" />
            {timeString}
          </p>

          <p className="eventCard-metaItem">
            <FiMapPin className="eventCard-iconViolet" />
            <span className="eventCard-location">{event.location}</span>
          </p>
        </div>

        <p className="eventCard-description">
          {event.description}
        </p>

        <Link to={`/event/${event.id}`} className="eventCard-viewBtn">
          View Details
          <FiArrowRight size={16} />
        </Link>

        {isAdmin && (
          <div className="eventCard-adminActions">
            <Link
              to={`/admin/edit-event/${event.id}`}
              className="eventCard-editBtn"
            >
              <FiEdit2 size={15} />
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              className="eventCard-deleteBtn"
            >
              <FiTrash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}