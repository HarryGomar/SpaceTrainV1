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
        <h1 className="loadingScreen__title">SPACE TRAIN V0.9</h1>
        
        <img src="./TrainPixel.png" className="imageTrain" alt="" />

        <h2 className="loadingScreen__desc"> </h2>

        <button
          className="loadingScreen__button"
          disabled={progress < 100}
          onClick={onStarted}
        >
          Start
        </button>

        
        <h2 className="loadingScreen__desc"> Currently an EXTREMELY heavy experimental build</h2>
        <h3 className="loadingScreen__desc2"> Recommended To Turn On Hardware Acceleration </h3>
        <h4 className="loadingScreen__desc3"> Will most likely not run smoothly if graphical processing unit is weak</h4>


        
      </div>
    </div>
  );
};
