
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiBookOpen } from "react-icons/fi";
import api from "../utlis/axios";
import EventCard from "../components/EventCard";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setIsAdmin(user?.role === "admin");
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      setEvents(response.data.events || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? All associated bookings will also be removed."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="event-loading">
        <div className="event-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="event-page">
      <div className="event-card">
        <div className="event-header">
          <div>
            <p className="event-subtitle">Explore</p>

            <h1 className="event-title">Events</h1>

            <p className="event-description">
              Browse the latest events and book your preferred seats.
            </p>
          </div>

          <div className="event-actions">
            {isAdmin && (
              <Link
                to="/admin/add-event"
                className="event-add-button"
              >
                <FiPlus size={16} />
                Add Event
              </Link>
            )}

            <Link
              to="/my-bookings"
              className="event-booking-button"
            >
              <FiBookOpen size={16} />
              My Bookings
            </Link>
          </div>
        </div>

        {error && (
          <div className="event-error">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="event-empty">
            <div className="event-empty-icon">📅</div>

            <p className="event-empty-title">
              No events available
            </p>

            <p className="event-empty-text">
              Check back later for more experiences.
            </p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isAdmin={isAdmin}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}