import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Após 2.5s, inicia o fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);

      // Após 1s de fade out, chama onComplete
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1000);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img
          src="/logo.png"
          alt="Evolua Logo"
          className="splash-logo"
        />
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
