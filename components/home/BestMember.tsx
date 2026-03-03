"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/lib/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null,
  );
  const ref = useRef<HTMLDivElement>(null!);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="pl-4">
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-bold text-neutral-700 dark:text-neutral-200 text-xl mt-2"
                  >
                    {active.title}
                  </motion.h3>
                  <motion.p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    viziunea din spatele SummitSphere
                  </motion.p>
                </div>

                <div className="pt-4 relative px-4 flex-1 overflow-y-auto">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base flex flex-col items-start gap-4 dark:text-neutral-400 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.5)] [-webkit-overflow-scrolling:touch] text-justify"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-8 flex flex-col md:flex-row justify-between items-start hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer gap-6 min-h-[200px]"
          >
            <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
              <motion.div
                layoutId={`image-${card.title}-${id}`}
                className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start"
              >
                <img
                  width={120}
                  height={120}
                  src={card.src}
                  alt={card.title}
                  className="h-32 w-32 md:h-28 md:w-28 rounded-lg object-cover object-top"
                />
              </motion.div>

              <div className="flex-1">
                <div className="flex gap-2 items-baseline">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-bold text-xl text-neutral-800 dark:text-neutral-200"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    viziunea din spatele SummitSphere
                  </motion.p>
                </div>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mt-2 text-justify"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description:
      "Mă bucur să pot contribui la construirea unor evenimente care nu doar informează, ci și inspiră, ajutându-i pe ceilalți să evolueze și să ajungă la potențialul lor maxim.",
    title: "Miruna",
    src: "/images/Miruna.png",

    content: () => {
      return (
        <div className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base flex flex-col gap-6">
          {/* Intro Section */}
          <div className="space-y-4">
            <p className="font-semibold text-neutral-800 dark:text-white text-lg">
              Construim experiențe care conectează oamenii și susțin progresul medical.
            </p>
            <p>
              SummitSphere a fost creată din convingerea că progresul real începe atunci când oamenii se întâlnesc, schimbă idei și construiesc împreună. Misiunea mea este să aduc profesioniștii din domeniul medical mai aproape unii de alții, să creez contexte în care colaborarea devine naturală și să transform fiecare eveniment într-o experiență cu impact real.
            </p>
            <p>
              Cred cu tărie că fiecare idee valoroasă merită să prindă formă și că rolul nostru este să creăm spațiul în care aceasta poate deveni realitate.
            </p>
          </div>

          {/* Personal Background Section */}
          <div className="space-y-4">
            <p>
              Încă din copilărie am crezut în puterea ideilor și în valoarea oamenilor. Am crescut cu convingerea că, indiferent cât de mic pare un pas, el poate contribui la schimbări reale în jurul nostru.
            </p>
            <p>
              Acea credință a rămas parte din mine. Astăzi, prin SummitSphere, o transform în acțiune — construind evenimente care nu sunt doar organizate, ci gândite ca oportunități autentice de întâlnire, de inspirație și de evoluție profesională.
            </p>
            <p>
              Activitatea mea este orientată către dezvoltarea și coordonarea proiectelor din domeniul medical, cu accent pe organizarea de evenimente științifice, experiența participanților și crearea unor contexte relevante de dialog profesional.
            </p>
          </div>

          {/* Principles List */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <p className="font-bold text-neutral-800 dark:text-white mb-3">Fiecare proiect este construit pe principii clare:</p>
            <ul className="list-none space-y-2">
              {["profesionalism", "rigoare organizațională", "atenție la detalii", "respect pentru comunitatea medicală", "orientare reală către impact"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2D9A8F]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p>
            Pentru mine, organizarea unui eveniment nu înseamnă doar logistică — înseamnă responsabilitatea de a crea un spațiu în care oamenii pot crește, învăța și colabora.
          </p>

          <p>
            Cred că progresul în sănătate nu se construiește doar prin informație, ci prin conexiuni autentice între oameni. SummitSphere există pentru a facilita these conexiuni și pentru a transforma fiecare întâlnire profesională într-o experiență care generează valoare pe termen lung.
          </p>

          <p>
            Fiecare eveniment este o oportunitate de a face o diferență — de a susține evoluția profesională, de a inspira idei noi și de a contribui, chiar și prin pași mici, la dezvoltarea comunității medicale.
          </p>

          {/* Values List */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <p className="font-bold text-neutral-800 dark:text-white mb-3">Valorile care ne ghidează:</p>
            <ul className="list-none space-y-2">
              {["profesionalism fără compromis", "respect pentru oameni și cunoaștere", "excelență organizațională", "colaborare autentică", "experiențe care rămân"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2D9A8F]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Closing Section */}
          <div className="space-y-4 pt-4">
            <p>
              Pentru mine, adevărata reușită nu se măsoară în cifre sau aplauze, ci în impactul pe care îl avem asupra oamenilor.
            </p>
            <p>
              Fiecare conferință organizată, fiecare dialog facilitat și fiecare experiență creată reprezintă o promisiune împlinită — aceea de a contribui la evoluția celor din jur și de a construi ceva care rămâne.
            </p>
            <p className="font-medium text-[#2D9A8F] pt-2">
              Dacă îți dorești să dezvoltăm un proiect sau să organizăm un eveniment care creează impact real, te invit să intrăm în dialog.
            </p>
          </div>
        </div>
      );
    },
  },
];
