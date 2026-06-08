
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiCalendar, FiMail, FiLock } from "react-icons/fi";
import api from "../utlis/axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user || {}));

      setLoading(false);
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-page">
        <div className="login-header">
          <div className="login-logo">
            <FiCalendar size={22} />
          </div>

          <p className="login-subtitle">Welcome Back</p>

          <h1 className="login-title">Login to EventHub</h1>

          <p className="login-description">
            Access your bookings, discover events, and manage your reservations.
          </p>
        </div>

        <div className="login-card">
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label>Email</label>

              <div className="login-input-wrapper">
                <FiMail className="login-input-icon" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label>Password</label>

              <div className="login-input-wrapper">
                <FiLock className="login-input-icon" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register" className="login-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}