import { Link } from 'react-router-dom';
import { FiCalendar, FiShield, FiSmartphone, FiArrowRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import "./Home.css";

function Home() {
  const text = 'EventHub';
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 50;
    const pauseAtEnd = 1200;
    const pauseAtStart = 500;
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText !== text) {
        setDisplayText(text.slice(0, displayText.length + 1));
      } else if (!isDeleting && displayText === text) {
        setIsDeleting(true);
      } else if (isDeleting && displayText !== '') {
        setDisplayText(text.slice(0, displayText.length - 1));
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
      }
    }, displayText === text && !isDeleting ? pauseAtEnd : displayText === '' && isDeleting ? pauseAtStart : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text]);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>
          Welcome to{' '}
          <span className="typing-text">
            {displayText}
            <span className="typing-cursor" />
          </span>
        </h1>

        <p>
          EventHub is a modern event booking platform that allows users to
          discover events, book tickets securely, verify bookings through OTP,
          and manage their event experience with ease.
        </p>

        <div className="button-group">
          <Link to="/register" className="home-btn home-btn-primary">
            Get Started
          </Link>

          <Link to="/login" className="home-btn home-btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
  
