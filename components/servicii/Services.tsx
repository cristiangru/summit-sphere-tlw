"use client";
import { HoverEffect } from "../ui/card-hover-effect";
export default function Services() {
  return (
    <div className="w-full  bg-white">
      <HoverEffect items={services} />
    </div>
  );
}

export  const services = [
  {
    title: "Organizare conferințe medicale",
    description:
      "Planificăm și gestionăm conferințe medicale personalizate: locație, logistică, promovare și coordonare completă — cu accent pe profesionalism și succesul evenimentului.",
      link: "/servicii/conferinte-medicale", // ← poți pune link real sau "#" dacă nu există încă pagină
  },
  {
    title: "Promovare și marketing",
    description:
      "Campanii personalizate și strategii moderne pe mai multe canale pentru a atrage exact participanții potriviți și a maximiza vizibilitatea și impactul evenimentului.",
    link: "/servicii/promovare-evenimente-medicale",
  },
  {
    title: "Workshop-uri și seminarii",
    description:
      "Organizăm sesiuni interactive pe teme medicale de actualitate — spațiu ideal pentru formare continuă, discuții practice și schimb valoros de experiență între specialiști.",
    link: "/servicii/workshop-uri-seminarii",
  },
  {
    title: "Evenimente de networking",
    description:
      "Creăm conexiuni reale prin sesiuni structurate de networking, întâlniri one-to-one și activități sociale care facilitează colaborarea și relațiile profesionale de lungă durată.",
    link: "/servicii/networking-medical",
  },
  {
    title: "Simpozioane medicale",
    description:
      "Servicii complete pentru simpozioane științifice: organizare spațiu, suport tehnic și logistic pentru dezbateri de top, prezentări academice și abordarea celor mai noi teme medicale.",
    link: "/servicii/simpozioane-medicale",
  },
  {
    title: "Servicii de consultanță",
    description:
      "Expertiză de la strategie și concept până la implementare și comunicare. Te ajutăm să-ți atingi obiectivele cu soluții eficiente, personalizate și orientate spre rezultat.",
    link: "/servicii/consultanta-evenimente-medicale",
  },
  {
    title: "Gestionare evenimente online",
    description:
      "Organizăm și gestionăm evenimente medicale digitale de calitate: platformă stabilă, interacțiune live, acces facil și experiență optimă pentru participanții din toată țara sau internaționali.",
    link: "/servicii/evenimente-online-medicale",
  },
];