"use client";

import { useRef, useState, useEffect } from "react";
import { motion, cubicBezier } from "framer-motion";
import { PinContainer } from "@/components/ui/3d-pin";


export default function MapSection() {
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  // Responsive dimensions based on screen size
  const getMapDimensions = () => {
    if (windowSize.width < 640) {
      // Mobile: small, full width
      return {
        width: "w-[95vw] max-w-[320px]",
        height: "h-[200px]",
        containerHeight: "min-h-[250px]",
        rounded: "rounded-lg",
      };
    } else if (windowSize.width < 1024) {
      // Tablet: medium, wider
      return {
        width: "w-[90vw] max-w-[500px]",
        height: "h-[300px]",
        containerHeight: "min-h-[400px]",
        rounded: "rounded-xl",
      };
    } else {
      // Desktop: large
      return {
        width: "w-[800px]",
        height: "h-[400px]",
        containerHeight: "min-h-[350px]",
        rounded: "rounded-2xl",
      };
    }
  };

  const dimensions = getMapDimensions();
  const easeFunction = cubicBezier(0.25, 0.1, 0.25, 1);

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeFunction },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2, ease: easeFunction },
    },
  };

  return (
    <div className="relative  py-2 sm:py-6 md:py-10 lg:py-2 px-4 sm:px-6 lg:px-18 bg-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 sm:-bottom-40 left-0 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 space-y-3 sm:space-y-4"
        >
         
        </motion.div>

        {/* Map Container with 3D Pin */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <div className={`flex items-center justify-center ${dimensions.containerHeight} perspective px-2 sm:px-4`}>
            <PinContainer
              title="Șoseaua Chitilei nr. 23, București"
              href="https://www.google.com/maps/place/Soseaua+Chitilei+23,+Bucuresti/@44.46139,26.11234,15z"
              containerClassName="pointer-events-auto w-full flex justify-center"
              className="flex flex-col tracking-tight text-slate-100/50 w-full"
            >
              {/* Map Content Inside Pin */}
              <div className={`relative ${dimensions.width} ${dimensions.height} ${dimensions.rounded} overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl  group`}>
                {/* Glow Border - Hidden on Mobile */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl dark:opacity-0 dark:group-hover:opacity-10 pointer-events-none hidden sm:block" />

                {/* Google Maps Embed */}
                <iframe
                  ref={mapRef}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen={true}
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative z-10"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2844.4247259898324!2d26.11234!3d44.46139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b202d7d7d7d7d7%3A0x1234567890abcdef!2sSoseaua%20Chitilei%2023%2C%20Bucuresti!5e0!3m2!1sro!2sro!4v1700000000000"
                ></iframe>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent dark:from-black/20 z-20" />

          
              </div>
            </PinContainer>
          </div>
        </motion.div>


        </div>
    </div>
  );
}