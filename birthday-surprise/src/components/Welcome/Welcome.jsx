import { motion } from "framer-motion";
import config from "../../data/config.js";

export default function Welcome({ onEnter }) {
  return (
    <section className="section-wrapper text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="font-heading text-5xl sm:text-6xl text-primary drop-shadow-sm mb-4">
          {config.welcome.heading}, {config.name}!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto">
          {config.welcome.subheading}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="btn-primary text-lg"
        >
          {config.welcome.buttonText}
        </motion.button>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {["🎈", "🎁", "✨", "🎊", "🎂"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-40"
            style={{ left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
