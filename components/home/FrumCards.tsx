"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Heart, Zap, Users, Target } from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.05,
      ease: "easeInOutCubic",
    },
  }),
};

const scaleRevealVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,

    },
  },
};

interface StorySection {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  accentColor: string;
  bgGradient: string;
}

const StoryCard: FC<StorySection & { index: number }> = ({
  title,
  subtitle,
  description,
  icon,
  color,
  accentColor,
  bgGradient,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.8 : 0.5,
        }}
        transition={{ duration: 0.4 }}
        className={`absolute -inset-4 rounded-3xl blur-2xl ${bgGradient} pointer-events-none`}
      />

      {/* Main card */}
      <div
        className={`relative overflow-hidden rounded-3xl h-full backdrop-blur-2xl border border-white/20`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)",
        }}
      >
        {/* Dynamic gradient overlay */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 ${bgGradient} opacity-20`}
        />

        {/* Animated border glow */}
        <motion.div
          animate={{
            boxShadow: isHovered
              ? `0 0 60px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.9)`
              : `0 0 20px ${accentColor}20, inset 0 1px 0 rgba(255,255,255,0.5)`,
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-3xl border border-white/40"
        />

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between">
          {/* Icon with float animation */}
          <motion.div
            animate={{
              y: isHovered ? -12 : 0,
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6 }}
            className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl ${color} backdrop-blur-xl border border-white/30`}
          >
            <motion.div
              animate={{
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.4 }}
              className={accentColor}
            >
              {icon}
            </motion.div>
          </motion.div>

          {/* Text content */}
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <motion.p
                animate={{
                  color: isHovered ? accentColor : "#999",
                }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold uppercase tracking-wider"
              >
                {subtitle}
              </motion.p>
              <h3 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {title}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Bottom animated line */}
          <motion.div
            animate={{
              scaleX: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
            className={`mt-6 h-1.5 bg-gradient-to-r ${color} origin-left rounded-full`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const GlowingDot = ({ delay }: { delay: number }) => (
  <motion.div
    animate={{
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
    }}
    className="absolute w-3 h-3 rounded-full bg-[#2D9A8F]"
  />
);

export default function SummitSphereStory() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storyCards: StorySection[] = [
    {
      title: "Viziunea",
      subtitle: "Capitolul 1",
      description:
        "O lume unde fiecare eveniment medical transformă industria. Unde cunoștințele se întâlnesc cu pasiunea și creează revoluții în sănătate.",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-purple-400 to-pink-400",
      accentColor: "text-purple-600",
      bgGradient: "bg-gradient-to-br from-purple-300/20 to-pink-300/20",
    },
    {
      title: "Misiunea",
      subtitle: "Capitolul 2",
      description:
        "Conectăm lideri, inspire colaborare și construim comunități care deschid ușile viitorului medicului. Fiecare detaliu contează.",
      icon: <Heart className="w-8 h-8" />,
      color: "from-red-400 to-orange-400",
      accentColor: "text-red-600",
      bgGradient: "bg-gradient-to-br from-red-300/20 to-orange-300/20",
    },
    {
      title: "Pasiunea",
      subtitle: "Capitolul 3",
      description:
        "Dăm viață fiecărui eveniment cu creativitate și dedică­țiune. Transformăm ideile în experiențe care marchează o viață.",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-400 to-amber-400",
      accentColor: "text-yellow-600",
      bgGradient: "bg-gradient-to-br from-yellow-300/20 to-amber-300/20",
    },
    {
      title: "Comunitate",
      subtitle: "Capitolul 4",
      description:
        "Construim relații durabile cu profesionișii medicali. Împreună, creăm ecosisteme de învățare și inovație care beneficiază milioane.",
      icon: <Users className="w-8 h-8" />,
      color: "from-cyan-400 to-blue-400",
      accentColor: "text-cyan-600",
      bgGradient: "bg-gradient-to-br from-cyan-300/20 to-blue-300/20",
    },
    {
      title: "Impactul",
      subtitle: "Capitolul 5",
      description:
        "Măsurăm succesul prin progresul acelora pe care îi inspirăm. Fiecare conferință, o piatră de temelie pentru un viitor mai luminos.",
      icon: <Target className="w-8 h-8" />,
      color: "from-green-400 to-teal-400",
      accentColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-green-300/20 to-teal-300/20",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-white to-slate-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: scrollY * 0.5,
          }}
          className="absolute -left-40 top-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-200/30 via-pink-200/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            y: -scrollY * 0.5,
          }}
          className="absolute -right-40 top-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-cyan-200/20 via-blue-200/15 to-transparent blur-3xl"
        />
      </div>

      {/* Floating dots */}
      <GlowingDot delay={0} />
      <GlowingDot delay={0.5} />
      <GlowingDot delay={1} />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-48">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className="mx-auto max-w-4xl space-y-12 sm:space-y-16"
        >
          {/* Opening statement */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 text-center"
          >
            {/* Animated badge */}
            <motion.div
              variants={scaleRevealVariants}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2D9A8F]/20 to-purple-200/20 border border-[#2D9A8F]/30 backdrop-blur-xl mx-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#2D9A8F] to-purple-500"
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-[#2D9A8F] to-purple-600 bg-clip-text text-transparent">
                O poveste de transformare
              </span>
            </motion.div>

            {/* Main headline with reveal animation */}
            <motion.h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
              <motion.span
                className="block bg-gradient-to-r from-neutral-900 via-[#2D9A8F] to-purple-600 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                SummitSphere
              </motion.span>
            </motion.h1>

            {/* Subtitle with staggered text reveal */}
            <motion.p
              className="text-xl sm:text-2xl text-neutral-700 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Unde visurile medicale devin realitate. O poveste de
              <motion.span
                animate={{
                  backgroundPosition: ["0%", "100%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="ml-2 font-bold bg-gradient-to-r from-[#2D9A8F] to-purple-600 bg-size-200 bg-clip-text text-transparent"
              >
                excepție, impact și inovație.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="flex justify-center pt-8"
          >
            <div className="text-center">
              <p className="text-sm text-neutral-500 mb-3">Descoperiți povestea</p>
              <ChevronDown className="w-6 h-6 text-[#2D9A8F] mx-auto" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Story Chapters Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-16 sm:space-y-20"
        >
          {/* Section title */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900">
              Cele cinci capitole
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600">
              O călătorie prin valorile care ne definesc
            </p>
          </motion.div>

          {/* Story cards grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {storyCards.map((card, index) => (
              <StoryCard
                key={card.title}
                {...card}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D9A8F]/20 to-purple-200/20 backdrop-blur-2xl border border-white/30 p-12 sm:p-16 lg:p-20 text-center space-y-8"
        >
          {/* Background animations */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-[#2D9A8F]/10 via-transparent to-purple-500/10 pointer-events-none"
          />

          <motion.div
            variants={itemVariants}
            className="relative z-10 space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900">
              Vii să scrii următorul capitol?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto">
              Alătură-te comunității de lideri medicali care transformă
              industria, o conferință la o dată.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-10 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-[#2D9A8F] to-purple-600 hover:from-[#248480] hover:to-purple-700 shadow-2xl hover:shadow-[#2D9A8F]/50 transition-all duration-300"
              >
                Explorează Evenimentele
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-10 py-4 rounded-2xl font-semibold text-[#2D9A8F] bg-white/60 hover:bg-white backdrop-blur-xl border border-[#2D9A8F]/30 hover:border-[#2D9A8F]/60 transition-all duration-300"
              >
                Contact Vânzări
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2D9A8F]/50 to-transparent" />
    </div>
  );
}