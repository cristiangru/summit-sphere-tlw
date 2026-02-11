"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  IconCalendarEvent,
  IconSchool,
  IconPresentation,
  IconBulb,
  IconVideo,
} from "@tabler/icons-react";

// Array-ul tău de servicii cu descrieri complete și link-uri
export const services = [
  {
    title: "Organizare conferințe medicale",
    description:
      "Planificăm și gestionăm conferințe medicale personalizate: locație, logistică, promovare și coordonare completă — cu accent pe profesionalism și succesul evenimentului.",
    link: "/servicii/conferinte-medicale",
    icon: <IconCalendarEvent className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Promovare și marketing",
    description:
      "Campanii personalizate și strategii moderne pe mai multe canale pentru a atrage exact participanții potriviți și a maximiza vizibilitatea și impactul evenimentului.",
    link: "/servicii/promovare-evenimente-medicale",
    icon: <IconSchool className="h-5 w-5 text-purple-500" />,
  },
  {
    title: "Workshop-uri și seminarii",
    description:
      "Organizăm sesiuni interactive pe teme medicale de actualitate — spațiu ideal pentru formare continuă, discuții practice și schimb valoros de experiență între specialiști.",
    link: "/servicii/workshop-uri-seminarii",
    icon: <IconSchool className="h-5 w-5 text-pink-500" />,
  },
  {
    title: "Evenimente de networking",
    description:
      "Creăm conexiuni reale prin sesiuni structurate de networking, întâlniri one-to-one și activități sociale care facilitează colaborarea și relațiile profesionale de lungă durată.",
    link: "/servicii/networking-medical",
    icon: <IconSchool className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Simpozioane medicale",
    description:
      "Servicii complete pentru simpozioane științifice: organizare spațiu, suport tehnic și logistic pentru dezbateri de top, prezentări academice și abordarea celor mai noi teme medicale.",
    link: "/servicii/simpozioane-medicale",
    icon: <IconPresentation className="h-5 w-5 text-orange-500" />,
  },
  {
    title: "Servicii de consultanță",
    description:
      "Expertiză de la strategie și concept până la implementare și comunicare. Te ajutăm să-ți atingi obiectivele cu soluții eficiente, personalizate și orientate spre rezultat.",
    link: "/servicii/consultanta-evenimente-medicale",
    icon: <IconBulb className="h-5 w-5 text-teal-500" />,
  },
  {
    title: "Gestionare evenimente online",
    description:
      "Organizăm și gestionăm evenimente medicale digitale de calitate: platformă stabilă, interacțiune live, acces facil și experiență optimă pentru participanții din toată țara sau internaționali.",
    link: "/servicii/evenimente-online-medicale",
    icon: <IconVideo className="h-5 w-5 text-cyan-500" />,
  },
];

// Header animate – RESTAURATE CULORILE ORIGINALE din demo-ul tău

const AnimatedBubbleCard = ({ text1, text2, text3 }: { text1: string; text2: string; text3?: string }) => {
  const variants: Variants = {
    initial: { x: 0, scale: 1 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond: Variants = {
    initial: { x: 0, scale: 1 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
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
        <p className="text-xs text-white font-medium italic leading-tight">{text1}</p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center justify-end space-x-2 ml-auto bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-black"
      >
        <p className="text-xs text-white font-medium italic text-right leading-tight">{text2}</p>
        <div className="h-6 w-6 rounded-full bg-white shrink-0" />
      </motion.div>
      {text3 && (
        <motion.div
          variants={variants}
          className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-black"
        >
          <div className="h-6 w-6 rounded-full bg-white shrink-0" />
          <p className="text-xs text-white font-medium italic leading-tight">{text3}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

const AnimatedBarFillCard = ({ line1, line2 }: { line1: string; line2: string }) => {
  const variants: Variants = {
    initial: {
      width: "0%",
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
    hover: {
      width: ["0%", "100%"] as const,
      transition: {
        duration: 2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center px-4 py-3"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 w-full"
      >
        <p className="text-xs text-white font-medium italic leading-tight">{line1}</p>
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-neutral-100 dark:border-white/[0.2] p-3 items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 w-full"
      >
        <p className="text-xs text-white font-medium italic leading-tight">{line2}</p>
      </motion.div>
    </motion.div>
  );
};

const AnimatedPulseCard = ({ mainText, subText }: { mainText: string; subText: string }) => {
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
          {mainText}
        </p>
      </motion.div>
      <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 italic leading-tight text-center">
        {subText}
      </p>
    </motion.div>
  );
};

const AnimatedTiltCard = ({ line1, line2, line3 }: { line1: string; line2: string; line3: string }) => {
  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[14rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center items-stretch px-4 py-3"
    >
      <motion.div variants={first} className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <p className="text-xs font-medium italic leading-tight">{line1}</p>
      </motion.div>
      <motion.div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <p className="text-xs font-medium italic leading-tight">{line2}</p>
      </motion.div>
      <motion.div variants={second} className="p-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <p className="text-xs font-medium italic leading-tight">{line3}</p>
      </motion.div>
    </motion.div>
  );
};

// Mapare pe servicii – culori & animații distribuite ca în demo-ul original
const bentoItems = services.map((service, i) => {
  let header;

  if (i % 4 === 0) {
    // Split description in two parts for bubble card
    const midpoint = Math.ceil(service.description.length / 2);
    const part1 = service.description.substring(0, midpoint);
    const part2 = service.description.substring(midpoint);
    header = <AnimatedBubbleCard text1={service.title} text2={part1} text3={part2} />;
  } else if (i % 4 === 1) {
    // Split description in two parts for bar fill card
    const midpoint = Math.ceil(service.description.length / 2);
    const part1 = service.description.substring(0, midpoint);
    const part2 = service.description.substring(midpoint);
    header = <AnimatedBarFillCard line1={part1} line2={part2} />;
  } else if (i % 4 === 2) {
    // Split description in two parts for pulse card
    const midpoint = Math.ceil(service.description.length / 2);
    const part1 = service.description.substring(0, midpoint);
    const part2 = service.description.substring(midpoint);
    header = <AnimatedPulseCard mainText={part1} subText={part2} />;
  } else {
    // Split description in three parts for tilt card
    const oneThird = Math.ceil(service.description.length / 3);
    const part1 = service.description.substring(0, oneThird);
    const part2 = service.description.substring(oneThird, oneThird * 2);
    const part3 = service.description.substring(oneThird * 2);
    header = <AnimatedTiltCard line1={part1} line2={part2} line3={part3} />;
  }

  return {
    title: service.title,
    header,
    link: service.link,
    className: i === 3 || i === 6 ? "md:col-span-2" : "md:col-span-1",
    icon: service.icon,
  };
});

export default function ServicesBentoGrid() {
  return (
    <BentoGrid className="w-full py-16 md:py-20 lg:py-24 bg-white">
      {bentoItems.map((item, i) => (
        <BentoGridItemWithButton
          key={i}
          title={item.title}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
          link={item.link}
        />
      ))}
    </BentoGrid>
  );
}

// Custom BentoGridItem cu buton "Vezi mai mult"
function BentoGridItemWithButton({
  className,
  title,
  header,
  icon,
  link,
}: {
  className?: string;
  title?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  link?: string;
}) {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div className="font-sans font-bold text-xl text-neutral-800 dark:text-neutral-100">
          {title}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg flex-1 mb-4">
        {header}
      </div>

      <Link
        href={link || "#"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition-all duration-200 hover:scale-105"
      >
        Vezi mai mult
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}