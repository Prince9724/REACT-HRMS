import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import config from "../../data/config.js";

export default function GiftBox() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: [config.theme.primary, config.theme.secondary, config.theme.accent],
    });
  };

  return (
    <section className="section-wrapper text-center">
      <h2 className="font-heading text-4xl text-primary mb-2">
        {config.giftBox.heading}
      </h2>
      <p className="text-gray-600 mb-10">{config.giftBox.subheading}</p>

      <motion.div
        className="relative cursor-pointer select-none"
        onClick={handleOpen}
        whileHover={{ scale: isOpen ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-9xl"
            >
              🎁
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="max-w-md mx-auto bg-white rounded-3xl p-8 card-shadow"
            >
              <div className="text-6xl mb-4">💝</div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {config.giftBox.revealMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isOpen && (
        <p className="mt-6 text-sm text-gray-400 animate-pulse">
          Tap the gift to open it
        </p>
      )}
    </section>
  );
}
