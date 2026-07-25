import { useMemo } from "react";

const COLORS = ["#ff4d6d", "#ffb703", "#8338ec", "#3a86ff", "#06d6a0", "#ff8fa3"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function BalloonEffects({ count = 12 }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: randomBetween(0, 95),
        size: randomBetween(40, 70),
        duration: randomBetween(9, 18),
        delay: randomBetween(0, 8),
        color: COLORS[i % COLORS.length],
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size * 1.2}px`,
            backgroundColor: b.color,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
