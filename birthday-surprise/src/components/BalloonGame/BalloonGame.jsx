import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../data/config.js";

const COLORS = ["#ff4d6d", "#ffb703", "#8338ec", "#3a86ff", "#06d6a0"];
const GAME_DURATION = 20; // seconds

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

let idCounter = 0;

export default function BalloonGame() {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);

  const spawnBalloon = useCallback(() => {
    idCounter += 1;
    const balloon = {
      id: idCounter,
      left: randomBetween(5, 90),
      size: randomBetween(45, 75),
      duration: randomBetween(4, 7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setBalloons((prev) => [...prev, balloon]);

    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    }, balloon.duration * 1000);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setBalloons([]);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    spawnRef.current = setInterval(spawnBalloon, 700);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(spawnRef.current);
          clearInterval(timerRef.current);
          setIsRunning(false);
          setBalloons([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);
    };
  }, [isRunning, spawnBalloon]);

  const popBalloon = (id) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setScore((prev) => prev + 1);
  };

  return (
    <section className="section-wrapper text-center overflow-hidden">
      <h2 className="font-heading text-4xl text-primary mb-2">
        {config.balloonGame.heading}
      </h2>
      <p className="text-gray-600 mb-6">{config.balloonGame.subheading}</p>

      <div className="flex items-center gap-6 mb-6">
        <div className="bg-white rounded-xl px-4 py-2 card-shadow">
          <span className="text-sm text-gray-500 mr-2">
            {config.balloonGame.scoreLabel}:
          </span>
          <span className="font-bold text-primary">{score}</span>
        </div>
        <div className="bg-white rounded-xl px-4 py-2 card-shadow">
          <span className="text-sm text-gray-500 mr-2">Time:</span>
          <span className="font-bold text-primary">{timeLeft}s</span>
        </div>
      </div>

      {!isRunning ? (
        <button onClick={startGame} className="btn-primary">
          {timeLeft === 0 ? "Play Again" : "Start Game"}
        </button>
      ) : null}

      <div className="relative w-full max-w-2xl h-96 mt-8 mx-auto bg-white/40 rounded-3xl overflow-hidden">
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.button
              key={b.id}
              initial={{ bottom: -100, opacity: 1 }}
              animate={{ bottom: "110%" }}
              exit={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: b.duration, ease: "linear" }}
              onClick={() => popBalloon(b.id)}
              style={{
                position: "absolute",
                left: `${b.left}%`,
                width: b.size,
                height: b.size * 1.2,
                backgroundColor: b.color,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              }}
              aria-label="Pop balloon"
            />
          ))}
        </AnimatePresence>

        {!isRunning && timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <p className="text-2xl font-heading text-primary">
              Final Score: {score} 🎈
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
