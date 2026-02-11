"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function OwnerSection() {
  return (
    <section className="relative w-full pt-7 pb-20 bg-white overflow-hidden">
      {/* Aceternity Grid Background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT: THE FRAME (Sticky Portfolio Aesthetic) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <motion.div 
           
              className="relative group"
            >
              {/* Animated Gradient Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2D9A8F] to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-50 "></div>
              
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.2rem] bg-neutral-100 border border-neutral-200 shadow-2xl">
                <Image 
                  src="/images/Miruna.png" 
                  alt="Miruna" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
         
              </div>

              {/* Founder Label */}
              <div className="mt-8">
                <h3 className="text-3xl font-bold tracking-tighter text-black">Miruna</h3>
                <p className="text-[#2D9A8F] font-medium tracking-tight">Founder & CEO, SummitSphere</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: THE MANIFESTO */}
          <div className="flex-1 space-y-5">
            
            {/* Lead Quote */}
            <motion.div
          
              className="relative"
            >
              <h2 className="text-2xl md:text-2xl font-bold tracking-tighter text-black leading-[1.1] text-justify">
                "Cred cu tărie că fiecare <span className="text-[#2D9A8F] italic font-serif">idee bună</span> merită să devină realitate."
              </h2>
            </motion.div>

            {/* Core Text with Bento-Style Accent */}
            <div className="grid gap-12 text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
              <motion.p  className="text-justify"
             
              >
            Sunt convinsă că fiecare eveniment pe care îl organizăm este o oportunitate de a face o diferență și de a ajuta la creșterea și dezvoltarea continuă a celor care activează în domeniul medical. În final, ceea ce mă motivează este să știu că am contribuit, chiar și cu un mic pas, la evoluția celor din jurul meu.
              </motion.p>

              <div className="relative p-1 border-neutral-100 bg-neutral-50/50 rounded-3xl overflow-hidden border">
                <div className="bg-white p-4 rounded-[1.4rem] space-y-4">

                  <p className="text-neutral-800 text-justify">
                "Am crescut cu visul că, indiferent cât de mic aș fi, pot schimba lumea din jurul meu. Am fost un copil care a crezut în puterea ideilor, în valoarea oamenilor și în forța de a merge mereu mai departe."
                  </p>
                </div>
              </div>

              <motion.p className="text-justify"
       
              >
            Astăzi, acel copil trăiește mai departe în mine. Prin SummitSphere, transform fiecare eveniment într-o oportunitate reală de evoluție, de întâlnire, de inspirație. Cred că adevărata reușită nu stă în cifre sau aplauze, ci în modul în care reușim să luminăm drumul celorlalți, să îi ajutăm să creadă mai mult în ei, să crească, să viseze mai departe.
              </motion.p>
            </div>

            {/* Signature Highlight Card */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative p-10 bg-black text-white rounded-[2.5rem] overflow-hidden group shadow-2xl"
            >
              <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-white/5 group-hover:text-[#2D9A8F]/20 transition-colors duration-700" />
              
              <p className="relative z-10 text-xl md:text-1xl font-light italic leading-relaxed text-neutral-300 text-justify">
                "Pentru mine, fiecare conferință organizată, fiecare zâmbet sincer văzut într-o sală, fiecare idee schimbată între oameni este o <span className="text-white font-semibold">promisiune ținută</span> față de acel copil din mine care a visat că poate construi ceva ce rămâne."
              </p>
              
       
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}