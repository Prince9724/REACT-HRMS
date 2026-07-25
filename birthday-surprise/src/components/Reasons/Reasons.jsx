import { motion } from "framer-motion";
import config from "../../data/config.js";

export default function Reasons() {
  return (
    <section className="section-wrapper">
      <div className="text-center mb-10">
        <h2 className="font-heading text-4xl text-primary mb-2">
          {config.reasons.heading}
        </h2>
        <p className="text-gray-600">{config.reasons.subheading}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 max-w-3xl w-full">
        {config.reasons.list.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 card-shadow flex items-start gap-3"
          >
            <span className="text-2xl">💗</span>
            <p className="text-gray-700">{reason}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
