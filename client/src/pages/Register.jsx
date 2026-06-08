
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiCalendar,
  FiUser,
  FiMail,
  FiLock,
  FiKey,
} from "react-icons/fi";

import api from "../utlis/axios";
import "./Register.css";

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
        name,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user || {})
      );

      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="auth-page">
        <div className="register-auth-page-header">
          <div className="register-logo-box">
            <FiCalendar size={24} />
          </div>

          <p className="register-subtitle">Create your account</p>

          <h1>{step === 1 ? "Register" : "Verify OTP"}</h1>

          <p className="register-description">
            {step === 1
              ? "Join EventHub and start booking great experiences."
              : `Enter the 6-digit code sent to ${email}.`}
          </p>

          <div className="register-step-indicator">
            <div
              className={`register-step-circle ${
                step >= 1 ? "active" : ""
              }`}
            >
              1
            </div>

            <div
              className={`register-step-line ${
                step > 1 ? "active" : ""
              }`}
            ></div>

            <div
              className={`register-step-circle ${
                step >= 2 ? "active" : ""
              }`}
            >
              2
            </div>
          </div>
        </div>

        <div className="register-card">
          {error && <div className="register-error-box">{error}</div>}

          <form
            onSubmit={
              step === 1
                ? handleRegister
                : handleVerifyOtp
            }
          >
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label>Name</label>

                  <div className="register-input-wrapper">
                    <FiUser className="register-input-icon" />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="register-input-field"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <div className="register-input-wrapper">
                    <FiMail className="register-input-icon" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="register-input-field"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>

                  <div className="register-input-wrapper">
                    <FiLock className="register-input-icon" />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="register-input-field"
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label>OTP Code</label>

                <div className="register-input-wrapper">
                  <FiKey className="register-input-icon" />

                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                    className="register-input-field register-otp-input"
                    placeholder="6-digit OTP"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="register-btn-primary"
              disabled={loading}
              onClick={(e) => {
                if (
                  step === 1 &&
                  !validateName(name)
                ) {
                  e.preventDefault();
                  alert(
                    "Name can only contain letters and spaces"
                  );
                }
              }}
            >
              {loading
                ? step === 1
                  ? "Registering..."
                  : "Verifying..."
                : step === 1
                ? "Register"
                : "Verify OTP"}
            </button>
          </form>

          <p className="register-bottom-text">
            {step === 1
              ? "Already have an account?"
              : ""}
            <Link
              to={
                step === 1
                  ? "/login"
                  : "/register"
              }
            >
              {step === 1
                ? "Login here"
                : ""}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}