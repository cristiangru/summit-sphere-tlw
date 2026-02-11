"use client";

import { Meteors } from "@/components/ui/meteors";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

export default function Org() {
  return (
    <div className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        {/* Grid layout - Left card, Right content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT SIDE - Card cu Meteors */}
          <div className="order-1">
            {/* Gradient orb background */}
            <div className="absolute inset-0 h-full w-full scale-[0.89] transform rounded-full bg-gradient-to-r from-[#2D9A8F] to-cyan-500 blur-3xl pointer-events-none -z-10" />

            {/* Card principal */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 px-6 sm:px-8 md:px-10 py-10 sm:py-12 md:py-14 shadow-2xl h-full flex flex-col justify-between">
              
              {/* Arrow Icon */}
              <div className="mb-6 sm:mb-8 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-[#2D9A8F]/50 bg-[#2D9A8F]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-3 w-3 sm:h-4 sm:w-4 text-[#2D9A8F]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="space-y-6 sm:space-y-8">
                {/* Brand Title */}
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    SummitSphere
                  </h2>
                  <div className="mt-2 h-1 w-16 bg-gradient-to-r from-[#2D9A8F] to-cyan-500 rounded-full" />
                </div>

                {/* Main Description */}
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-justify">
                    S-a născut din dorința de a crea mai mult decât evenimente – de a construi <span className="text-[#2D9A8F] font-semibold">punți între oameni, idei și viitor</span>.
                  </p>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-justify">
                    Credem că adevărata schimbare în sănătate începe cu profesioniști pasionați, reuniți într-un spațiu unde cunoașterea, inspirația și inovația prind viață.
</p>


                   <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-justify">
                    Cu o abordare personalizată și profund umană, SummitSphere pune în centrul fiecărei inițiative educația, colaborarea și dorința de a transforma viitorul sănătății într-un viitor mai bun pentru toți.

Nu creăm doar momente, ci contexte în care ideile devin soluții, iar conexiunile devin parteneriate durabile.
                   </p>
                </div>
              </div>

              {/* Meteors Effect */}
              <Meteors number={40} />
            </div>
          </div>

          {/* RIGHT SIDE - Content cards */}
          <div className="order-2 space-y-6 sm:space-y-8">
            
            {/* Card 1 - Vision */}
            <div className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-xl p-6 sm:p-8 hover:border-[#2D9A8F]/60 hover:shadow-lg hover:shadow-[#2D9A8F]/10 transition-all duration-300">
              <div className="flex items-start gap-4">
      
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Experiență Autentică
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
          Fiecare eveniment pe care îl organizăm este o experiență autentică, gândită cu grijă și dedicare, menită să lase o amprentă reală în carierele și în comunitățile celor care ne aleg.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Approach */}
            <div className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-xl p-6 sm:p-8 hover:border-[#2D9A8F]/60 hover:shadow-lg hover:shadow-[#2D9A8F]/10 transition-all duration-300">
              <div className="flex items-start gap-4">
        
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Parteneriate de Excelență
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                   Colaborăm cu specialiști din domenii precum ginecologie, pediatrie, dermatologie, farmacologie, cardiologie și altele, pentru a organiza evenimente care respectă cele mai înalte standarde, adresându-se nevoilor profesioniștilor din domeniul medical.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Promise */}
            <div className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-xl p-6 sm:p-8 hover:border-[#2D9A8F]/60 hover:shadow-lg hover:shadow-[#2D9A8F]/10 transition-all duration-300">
              <div className="flex items-start gap-4">
         
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Promisiunea Noastră
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                   Să fim alături de profesioniștii din sănătate în fiecare pas spre progres, inspirație și excelență.
                  </p>
                </div>
              </div>
            </div>

   

          </div>
        </div>
      </div>
    </div>
  );
}