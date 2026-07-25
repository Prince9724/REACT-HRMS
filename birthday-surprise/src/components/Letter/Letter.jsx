import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../data/config.js";

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="section-wrapper text-center">
      <h2 className="font-heading text-4xl text-primary mb-2">
        {config.letter.heading}
      </h2>
      <p className="text-gray-600 mb-10">{config.letter.subheading}</p>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="text-8xl"
            aria-label="Open letter"
          >
            💌
          </motion.button>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="max-w-xl bg-white rounded-3xl p-8 sm:p-10 card-shadow text-left"
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {config.letter.body}
            </p>
            <p className="mt-6 font-heading text-2xl text-primary text-right">
              {config.letter.signature},<br />
              {config.fromName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <p className="mt-6 text-sm text-gray-400 animate-pulse">
          Tap the envelope to read
        </p>
      )}
    </section>
  );
}
