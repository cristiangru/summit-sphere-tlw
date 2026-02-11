"use client";

import {
  Stethoscope,
  Megaphone,
  Users,
  Microscope,
  Presentation,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GlowingEffectDemo() {
  return (
    <div className="w-full">
      {/* BUTONUL PLASAT DEASUPRA ÎNTREGII SECȚIUNI */}
      <div className="flex items-center justify-end mb-10 px-4">
        <Link href="/servicii">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="div"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-4 py-2 group"
          >
            <span>Mai multe servicii</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </HoverBorderGradient>
        </Link>
      </div>

      {/* GRID-UL DE CARDURI */}
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 ">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={
            <Stethoscope className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Organizare conferințe medicale"
          description="Planificăm și implementăm evenimente adaptate nevoilor tale."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={
            <Megaphone className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Promovare și marketing"
          description="Asigurăm vizibilitate și impact pentru evenimentul tău."
        />

        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Users className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Evenimente de networking"
          description="Într-un ecosistem profesional dinamic, conexiunile autentice accelerează inovația. La SummitSphere, planificăm strategic socializarea profesională, creând oportunități reale de interacțiune între participanți."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={
            <Microscope className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Simpozioane medicale"
          description="Servicii complete pentru organizarea simpozioanelor medicale, dedicate dezbaterilor științifice."
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={
            <Presentation className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Workshop-uri și seminarii"
          description="Organizăm workshop-uri și seminarii interactive, axate pe învățare practică."
        />
      </ul>
    </div>
  );
}

// Componenta GridItem rămâne neschimbată sub GlowingEffectDemo
interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
