"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export default function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
       Servicii Premium
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
       Oferim soluții complete pentru organizarea și gestionarea evenimentelor medicale, adaptate nevoilor și obiectivelor fiecărui client. Fie că este vorba despre conferințe, workshop-uri, simpozioane sau evenimente online, ne asigurăm că fiecare detaliu este gestionat profesional. De asemenea, sprijinim promovarea și creșterea vizibilității evenimentelor prin strategii eficiente de marketing.
          </p>
        </div>
        <img
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
         La SummitSphere, fiecare eveniment prinde viață prin pasiune și grijă față de oameni.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
Cu o strategie bine conturată și o echipă dedicată, construim experiențe care aduc profesioniștii din sănătate mai aproape, pentru a învăța, a colabora și a crea viitorul împreună.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
           Fiecare detaliu contează, pentru că știm că adevărata inovație începe cu o conexiune autentică.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
