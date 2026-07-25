import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";
import Welcome from "./components/Welcome/Welcome.jsx";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer.jsx";
import GiftBox from "./components/GiftBox/GiftBox.jsx";
import CakeCutting from "./components/CakeCutting/CakeCutting.jsx";
import BalloonEffects from "./components/BalloonEffects/BalloonEffects.jsx";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery.jsx";
import Reasons from "./components/Reasons/Reasons.jsx";
import Letter from "./components/Letter/Letter.jsx";
import Countdown from "./components/Countdown/Countdown.jsx";
import BalloonGame from "./components/BalloonGame/BalloonGame.jsx";
import Fireworks from "./components/Fireworks/Fireworks.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen">
      <BalloonEffects count={10} />

      {hasEntered && <MusicPlayer autoStart />}

      <main className="relative z-10">
        <Welcome onEnter={() => setHasEntered(true)} />

        {hasEntered && (
          <>
            <Countdown />
            <GiftBox />
            <CakeCutting />
            <PhotoGallery />
            <Reasons />
            <Letter />
            <BalloonGame />
            <Fireworks />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
