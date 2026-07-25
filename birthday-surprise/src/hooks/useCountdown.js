import { useState, useEffect } from "react";

function getTimeParts(targetDate) {
  const total = new Date(targetDate).getTime() - Date.now();
  const clamped = Math.max(total, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);
  return { total: clamped, days, hours, minutes, seconds };
}

export default function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeParts(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeParts(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
