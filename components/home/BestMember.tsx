"use client";

import  { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
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
  <motion.p
    className="text-neutral-600 dark:text-neutral-400 text-sm"
  >
    Owner SummitSphere
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
<motion.div layoutId={`image-${card.title}-${id}`} className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
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
        className="font-bold text-lg text-neutral-800 dark:text-neutral-200"
      >
        {card.title}
      </motion.h3>
      <motion.p
        className="text-neutral-600 dark:text-neutral-400 text-xs"
      >
        Owner SummitSphere
      </motion.p>
    </div>
    <motion.p
      layoutId={`description-${card.description}-${id}`}
      className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mt-2 text-justify"
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
    description: "Mă bucur să pot contribui la construirea unor evenimente care nu doar informează, ci și inspiră, ajutându-i pe ceilalți să evolueze și să ajungă la potențialul lor maxim.",
    title: "Miruna",
    src: "/images/Miruna.png",


    content: () => {
      return (
       <>
          <p>
            Cred cu tărie că fiecare idee bună merită să devină realitate, iar misiunea mea este să aduc oamenii împreună, să creez oportunități pentru ei și să sprijin progresul lor, atât pe plan profesional, cât și personal.
          </p>
          <p>
            Sunt convinsă că fiecare eveniment pe care îl organizăm este o oportunitate de a face o diferență și de a ajuta la creșterea și dezvoltarea continuă a celor care activează în domeniul medical. În final, ceea ce mă motivează este să știu că am contribuit, chiar și cu un mic pas, la evoluția celor din jurul meu.</p>
               <p>
            Cred cu tărie că fiecare idee bună merită să devină realitate, iar misiunea mea este să aduc oamenii împreună, să creez oportunități pentru ei și să sprijin progresul lor, atât pe plan profesional, cât și personal.
          </p>
          <p>
            "Am crescut cu visul că, indiferent cât de mic aș fi, pot schimba lumea din jurul meu. Am fost un copil care a crezut în puterea ideilor, în valoarea oamenilor și în forța de a merge mereu mai departe.
          </p>
          <p>
            Astăzi, acel copil trăiește mai departe în mine. Prin SummitSphere, transform fiecare eveniment într-o oportunitate reală de evoluție, de întâlnire, de inspirație. Cred că adevărata reușită nu stă în cifre sau aplauze, ci în modul în care reușim să luminăm drumul celorlalți, să îi ajutăm să creadă mai mult în ei, să crească, să viseze mai departe.
          </p>
          <p>
            Pentru mine, fiecare conferință organizată, fiecare zâmbet sincer văzut într-o sală, fiecare idee schimbată între oameni este o promisiune ținută față de acel copil din mine care a visat că poate construi ceva ce rămâne."
          </p>
       
        </>

      );
    },
  },
];