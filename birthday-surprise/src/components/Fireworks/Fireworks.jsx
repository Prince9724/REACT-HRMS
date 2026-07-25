import { useRef, useEffect, useCallback } from "react";
import Lottie from "lottie-react";
import celebrationAnim from "../../assets/lottie/celebration.json";
import config from "../../data/config.js";

const COLORS = ["#ff4d6d", "#ffb703", "#8338ec", "#3a86ff", "#06d6a0", "#ffffff"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Fireworks() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  const launchFirework = useCallback((x, y) => {
    const particleCount = 40;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = randomBetween(2, 6);
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
      });
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha *= 0.965;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(render);
    };
    render();

    // Auto launch a few fireworks on load
    const autoTimers = [0, 500, 1000, 1600].map((delay) =>
      setTimeout(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;
        launchFirework(
          randomBetween(canvasEl.width * 0.2, canvasEl.width * 0.8),
          randomBetween(canvasEl.height * 0.2, canvasEl.height * 0.5)
        );
      }, delay)
    );

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      autoTimers.forEach(clearTimeout);
    };
  }, [resizeCanvas, launchFirework]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    launchFirework(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <section className="section-wrapper text-center relative">
      <h2 className="font-heading text-4xl text-primary mb-2 z-10">
        {config.fireworks.heading}
      </h2>
      <p className="text-gray-600 mb-6 z-10">{config.fireworks.subheading}</p>

      <div className="w-24 h-24 mb-2 z-10">
        <Lottie animationData={celebrationAnim} loop />
      </div>

      <div
        className="relative w-full max-w-3xl h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#16213e] cursor-crosshair"
        onClick={handleClick}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </section>
  );
}
