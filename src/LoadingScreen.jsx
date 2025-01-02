// LoadingScreen.jsx
import React from 'react';
import { useProgress } from '@react-three/drei';

export const LoadingScreen = ({ started, onStarted }) => {
  const { progress } = useProgress();

  return (
    <div className={`loadingScreen ${started ? 'loadingScreen--started' : ''}`}>
      {/* Progress Bar */}
      <div className="loadingScreen__progress">
        <div
          className="loadingScreen__progress__value"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="loadingScreen__board">
        {/* Header: Logo, Intro, and Description */}
        <header className="loadingScreen__header">
          {/* Logo Section */}
          <div className="loadingScreen__logo">
            <img src="./TrainPixel.png" alt="Logo" />
          </div>
          
          {/* Intro Text Section */}
          <div className="loadingScreen__intro">
            <h1 className="loadingScreen__title">Harry Gomar</h1>
            <p>
              Welcome to my online 'Portfolio' <br />
              I am a Computer Engineering student based in Mexico.
            </p>
            <p>
              This site is an unconventional yet engaging way to display my projects.
              <br />
              Explore and interact with the virtual environment to learn about me. 
            </p>
          </div>

          {/* Description Section */}
          <div className="loadingScreen__desc">  
            <button
              className={`loadingScreen__button ${progress >= 100 ? 'loadingScreen__button--enabled' : ''}`}
              disabled={progress < 100}
              onClick={onStarted}
            >
              Start
            </button>
            
            <p className="loadingScreen__startDescription">
              The experience is quite resource intensive 
              and may take some time to load. 
              <br />
              <br />
              (Graphics Acceleration Recommended)



            </p>
          </div>
        </header>


        {/* Divider */}
        <hr className="loadingScreen__divider" />

        {/* How It Works Section */}
        <section className="loadingScreen__works">
          <h2 className="loadingScreen__worksTitle">How it Works</h2>
          <div className="loadingScreen__worksGrid">
            <div className="loadingScreen__workItem">
              <p className="loadingScreen__feature__title">INTERACT</p>
              <img src="./Interact.png" className="loadingScreen__feature__image" alt="Interact" />
              <p className="loadingScreen__feature__description">Learn all about my projects</p>
            </div>
            <div className="loadingScreen__workItem">
              <p className="loadingScreen__feature__title">MOVE</p>
              <img src="./Walk.png" className="loadingScreen__feature__image" alt="Move" />
              <p className="loadingScreen__feature__description">Explore using [W] and [S]</p>
            </div>
            <div className="loadingScreen__workItem">
              <p className="loadingScreen__feature__title">EXPLORE</p>
              <img src="./Find.png" className="loadingScreen__feature__image" alt="Explore" />
              <p className="loadingScreen__feature__description">Discover details about me</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="loadingScreen__footer">
          {/* You can add footer content here if needed */}
           *No FULL mobile support yet
        </div>
      </div>
    </div>
  );
};
