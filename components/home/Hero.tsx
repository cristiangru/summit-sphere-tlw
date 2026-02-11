"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconSparkles,
  IconHeart,
  IconFridge,
  IconTarget,
  IconUsers,
  IconCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";

export default function BentoGridThirdDemo() {
  return (
    <BentoGrid className="w-full py-16 md:py-20 lg:py-24 bg-white">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const CardOne = () => {
  const variants = {
    initial: {
      x: 0,
      scale: 1,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
      scale: 1,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center px-4 py-3"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-white shrink-0" />
        <p className="text-xs text-white font-medium italic leading-tight">SummitSphere s-a născut din dorința de a crea mai mult decât evenimente – de a construi punți.</p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center justify-end space-x-2 w-4/5 ml-auto bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-black"
      >
        <p className="text-xs text-white font-medium italic text-right leading-tight">Credem că adevărata schimbare în sănătate începe cu profesioniști pasionați.</p>
        <div className="h-6 w-6 rounded-full bg-white shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-white shrink-0" />
        <p className="text-xs text-white font-medium italic leading-tight">Fiecare eveniment este experiență autentică, gândită cu grijă și dedicare.</p>
      </motion.div>
    </motion.div>
  );
};

const CardTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(2).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center px-4 py-3"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 w-full"
        >
          <p className="text-xs text-white font-medium italic leading-tight">
            {i === 0 
              ? "Cu o abordare personalizată, SummitSphere pune educația și colaborarea în centru."
              : "Nu creăm doar momente, ci contexte în care ideile devin soluții durabile."
            }
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

const CardThree = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2 justify-center items-center px-4 py-3"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="text-center w-full h-full flex items-center justify-center"
      >
        <p className="text-xs md:text-sm font-medium text-neutral-800 dark:text-white italic leading-tight">
          Aceasta este promisiunea noastră: să fim alături de profesioniști în fiecare pas spre progres și excelență.
        </p>
      </motion.div>
    </motion.div>
  );
};

const CardFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center items-stretch px-4 py-3"
    >
      <motion.div
        variants={first}
        className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
      >
        <p className="text-xs font-medium italic leading-tight">SummitSphere pune educația în centrul inițiativelor.</p>
      </motion.div>
      <motion.div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <p className="text-xs font-medium italic leading-tight">Colaborarea ca fundament al schimbării reale.</p>
      </motion.div>
      <motion.div
        variants={second}
        className="p-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white"
      >
        <p className="text-xs font-medium italic leading-tight">Inovație pentru viitorul sănătății mai bun.</p>
      </motion.div>
    </motion.div>
  );
};

const CardFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center px-4 py-3"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-start space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-white shrink-0 mt-0.5" />
        <p className="text-xs text-white font-medium italic leading-tight">
          Cu o abordare personalizată, SummitSphere pune educația și colaborarea în centru.
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-start justify-end space-x-2 ml-auto bg-gradient-to-r from-orange-500 to-orange-600 dark:bg-black"
      >
        <p className="text-xs text-white font-medium italic text-right leading-tight">
          Nu creăm momente, ci contexte unde ideile devin soluții și conexiunile devin parteneriate.
        </p>
        <div className="h-6 w-6 rounded-full bg-white shrink-0 mt-0.5" />
      </motion.div>
    </motion.div>
  );
};

const CardSix = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center items-center px-4 py-3"
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="text-center w-full"
      >
        <p className="text-sm md:text-base font-medium text-neutral-800 dark:text-white italic leading-tight">
          Parteneriate de excelență
        </p>
      </motion.div>
      <motion.div
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.3,
        }}
        className="text-center w-full"
      >
        <p className="text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 italic leading-tight">
          Colaborăm cu specialiști din ginecologie, pediatrie, dermatologie, farmacologie și cardiologie.
        </p>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Descoperă",
    description: (
      <span>
        Construim punți între oameni, idei și viitor prin experiențe autentice.
      </span>
    ),
    header: <CardOne />,
    className: "md:col-span-1",
    icon: <IconSparkles className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Inspiră",
    description: (
      <span>
        Schimbare reală prin profesioniști pasionați și cunoaștere actualizată.
      </span>
    ),
    header: <CardTwo />,
    className: "md:col-span-1",
    icon: <IconHeart className="h-5 w-5 text-purple-500" />,
  },
  {
    title: "Conectează",
    description: (
      <span>
        Promisiunea noastră: să fim alături de profesioniști în fiecare pas.
      </span>
    ),
    header: <CardThree />,
    className: "md:col-span-1",
    icon: <IconFridge className="h-5 w-5 text-pink-500" />,
  },
  {
    title: "Valorile Noastre",
    description: (
      <span>
        Educație, colaborare și inovație în centrul inițiativelor noastre.
      </span>
    ),
    header: <CardFour />,
    className: "md:col-span-2",
    icon: <IconTarget className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Promisiunea Noastră",
    description: (
      <span>
        Idei care devin soluții, conexiuni care devin parteneriate durabile.
      </span>
    ),
    header: <CardFive />,
    className: "md:col-span-1",
    icon: <IconCheck className="h-5 w-5 text-orange-500" />,
  },
  {
    title: "Parteneriate",
    description: (
      <span>
        Specialiști din ginecologie, pediatrie, dermatologie, farmacologie și cardiologie.
      </span>
    ),
    header: <CardSix />,
    className: "md:col-span-1",
    icon: <IconUsers className="h-5 w-5 text-teal-500" />,
  },
];