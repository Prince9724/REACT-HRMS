import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import photo1 from "../../assets/images/photo1.jpg";
import photo2 from "../../assets/images/photo2.jpg";
import photo3 from "../../assets/images/photo3.jpg";
import photo4 from "../../assets/images/photo4.jpg";
import photo5 from "../../assets/images/photo5.jpg";
import config from "../../data/config.js";

// Map string keys from config.js to the actual imported image files.
// To add more photos: import them above, add an entry here, and add
// a matching { src: "photoX", caption: "..." } item in config.gallery.photos
const imageMap = {
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
};

export default function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const photos = config.gallery.photos;

  return (
    <section className="section-wrapper">
      <div className="text-center mb-10">
        <h2 className="font-heading text-4xl text-primary mb-2">
          {config.gallery.heading}
        </h2>
        <p className="text-gray-600">{config.gallery.subheading}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl w-full">
        {photos.map((photo, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveIndex(i)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative rounded-2xl overflow-hidden card-shadow aspect-square"
          >
            <img
              src={imageMap[photo.src]}
              alt={photo.caption}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="max-w-lg w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageMap[photos[activeIndex].src]}
                alt={photos[activeIndex].caption}
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="p-4 text-center">
                <p className="text-gray-700">{photos[activeIndex].caption}</p>
              </div>
              <button
                onClick={() => setActiveIndex(null)}
                className="w-full py-3 text-primary font-semibold border-t"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
