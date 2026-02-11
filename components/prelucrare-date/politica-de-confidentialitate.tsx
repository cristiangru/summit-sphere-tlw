"use client";

import React from "react";
import { motion } from "framer-motion";
import { TracingBeam } from "@/components/ui/tracing-beam";

// Interfață pentru siguranța tipurilor
interface PrivacyItem {
  title: string;
  description: React.ReactNode;
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50/30 to-white dark:from-neutral-950/30 dark:to-neutral-950 py-16 md:py-32 mt-5 antialiased leading-relaxed font-trebuchet">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left mb-16 md:mb-24"
        >
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="text-black dark:text-white">
              Politica de
            </span>{" "}
            <br className="sm:hidden" />
            <span className="text-neutral-900 dark:text-white">Confidențialitate</span>
          </h1>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-5">
            <div className="h-1.5 w-20 rounded-full bg-linear-to-r from-[#2D9A8F] to-[#06b6d4]" />
          </div>

          <p className="mt-10 text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed italic max-w-3xl mx-auto md:mx-0">
            SummitSphere respectă confidențialitatea și protecția datelor dumneavoastră personale.
            Vă rugăm să citiți cu atenție această politică.
          </p>
        </motion.div>

        {/* Conținut principal */}
        <TracingBeam className="px-2 sm:px-0">
          <div className="space-y-16 md:space-y-24 prose prose-lg prose-neutral dark:prose-invert max-w-none">
            {privacyContent.map((item: PrivacyItem, index: number) => (
              <motion.section
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <h2 className="text-2xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 not-italic">
                  {item.title}
                </h2>

                <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-[1.05rem] md:text-lg text-justify">
                  {item.description}
                </div>
              </motion.section>
            ))}
          </div>
        </TracingBeam>
      </div>
    </div>
  );
}

