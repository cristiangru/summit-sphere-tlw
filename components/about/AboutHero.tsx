"use client";

import { motion } from "framer-motion";

type TextCard = {
  title: string;
  description: string;
};

const cards: TextCard[] = [
  {
    title: "Descoperă. Inspiră. Conectează.",
    description:
      "SummitSphere creează punți reale între oameni, idei și viitorul medicinei.",
  },
  {
    title: "Pasiune & profesionalism",
    description:
      "Schimbarea începe cu profesioniști pasionați reuniți în jurul cunoașterii și inovației.",
  },
  {
    title: "Experiențe autentice",
    description:
      "Fiecare eveniment e gândit cu grijă să lase o amprentă reală și durabilă.",
  },
  {
    title: "Abordare umană",
    description:
      "Educație, colaborare și soluții cu omul în centru – mereu.",
  },
  {
    title: "Contexte de transformare",
    description:
      "Idei care devin soluții. Conexiuni care devin parteneriate.",
  },
  {
    title: "Promisiunea noastră",
    description:
      "Să fim alături de profesioniștii din sănătate spre progres și excelență.",
  },
];

export default function AboutIntro() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Very tight, focused header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900">
            Summit<span className="text-teal-600">Sphere</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-500 font-light tracking-wide">
            VALORI ȘI PRINCIPII
          </p>
        </div>

        {/* Structured definition list style – very readable */}
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-12">
          <div>
            <dt className="text-base font-semibold text-gray-900">
              Descoperă. Inspiră. Conectează.
            </dt>
            <dd className="mt-2 text-sm text-gray-600">
              Creăm punți între oameni, idei și viitorul medicinei.
            </dd>
          </div>

          <div>
            <dt className="text-base font-semibold text-gray-900">
              Pasiune & profesionalism
            </dt>
            <dd className="mt-2 text-sm text-gray-600">
              Schimbarea reală începe cu profesioniști pasionați și un mediu propice inovației.
            </dd>
          </div>

          <div>
            <dt className="text-base font-semibold text-gray-900">
              Experiențe care rămân
            </dt>
            <dd className="mt-2 text-sm text-gray-600">
              Evenimente gândite cu grijă, care lasă o urmă autentică.
            </dd>
          </div>

          <div>
            <dt className="text-base font-semibold text-gray-900">
              Omul în centru
            </dt>
            <dd className="mt-2 text-sm text-gray-600">
              Educație, colaborare și soluții cu adevărat umane.
            </dd>
          </div>

          <div>
            <dt className="text-base font-semibold text-gray-900">
              Contexte de transformare
            </dt>
            <dd className="mt-2 text-sm text-gray-600">
              Idei → soluții practice. Conexiuni → parteneriate durabile.
            </dd>
          </div>

          <div>
            <dt className="text-base font-semibold text-gray-900">
              Promisiunea noastră
            </dt>
            <dd className="mt-2 text-sm text-gray-600">
              Să fim partenerul constant al profesioniștilor din sănătate pe drumul spre excelență.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}