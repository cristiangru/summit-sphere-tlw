import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Value = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className: string }>;
  bgGradient: string;
  iconColor: string;
};

export const AnimatedValues = ({
  values,
}: {
  values: Value[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [rotations, setRotations] = useState<number[]>([]);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % values.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + values.length) % values.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    setMounted(true);
    setRotations(
      values.map(() => Math.floor(Math.random() * 21) - 10)
    );
  }, [values.length]);

  const getRandomRotate = (index: number) => {
    return rotations[index] || 0;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-6 sm:py-7 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-8 sm:gap-12 md:gap-20 md:grid-cols-2">
        {/* Icon Cards Section - Centered on mobile */}
        <div className="flex items-center justify-center md:justify-start">
          <div className="relative h-60 w-60 sm:h-72 sm:w-72 md:h-80 md:w-80">
            <AnimatePresence>
              {mounted && values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: getRandomRotate(index),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : getRandomRotate(index),
                      zIndex: isActive(index) ? 40 : values.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: getRandomRotate(index),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <div
                      className={`h-60 w-60 sm:h-72 sm:w-72 md:h-80 md:w-80 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm ${value.bgGradient}`}
                    >
                  <IconComponent className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 ${value.iconColor}`} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="flex flex-col py-4 justify-center">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="space-y-4"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black text-center md:text-left">
              {values[active].title}
            </h3>
          <motion.p
  /* Am schimbat text-center în text-left pentru mobil */
  className="text-sm sm:text-base md:text-base text-gray-700 dark:text-neutral-300 leading-relaxed  text-justify"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {values[active].description}
</motion.p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 sm:gap-4 mt-8 justify-center md:justify-start">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-black dark:text-neutral-400 transition-transform duration-300 group-hover/button:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-black dark:text-neutral-400 transition-transform duration-300 group-hover/button:-rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};