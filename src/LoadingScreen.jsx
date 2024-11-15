import React from 'react';
import { useProgress } from "@react-three/drei"; 

export const LoadingScreen = ({ started, onStarted }) => {
  const { progress } = useProgress();

  return (
    <div className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}>
      <div className="loadingScreen__progress">
        <div
          className="loadingScreen__progress__value"
          style={{
            width: `${progress}%`
          }}
        />
      </div>
      <div className="loadingScreen__board">
        <div className="loadingScreen__header">
          <h1 className="loadingScreen__title">HARRY GOMAR</h1>
        </div>
        <div className="loadingScreen__content">
          <div className="loadingScreen__feature">
            <img src="./Interact.png" className="loadingScreen__feature__image" alt="Interact" />
            <h2 className="loadingScreen__feature__title">INTERACT</h2>
            <p className="loadingScreen__feature__description">Learn all about my projects</p>
          </div>

          <div className="loadingScreen__feature">
            <img src="./Walk.png" className="loadingScreen__feature__image" alt="Move" />
            <h2 className="loadingScreen__feature__title">MOVE</h2>
            <p className="loadingScreen__feature__description">Explore using [W] and [S]</p>
          </div>

          <div className="loadingScreen__feature">
            <img src="./Find.png" className="loadingScreen__feature__image" alt="Find" />
            <h2 className="loadingScreen__feature__title">FIND</h2>
            <p className="loadingScreen__feature__description">Get to know me</p>
          </div>
        </div>
        <div className="loadingScreen__footer">
          <button
            className="loadingScreen__button"
            disabled={progress < 100}
            onClick={onStarted}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
};
