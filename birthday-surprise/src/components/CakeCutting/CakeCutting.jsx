import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import config from "../../data/config.js";

const CANDLE_COUNT = 5;

export default function CakeCutting() {
  const [litCandles, setLitCandles] = useState(
    Array.from({ length: CANDLE_COUNT }, () => true)
  );
  const [wishMade, setWishMade] = useState(false);

  const blowCandle = (index) => {
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      const allOut = next.every((lit) => !lit);
      if (allOut && !wishMade) {
        setWishMade(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: [config.theme.primary, config.theme.secondary, config.theme.accent],
        });
      }
      return next;
    });
  };

  return (
    <section className="section-wrapper text-center">
      <h2 className="font-heading text-4xl text-primary mb-2">
        {config.cake.heading}
      </h2>
      <p className="text-gray-600 mb-10">{config.cake.subheading}</p>

      <div className="relative inline-block">
        <div className="flex justify-center gap-3 mb-2">
          {litCandles.map((lit, i) => (
            <motion.button
              key={i}
              onClick={() => blowCandle(i)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center"
              aria-label={`Candle ${i + 1}`}
            >
              {lit && (
                <motion.div
                  animate={{ opacity: [1, 0.6, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-2xl mb-[-6px]"
                >
                  🔥
                </motion.div>
              )}
              <div className="w-2 h-10 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-sm" />
            </motion.button>
          ))}
        </div>
        <div className="text-8xl leading-none">🎂</div>
      </div>

      <div className="mt-8 h-10">
        {wishMade && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-semibold text-lg"
          >
            {config.cake.wishMessage}
          </motion.p>
        )}
      </div>
    </section>
  );
}
