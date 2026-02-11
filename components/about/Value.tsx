"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

const content = [
  {
    title: "Misiunea noastră",
    description:
      "La SummitSphere, credem că educația continuă este cheia evoluției în sănătate. Misiunea noastră este să aducem împreună oameni care schimbă vieți, să creăm spații în care ideile cresc și prind formă, și să oferim experiențe de învățare care lasă urme adânci în cariere și comunități.Fiecare eveniment organizat de noi este o promisiune: aceea de a susține cunoașterea, colaborarea și curajul de a inova.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-white text-2xl font-medium">
  Misiunea noastră
      </div>
    ),
  },
  {
    title: "Viziunea noastră",
    description:
      "Visăm la o lume medicală în care inovația, educația și colaborarea nu cunosc limite. Ne dorim să fim mai mult decât organizatori de evenimente: vrem să fim creatorii unor experiențe care inspiră, deschid drumuri și transformă profesioniști în arhitecții unui viitor mai sănătos. Prin fiecare proiect, construim punți între idei, între generații și între aspirații profesionale.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-white text-2xl font-medium">
       Viziunea 
      </div>
    ),
  },
  {
    title: "Valorile noastre",
    description:
      "În tot ceea ce facem, ne ghidăm după valori care nu pot fi negociate: integritate, pasiune, excelență și respect. La SummitSphere, fiecare parteneriat este construit cu sinceritate, fiecare serviciu este livrat cu grijă autentică, iar fiecare eveniment poartă amprenta dorinței noastre de a aduce plus valoare reală. Credem în relații care durează și în impact care depășește momentul unui simplu eveniment.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white text-2xl font-medium">
            Valori
      </div>
    ),
  },

  {
    title: "Obiectivele noastre",
    description:
      "Ne propunem să fim motorul educației de calitate, să oferim profesioniștilor nu doar informație, ci adevărate experiențe de creștere. Prin programe formative și evenimente interactive, cultivăm comunități de specialiști dedicați, încurajăm schimbul de idei vii și susținem formarea liderilor de mâine. Fiecare obiectiv îndeplinit nu este doar o reușită pentru noi, ci o promisiune ținută față de viitorul sănătății.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/20 to-teal-500/20 text-white text-2xl font-medium">
        Obiective
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={content} />
    </div>
  );
}