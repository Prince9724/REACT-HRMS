import { useEffect, useState } from "react";
import config from "../../data/config.js";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete && onComplete(), 400);
          return 100;
        }
        return prev + 4;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#fff0f3] to-[#ffe5ec]">
      <div className="text-5xl mb-6 animate-bounce">🎂</div>
      <h1 className="font-heading text-3xl text-primary mb-2 text-center px-6">
        {config.loading.title}
      </h1>
      <p className="text-gray-500 mb-8">{config.loading.subtitle}</p>
      <div className="w-64 h-3 bg-white rounded-full overflow-hidden card-shadow">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-gray-400">{progress}%</p>
    </div>
  );
}
