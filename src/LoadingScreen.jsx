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
        <h1 className="loadingScreen__title">SPACE TRAIN V1.0</h1>
        
        <img src="./TrainPixel.png" className="imageTrain" alt="" />
        <h4 className="loadingScreen__desc2"> Movement Controls Inside Train: </h4>
        <h4 className="loadingScreen__desc2"> ↑ - W  | ↓ - S </h4>
        <button
          className="loadingScreen__button"
          disabled={progress < 100}
          onClick={onStarted}
        >
          Start
        </button>
        <h4 className="loadingScreen__desc2">(Currently no FULL mobile support)</h4>

        
      </div>
    </div>
  );
};
