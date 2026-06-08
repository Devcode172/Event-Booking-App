
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import api from "../utlis/axios";
import "./AddEvent.css";

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      !availableSeats
    ) {
      setError("All fields except image URL are required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/events", {
        title,
        description,
        location,
        event_date: eventDate,
        ticket_price: parseFloat(price),
        image_url: imageUrl,
        total_seats: parseInt(availableSeats, 10),
        available_seats: parseInt(availableSeats, 10),
      });

      setSuccess("Event created successfully.");

      setTitle("");
      setDescription("");
      setLocation("");
      setEventDate("");
      setPrice("");
      setAvailableSeats("");
      setImageUrl("");

      setLoading(false);

      setTimeout(() => {
        navigate("/events");
      }, 1200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create event";

      setError(errorMsg);
      console.error("Event creation error:", errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="addEvent-container">
      <div className="addEvent-card">
        <div className="addEvent-header">
          <div className="addEvent-header-content">
            <div className="addEvent-icon">
              <FiCalendar size={22} />
            </div>

            <div>
              <p className="addEvent-subtitle">
                Admin Event Panel
              </p>

              <h1 className="addEvent-title">
                Create New Event
              </h1>

              <p className="addEvent-description">
                Add a new event with details, pricing,
                and seat availability. Your event will
                be visible to users after creation.
              </p>
            </div>
          </div>
        </div>

        <div className="addEvent-body">
          {error && (
            <div className="addEvent-error">
              {error}
            </div>
          )}

          {success && (
            <div className="addEvent-success">
              {success}
            </div>
          )}

          <form
            className="addEvent-form"
            onSubmit={handleSubmit}
          >
            <div className="addEvent-section">
              <div className="addEvent-section-header">
                <h2>Event Details</h2>

                <p>
                  Provide the event title,
                  description, location, and
                  schedule.
                </p>
              </div>

              <div className="addEvent-field">
                <label>Title</label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="addEvent-input"
                  placeholder="Event title"
                  required
                />
              </div>

              <div className="addEvent-field">
                <label>Description</label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="addEvent-input addEvent-textarea"
                  rows="5"
                  placeholder="Event description"
                  required
                />
              </div>

              <div className="addEvent-grid-two">
                <div className="addEvent-field">
                  <label>Location</label>

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    className="addEvent-input"
                    placeholder="Venue or city"
                    required
                  />
                </div>

                <div className="addEvent-field">
                  <label>Date & Time</label>

                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) =>
                      setEventDate(e.target.value)
                    }
                    className="addEvent-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="addEvent-section">
              <div className="addEvent-section-header">
                <h2>Pricing & Capacity</h2>

                <p>
                  Set the ticket price and
                  available seats.
                </p>
              </div>

              <div className="addEvent-grid-three">
                <div className="addEvent-field">
                  <label>Price</label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    className="addEvent-input"
                    placeholder="Event price"
                    required
                  />
                </div>

                <div className="addEvent-field">
                  <label>Available Seats</label>

                  <input
                    type="number"
                    min="1"
                    value={availableSeats}
                    onChange={(e) =>
                      setAvailableSeats(
                        e.target.value
                      )
                    }
                    className="addEvent-input"
                    placeholder="Available seats"
                    required
                  />
                </div>

                <div className="addEvent-field">
                  <label>Image URL</label>

                  <input
                    value={imageUrl}
                    onChange={(e) =>
                      setImageUrl(e.target.value)
                    }
                    className="addEvent-input"
                    placeholder="Optional image URL"
                  />

                  <p className="addEvent-help-text">
                    Add an image link to make
                    your event listing more
                    engaging.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="addEvent-button"
            >
              {loading
                ? "Creating event..."
                : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}