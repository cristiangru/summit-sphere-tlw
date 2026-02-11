"use client";

import { Lightbulb, Handshake, Shield, Star, Heart } from "lucide-react";
import { AnimatedValues } from "@/components/ui/animated-testimonials";

type Value = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className: string }>;
  bgGradient: string;
  iconColor: string;
};

export default function AnimatedValuesDemo() {
  const values: Value[] = [
    {
      title: "Inovație și creativitate",
      description:
        "Căutăm constant noi modalități de a îmbunătăți și diversifica experiențele oferite, integrând soluții inovatoare și abordări creative care răspund celor mai recente tendințe și nevoi din domeniul medical.",
      icon: Lightbulb,
      bgGradient:
        "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30",
      iconColor: "text-yellow-500 dark:text-yellow-400",
    },
    {
      title: "Valorile noastre",
      description:
        "La SummitSphere, înțelegem că fiecare eveniment este o oportunitate de a contribui la formarea și dezvoltarea continuă a liderilor din domeniul sănătății, iar succesul nostru este măsurat prin impactul pozitiv și durabil pe care îl avem asupra comunității medicale.",
      icon: Heart,
      bgGradient:
        "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30",
      iconColor: "text-red-500 dark:text-red-400",
    },
    {
      title: "Colaborare și parteneriate",
      description:
        "Construim relații solide și durabile cu organizații, experți și profesioniști din domeniu, pentru a crea evenimente relevante și a asigura un impact real, coerent și sustenabil pe termen lung.",
      icon: Handshake,
      bgGradient:
        "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      title: "Integritate și transparență",
      description:
        "Ne angajăm să livrăm servicii de cea mai înaltă calitate, acționând cu responsabilitate, onestitate și respect față de etica profesională, în toate etapele procesului de organizare.",
      icon: Shield,
      bgGradient:
        "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      title: "Calitate",
      description:
        "Fiecare detaliu al evenimentelor noastre este atent planificat și executat la standarde ridicate, pentru a garanta o experiență impecabilă, satisfacția participanților și succesul organizatoric general.",
      icon: Star,
      bgGradient:
        "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
      iconColor: "text-purple-500 dark:text-purple-400",
    },
  ];

  return <AnimatedValues values={values} />;
}
