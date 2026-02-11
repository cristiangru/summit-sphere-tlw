"use client";

import { Meteors } from "@/components/ui/meteors";
import Excelenta2 from "@/components/home/Excelenta2";

export default function Org() {
  return (
    <div className="relative w-full py-8 sm:py-12 md:py-16 lg:py-9">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid layout - Text card left, OurValue2 right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT SIDE - Text Card with Meteors */}
          <div className="order-1">
            {/* Gradient orb background */}
            <div className="absolute inset-0 h-full w-full scale-[0.89] transform rounded-full bg-gradient-to-r from-[#2D9A8F] to-cyan-500 blur-3xl pointer-events-none -z-10" />

            {/* Card principal */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-5 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 shadow-xl h-full flex flex-col justify-between">
              {/* Icon mic sus */}
              <div className="mb-4 sm:mb-6 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
              </div>

              {/* Content Section */}
              <div className="space-y-4 sm:space-y-6">
                {/* Titluri */}
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                    SummitSphere
                  </h1>

                  <h2 className="relative z-10 text-lg sm:text-xl md:text-2xl font-semibold text-[#2D9A8F] leading-snug">
                    Excelență în organizarea evenimentelor medicale
                  </h2>
                </div>

                {/* Descriere */}
                <p className="relative z-10 text-sm sm:text-base text-slate-300 md:text-slate-400 leading-relaxed text-justify">
                  Evenimentele medicale sunt esențiale pentru schimbul de cunoștințe și progresul în domeniu. La SummitSphere, ne ocupăm de fiecare detaliu pentru a crea experiențe memorabile, care adun împreună profesioniști, lideri de opinie și inovație medicală.
                </p>

                <p className="relative z-10 text-sm sm:text-base text-slate-300 md:text-slate-400 leading-relaxed text-justify">
                  Punem accent pe calitate, rigoare științifică și organizare impecabilă, astfel încât fiecare eveniment să își atingă obiectivele educaționale și profesionale.
                </p>
              </div>

 

         

              {/* Efectul de meteori */}
              <Meteors number={50} />
            </div>
          </div>

          {/* RIGHT SIDE - OurValue2 */}
          <div className="order-2 hidden lg:block">
            <Excelenta2 />
          </div>

          {/* Mobile OurValue2 - appears below card on mobile */}
          <div className="order-3 lg:hidden col-span-1">
            <Excelenta2 />
          </div>
        </div>
      </div>
    </div>
  );
}