const privacyContent: PrivacyItem[] = [
  {
    title: "POLITICA PRIVIND PROTECȚIA DATELOR CU CARACTER PERSONAL ȘI POLITICA DE CONFIDENȚIALITATE",
    description: (
      <>
        <p className="mb-4 font-bold">1. Dispoziții Generale</p>
        <p className="mb-4">1.1. SummitSphere SRL, în calitate de Operator de date cu caracter personal, cu sediul în București, Șos. Chitilei nr. 23, Sector 1, CUI RO48728824, își asumă respectarea deplină a prevederilor Regulamentului (UE) 2016/679 ("GDPR") și a legislației naționale aplicabile privind protecția datelor.</p>
        <p className="mb-4">1.2. Această Politică reglementează modalitățile de colectare, utilizare, prelucrare, stocare, transfer și protecție a datelor cu caracter personal furnizate de Participanți în cadrul evenimentelor organizate.</p>
        <p>1.3. Prin participarea la evenimentele SummitSphere SRL, Participantul declară că a fost informat în mod complet, explicit și detaliat cu privire la toate aspectele privind prelucrarea datelor sale personale.</p>
      </>
    ),
  },
  {
    title: "2. Categorii de Date Prelucrate",
    description: (
      <>
        <p className="mb-4">2.1. SummitSphere SRL poate prelucra următoarele categii de date personale:</p>
        <ul className="space-y-3 list-disc pl-6 mb-6">
          <li>Date de identificare: nume, prenume;</li>
          <li>Date de contact: adresă de e-mail, număr de telefon;</li>
          <li>Date profesionale: funcție, organizație/instituție, specializare;</li>
          <li>Imaginea Participantului: fotografii, materiale video captate în cadrul evenimentelor;</li>
          <li>Date de facturare: adrese de facturare, coduri fiscale (pentru persoane juridice);</li>
          <li>Feedback, răspunsuri la sondaje, comentarii sau opinii exprimate în timpul sau după eveniment.</li>
        </ul>
        <p>2.2. Prelucrarea acestor date este necesară și obligatorie pentru asigurarea participării la eveniment, pentru respectarea obligațiilor contractuale și legale ale Organizatorului și pentru realizarea intereselor sale legitime.</p>
      </>
    ),
  },
  {
    title: "3. Scopurile Prelucrării",
    description: (
      <>
        <p className="mb-4">3.1. Datele personale sunt prelucrate în următoarele scopuri legitime și justificate:</p>
        <ul className="space-y-3 list-disc pl-6 mb-6">
          <li>Înregistrarea și participarea la eveniment;</li>
          <li>Comunicarea detaliilor organizatorice (locație, agendă, modificări);</li>
          <li>Facturare, emiterea documentelor contabile și justificative;</li>
          <li>Îndeplinirea obligațiilor legale privind evidența financiară și fiscală;</li>
          <li>Documentarea și promovarea evenimentului prin fotografii și înregistrări;</li>
          <li>Transmiterea de invitații la evenimente viitoare sau comunicări comerciale, numai cu consimțământul prealabil.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Temeiurile Juridice",
    description: (
      <>
        <p className="mb-4">4.1. Prelucrarea datelor se întemeiază pe următoarele temeiuri:</p>
        <ul className="space-y-3 list-disc pl-6">
          <li>Articolul 6(1)(b) GDPR – executarea unui contract la care Participantul este parte;</li>
          <li>Articolul 6(1)(c) GDPR – îndeplinirea obligațiilor legale ale Organizatorului;</li>
          <li>Articolul 6(1)(a) GDPR – consimțământul explicit pentru marketing și utilizarea imaginii;</li>
          <li>Articolul 6(1)(f) GDPR – interesele legitime ale Organizatorului privind desfășurarea și promovarea activităților sale.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Destinatarii și Transferurile de Date",
    description: (
      <>
        <p className="mb-4">5.1. Datele pot fi dezvăluite, în condiții strict controlate:</p>
        <ul className="space-y-3 list-disc pl-6 mb-6">
          <li>Angajaților și colaboratorilor Organizatorului implicați în organizare;</li>
          <li>Furnizorilor de servicii auxiliare (hosting IT, email marketing, contabilitate, servicii video);</li>
          <li>Autorităților și instituțiilor publice, conform obligațiilor legale.</li>
        </ul>
        <p>5.2. În situația transferului de date în afara Spațiului Economic European (SEE), SummitSphere SRL va asigura aplicarea unor măsuri suplimentare de protecție, cum ar fi clauze contractuale standard aprobate de Comisia Europeană.</p>
      </>
    ),
  },
  {
    title: "6. Durata de Stocare",
    description: (
      <>
        <p className="mb-4">6.1. Datele personale sunt păstrate:</p>
        <ul className="space-y-3 list-disc pl-6 mb-6">
          <li>Pe durata necesară organizării și finalizării evenimentului;</li>
          <li>Pe durata obligațiilor legale de arhivare (minimum 5 ani);</li>
          <li>Pentru comunicări comerciale, până la retragerea consimțământului.</li>
        </ul>
        <p>6.2. La expirarea perioadei de păstrare, datele vor fi șterse sau, după caz, anonimizate ireversibil.</p>
      </>
    ),
  },
  {
    title: "7. Drepturile Participantului",
    description: (
      <>
        <p className="mb-4">7.1. Participantul are următoarele drepturi garantate prin GDPR:</p>
        <ul className="space-y-3 list-disc pl-6 mb-6">
          <li>Dreptul de acces la datele personale;</li>
          <li>Dreptul de rectificare a datelor incorecte;</li>
          <li>Dreptul de ștergere ("dreptul de a fi uitat");</li>
          <li>Dreptul de restricționare a prelucrării;</li>
          <li>Dreptul la portabilitatea datelor;</li>
          <li>Dreptul de a se opune prelucrării în scop de marketing direct;</li>
          <li>Dreptul de a retrage consimțământul în orice moment, fără a afecta legalitatea prelucrării anterioare;</li>
          <li>Dreptul de a depune o plângere la ANSPDCP.</li>
        </ul>
        <p>7.2. Exercitarea acestor drepturi se realizează prin cerere scrisă trimisă la adresa de corespondență a Organizatorului sau pe e-mail, însoțită de elemente de identificare pentru protecția datelor.</p>
      </>
    ),
  },
  {
    title: "8. Politica de Confidențialitate",
    description: (
      <>
        <p className="mb-4">8.1. SummitSphere SRL se angajează să păstreze caracterul confidențial al tuturor informațiilor furnizate de Participanți, utilizând măsuri tehnice și organizatorice de nivel înalt, inclusiv protecție antivirus, firewall, criptare de date și proceduri interne stricte.</p>
        <p className="mb-4">8.2. Informațiile nu vor fi partajate, divulgate sau utilizate în alte scopuri decât cele declarate, cu excepția cazurilor expres reglementate prin lege sau autorizate de Participant.</p>
        <p className="mb-4">8.3. Utilizarea imaginii Participantului (fotografii, materiale audio-video) în scop de marketing și promovare se va face exclusiv în baza consimțământului exprimat, care poate fi retras oricând fără afectarea legalității anterioare.</p>
        <p>8.4. SummitSphere SRL va trata cu maximă responsabilitate toate incidentele de securitate privind datele personale, informând autoritățile competente și, după caz, persoanele vizate, în termenele prevăzute de GDPR.</p>
      </>
    ),
  },
  {
    title: "9. Răspundere și Despăgubiri",
    description: (
      <>
        <p className="mb-4">9.1. În cazul în care Participantul consideră că drepturile sale au fost încălcate, acesta poate solicita despăgubiri morale sau materiale, conform procedurilor legale în vigoare.</p>
        <p>9.2. SummitSphere SRL limitează răspunderea sa față de Participant, în toate cazurile, la daunele dovedite și directe, excluzând în mod expres orice răspundere pentru prejudicii indirecte, de imagine, de profit sau oportunități pierdute.</p>
      </>
    ),
  },
  {
    title: "10. Modificări ale Politicii",
    description: (
      <>
        <p className="mb-4">10.1. SummitSphere SRL își rezervă dreptul de a modifica unilateral această Politică în funcție de modificările legislative sau ale practicilor interne.</p>
        <p>10.2. Actualizările vor fi comunicate prin publicare pe site-ul Organizatorului și vor produce efecte de la data publicării.</p>
      </>
    ),
  },
];