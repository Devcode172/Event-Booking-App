
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiArrowLeft } from "react-icons/fi";
import api from "../utlis/axios";
import "./EditEvent.css";

function toDatetimeLocal(dateString) {
  const d = new Date(dateString);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setFetching(true);

      const response = await api.get(`/events/${id}`);
      const event = response.data.event;

      setTitle(event.title || "");
      setDescription(event.description || "");
      setLocation(event.location || "");
      setEventDate(toDatetimeLocal(event.event_date));
      setPrice(String(event.ticket_price ?? ""));
      setTotalSeats(
        String(
          event.total_seats ??
            event.available_seats ??
            ""
        )
      );
      setAvailableSeats(
        String(event.available_seats ?? "")
      );
      setImageUrl(event.image_url || "");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load event"
      );
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !title ||
      !description ||
      !location ||
      !eventDate ||
      !price ||
      !totalSeats ||
      !availableSeats
    ) {
      setError(
        "All fields except image URL are required."
      );
      setLoading(false);
      return;
    }

    const total = parseInt(totalSeats, 10);
    const available = parseInt(
      availableSeats,
      10
    );

    if (available > total) {
      setError(
        "Available seats cannot exceed total seats."
      );
      setLoading(false);
      return;
    }

    try {
      await api.put(`/events/${id}`, {
        title,
        description,
        location,
        event_date: eventDate,
        ticket_price: parseFloat(price),
        image_url: imageUrl,
        total_seats: total,
        available_seats: available,
      });

      setSuccess("Event updated successfully.");
      setLoading(false);

      setTimeout(() => {
        navigate("/events");
      }, 1200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update event";

      setError(errorMsg);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="editEvent-loading">
        <div className="editEvent-spinner"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  return (
    <div className="editEvent-container">
      <button
        onClick={() => navigate("/events")}
        className="editEvent-backButton"
      >
        <FiArrowLeft size={16} />
        Back to Events
      </button>

      <div className="editEvent-card">
        <div className="editEvent-header">
          <div className="editEvent-headerContent">
            <div className="editEvent-icon">
              <FiCalendar size={22} />
            </div>

            <div>
              <p className="editEvent-subtitle">
                Admin Event Panel
              </p>

              <h1 className="editEvent-title">
                Edit Event
              </h1>

              <p className="editEvent-description">
                Update event details, pricing,
                and seat availability.
              </p>
            </div>
          </div>
        </div>

        <div className="editEvent-body">
          {error && (
            <div className="editEvent-error">
              {error}
            </div>
          )}

          {success && (
            <div className="editEvent-success">
              {success}
            </div>
          )}

          <form
            className="editEvent-form"
            onSubmit={handleSubmit}
          >
            <div className="editEvent-section">
              <div className="editEvent-sectionHeader">
                <h2>Event Details</h2>
                <p>
                  Update the event title,
                  description, location, and
                  schedule.
                </p>
              </div>

              <div className="editEvent-fields">
                <div>
                  <label>Title</label>
                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="editEvent-input"
                    placeholder="Event title"
                    required
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    className="editEvent-input editEvent-textarea"
                    rows="5"
                    placeholder="Event description"
                    required
                  />
                </div>

                <div className="editEvent-gridTwo">
                  <div>
                    <label>Location</label>
                    <input
                      value={location}
                      onChange={(e) =>
                        setLocation(
                          e.target.value
                        )
                      }
                      className="editEvent-input"
                      placeholder="Venue or city"
                      required
                    />
                  </div>

                  <div>
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) =>
                        setEventDate(
                          e.target.value
                        )
                      }
                      className="editEvent-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="editEvent-section">
              <div className="editEvent-sectionHeader">
                <h2>Pricing & Capacity</h2>

                <p>
                  Set the ticket price and seat
                  counts. Available seats
                  cannot exceed total seats.
                </p>
              </div>

              <div className="editEvent-gridFour">
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    className="editEvent-input"
                    placeholder="Event price"
                    required
                  />
                </div>

                <div>
                  <label>Total Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={totalSeats}
                    onChange={(e) =>
                      setTotalSeats(
                        e.target.value
                      )
                    }
                    className="editEvent-input"
                    placeholder="Total seats"
                    required
                  />
                </div>

                <div>
                  <label>Available Seats</label>
                  <input
                    type="number"
                    min="0"
                    value={availableSeats}
                    onChange={(e) =>
                      setAvailableSeats(
                        e.target.value
                      )
                    }
                    className="editEvent-input"
                    placeholder="Available seats"
                    required
                  />
                </div>

                <div>
                  <label>Image URL</label>
                  <input
                    value={imageUrl}
                    onChange={(e) =>
                      setImageUrl(
                        e.target.value
                      )
                    }
                    className="editEvent-input"
                    placeholder="Optional image URL"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="editEvent-submitButton"
            >
              {loading
                ? "Updating event..."
                : "Update Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}