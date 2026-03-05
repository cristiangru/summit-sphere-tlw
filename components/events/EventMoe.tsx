"use client";

import React from "react";
import { motion } from "framer-motion";
import { LogoCarousel } from "@/components/logo/LogoCarousel";
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe 
} from "lucide-react";

export default function EventMoe() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-100 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              Eveniment Premium • 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-8 leading-[1.1]">
              Peptide în <br /> <span className="text-blue-600">Medicina Modernă</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-light mb-12">
              Principii biologice și aplicații clinice. O incursiune în medicina secolului XXI alături de Dr. Heribert Moellinger.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            <InfoTag icon={<Calendar size={16} />} text="28-29 Martie 2025" />
            <InfoTag icon={<MapPin size={16} />} text="București, Sos. Mihai Bravu" />
            <InfoTag icon={<Award size={16} />} text="10 Puncte EMC" isBlue />
          </div>
        </div>
      </section>

      <LogoCarousel />

      {/* --- SPEAKER SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-black">Who’s Speaking</h2>
            <div className="space-y-4 text-zinc-600 leading-relaxed">
              <p className="text-zinc-900 font-medium text-lg italic">Dr. Heribert Moellinger</p>
              <p className="font-medium text-zinc-800 tracking-tight text-sm uppercase">BHRT & Anti-Aging Specialist</p>
              <p>Medic și expert internațional în terapii avansate cu peptide, cu o experiență solidă în utilizarea clinică pentru regenerare și optimizare metabolică.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CertItem text="Membru A4M (USA)" />
              <CertItem text="Expert Peptide (IPS)" />
              <CertItem text="Certificat BHRT" />
              <CertItem text="Fellowship Metabolic Institute" />
            </div>
          </div>

          <div className="order-1 lg:order-2 relative group">
            <div className="aspect-square bg-zinc-100 rounded-3xl overflow-hidden shadow-sm border border-zinc-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/10">
               <div className="absolute inset-0 bg-linear-to-t from-zinc-900/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING & CTA --- */}
      <section className="py-24 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
             <BentoCard title="Bazele Biologice" desc="Structura peptidelor în fiziologie." icon={<ShieldCheck className="text-blue-600" />} />
             <BentoCard title="Aplicații Clinice" desc="Protocoale practice de tratament." icon={<Zap className="text-blue-600" />} />
             <BentoCard title="Limbă Curs" desc="Predare în limba engleză." icon={<Globe className="text-blue-600" />} />
          </div>

          <div className="p-1 bg-white border border-zinc-100 rounded-[2.5rem] shadow-xl shadow-zinc-200/50">
            <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
               <div>
                  <h3 className="text-2xl font-bold mb-2">Pășește în Medicina Secolului XXI</h3>
                  <p className="text-zinc-500 text-sm italic">Înscrieri în limita celor 80 de locuri disponibile.</p>
               </div>
               <div className="flex flex-col items-center md:items-end">
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-bold">4000</span>
                    <span className="text-zinc-400 font-bold uppercase text-sm">lei</span>
                  </div>
                  <button className="px-10 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 group">
                    Înscrie-te la eveniment
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-zinc-400 text-[10px] tracking-[0.3em] border-t border-zinc-100 uppercase">
        © 2025 Peptide Medicine Conference
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS CU TYPESCRIPT ---

interface InfoTagProps {
  icon: React.ReactNode;
  text: string;
  isBlue?: boolean;
}

function InfoTag({ icon, text, isBlue = false }: InfoTagProps) {
  return (
    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${
      isBlue 
        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'bg-white border-zinc-200 text-zinc-600 shadow-sm hover:border-zinc-300'
    }`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

interface CertItemProps {
  text: string;
}

function CertItem({ text }: CertItemProps) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-500 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
      <CheckCircle2 size={14} className="text-blue-600" />
      {text}
    </div>
  );
}

interface BentoCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function BentoCard({ title, desc, icon }: BentoCardProps) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
      <div className="mb-4 p-3 bg-zinc-50 w-fit rounded-xl group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}