"use client";

import React from "react";
import { motion } from "framer-motion";
import { TracingBeam } from "@/components/ui/tracing-beam";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white dark:from-neutral-950/30 dark:to-neutral-950 py-16 md:py-32 mt-5 antialiased leading-relaxed">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left mb-16 md:mb-24"
        >
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            <span className=" bg-clip-text text-black">
              Termeni și
            </span>{" "}
            <br className="sm:hidden" />
            <span className="text-neutral-900 dark:text-white">Condiții</span>
          </h1>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-5">
            <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-[#2D9A8F] to-[#06b6d4]" />
          </div>

        
        </motion.div>

        {/* Conținut principal */}
        <TracingBeam className="px-2 sm:px-0">
          <div className="space-y-16 md:space-y-24 prose prose-lg prose-neutral dark:prose-invert max-w-none">
            {termsContent.map((item, index) => (
              <motion.section
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
              >
                <h2 className="text-2xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 not-italic">
                  {item.title}
                </h2>

                <div className="italic text-neutral-800 dark:text-neutral-200 leading-relaxed text-[1.05rem] md:text-lg text-justify">
                  {item.description}
                </div>

                {item.highlight && (
                  <div className="mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#2D9A8F]/5 to-[#06b6d4]/5 dark:from-[#2D9A8F]/10 dark:to-[#06b6d4]/10 border border-[#2D9A8F]/20 dark:border-[#2D9A8F]/30">
                    <p className="text-lg md:text-xl italic font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed">
                      {item.highlight}
                    </p>
                  </div>
                )}
              </motion.section>
            ))}
          </div>
        </TracingBeam>
      </div>
    </div>
  );
}

const termsContent = [
  {
    title: "Bine ați venit pe site-ul SummitSphere!",
    description: (
      <>
        Accesul și utilizarea acestui site sunt reglementate de următorii Termeni și Condiții. Prin utilizarea site-ului nostru, acceptați în totalitate acești termeni. Vă recomandăm să citiți cu atenție informațiile prezentate în această secțiune.
      </>
    ),
  },
  {
    title: "1. Dispoziții Generale",
    description: (
      <>
        <p className="mb-6">
          1.1. În sensul și pentru aplicarea prezentului document, termenii de mai jos au următoarele semnificații:
        </p>
        <ul className="space-y-5 list-none mb-6">
          {[
            { term: '"Organizator"', def: "– reprezintă SummitSphere SRL, societate cu răspundere limitată organizatoare a evenimentelor, având sediul în București, Șos. Chitilei nr. 23, Sector 1, CUI RO48728824." },
            { term: '"Participant"', def: "– desemnează orice persoană fizică sau juridică care a completat formularul de înscriere și a achitat integral taxa de participare la un eveniment organizat de SummitSphere SRL." },
            { term: '"Eveniment"', def: "– reprezintă orice formă de conferință, seminar, workshop, curs, sesiune de training, atelier sau întâlnire profesională organizată de SummitSphere SRL, în format fizic sau online." },
            { term: '"Taxă de participare"', def: "– suma de bani stabilită de Organizator pentru participarea la un eveniment, conform ofertei comerciale comunicate." },
            { term: '"Forță majoră"', def: "– orice eveniment extern, imprevizibil, absolut invincibil și inevitabil, care împiedică executarea obligațiilor contractuale, conform definiției prevăzute de Codul Civil român, incluzând, fără limitare, calamități naturale, incendii, inundații, pandemii, greve, conflicte armate sau acte ale autorităților statului." },
            { term: '"Date cu caracter personal"', def: "– orice informații referitoare la o persoană fizică identificată sau identificabilă, prelucrate de Organizator în legătură cu înscrierea și participarea la evenimente." },
            { term: '"Materiale"', def: "– orice suport de informare, prezentare sau instruire (inclusiv dar fără a se limita la documente, prezentări PowerPoint, fișiere PDF, materiale audio-video), furnizat de Organizator sau colaboratori în cadrul evenimentelor." },
          ].map((i) => (
            <li key={i.term} className="flex items-start gap-5">
              <span className="font-bold not-italic text-[#2D9A8F] min-w-[170px]">{i.term}</span>
              <span className="italic">{i.def}</span>
            </li>
          ))}
        </ul>

        <p className="mb-6">
          Prezentul document, intitulat Termeni și Condiții Generale de Participare, stabilește cadrul legal și reglementează în mod exclusiv, complet și obligatoriu toate condițiile aplicabile înscrierii, participării și desfășurării evenimentelor organizate de către SummitSphere SRL, societate cu răspundere limitată de naționalitate română, cu sediul social în București, Șos. Chitilei nr. 23, Sector 1, având CUI RO48728824.
        </p>

        <p className="mb-4">1.2. Prin înscrierea la oricare dintre evenimentele organizate de SummitSphere SRL, precum și prin participarea efectivă la acestea, Participantul declară că acceptă necondiționat, integral, irevocabil și fără rezerve prevederile prezentului document, care capătă valoarea juridică a unui contract bilateral, opozabil ambelor părți, producând efecte depline.</p>
        <p className="mb-4">1.3. SummitSphere SRL își rezervă dreptul absolut și discreționar de a modifica unilateral conținutul prezentului document, fără nicio obligație de notificare prealabilă către Participanți, modificările urmând a produce efecte juridice din momentul publicării noii versiuni.</p>
        <p>1.4 Întregul conținut al site-ului SummitSphere este proprietatea SummitSphere și este protejat de legislația în vigoare. Utilizarea neautorizată a materialelor poate duce la acțiuni legale.</p>
      </>
    ),
  },
  {
    title: "2. Scopul și Caracterul Evenimentelor",
    description: (
      <>
        <p className="mb-4">2.1. Evenimentele organizate de SummitSphere SRL au caracter exclusiv educațional, informativ și profesional și se adresează strict persoanelor care dețin calitatea de profesioniști, în special în domeniul sănătății sau în alte domenii profesionale compatibile cu tematica evenimentului.</p>
        <p className="mb-4">2.2. Informațiile furnizate în cadrul evenimentelor sunt oferite strict cu titlu informativ și educativ, fără a constitui sub nicio formă consultații medicale, recomandări terapeutice individualizate, indicații clinice sau alternative la deciziile medicale bazate pe expertiza practică.</p>
        <p>2.3. Organizatorul, precum și lectorii sau colaboratorii implicați, își declină expres și în mod irevocabil orice răspundere pentru orice consecințe directe sau indirecte, de orice natură, rezultate din utilizarea, aplicarea, interpretarea sau adoptarea informațiilor prezentate în cadrul evenimentului de către Participanți.</p>
      </>
    ),
  },
  {
    title: "3. Condiții de Înscriere și Participare",
    description: (
      <>
        <p className="mb-4">3.1. Participarea la eveniment este condiționată de completarea corectă și integrală a formularului de înscriere oficial pus la dispoziție de Organizator, precum și de achitarea integrală și confirmată a taxei de participare aferente evenimentului.</p>
        <p>3.2. Organizatorul își rezervă dreptul discreționar de a respinge înscrierea sau de a refuza participarea oricărei persoane care nu respectă în totalitate cerințele administrative, financiare sau comportamentale stabilite de prezentul document, fără a fi necesară motivarea deciziei.</p>
      </>
    ),
  },
  {
    title: "4. Obligațiile Participantului",
    description: (
      <>
        <p className="mb-4">4.1. Participantul are obligația de a respecta normele de conduită impuse de Organizator, regulamentele interne ale locației în care se desfășoară evenimentul, precum și standardele generale de comportament civilizat, profesional și non-discriminatoriu.</p>
        <p className="mb-4">4.2. Participantul poartă întreaga răspundere pentru orice fapte sau omisiuni care pot genera prejudicii materiale, morale, reputaționale sau de altă natură aduse Organizatorului, altor participanți sau terților.</p>
        <p>4.3. Prin participare, Participantul exonerează expres, deplin și irevocabil Organizatorul de orice răspundere juridică prezentă sau viitoare pentru orice daune, pretenții, pierderi sau consecințe directe sau indirecte legate de participarea sa la eveniment.</p>
      </>
    ),
  },
  {
    title: "5. Limitarea și Excluderea Răspunderii Organizatorului",
    description: (
      <>
        <p className="mb-4">5.1. Organizatorul nu garantează și nu se angajează în niciun mod că participarea la eveniment va conduce la obținerea de rezultate concrete, succese profesionale, creșterea veniturilor sau alte efecte benefice asupra carierei sau activității Participantului.</p>
        <p className="mb-4">5.2. Organizatorul este exonerat de orice răspundere pentru daune materiale sau morale, pierderi financiare, afectarea reputației profesionale, accidente, incidente sau alte evenimente neprevăzute apărute în legătură cu participarea la eveniment.</p>
        <p>5.3. Răspunderea totală, integrală și cumulativă a SummitSphere SRL, indiferent de natura sau originea solicitării Participantului, este în toate cazurile limitată strict și irevocabil la suma efectiv achitată de Participant cu titlu de taxă de participare.</p>
      </>
    ),
    highlight:
      "Răspunderea totală, integrală și cumulativă a SummitSphere SRL, indiferent de natura sau originea solicitării Participantului, este în toate cazurile limitată strict și irevocabil la suma efectiv achitată de Participant cu titlu de taxă de participare.",
  },
  {
    title: "6. Politica de Anulare, Modificare și Rambursare",
    description: (
      <>
        <p className="mb-4">6.1. Sumele achitate de Participant cu titlu de taxă de participare sunt considerate definitive, ferme și nerambursabile, indiferent de motivele ulterioare de neparticipare.</p>
        <p className="mb-4">6.2. În cazul în care Participantul anunță imposibilitatea de a participa cu cel puțin cinci zile lucrătoare înainte de data evenimentului, acesta are dreptul de a desemna un înlocuitor, cu condiția transmiterii unei notificări scrise și acceptării acesteia de către Organizator.</p>
        <p>6.3. Organizatorul are dreptul de a modifica, fără preaviz și fără a atrage obligații de rambursare sau despăgubire, agenda evenimentului, ordinea prezentărilor, locația, formatul de desfășurare sau lista de lectori/speakeri.</p>
      </>
    ),
  },
  {
    title: "7. Forța Majoră",
    description: (
      <>
        <p className="mb-4">7.1. Organizatorul este exonerat de orice răspundere pentru neexecutarea totală sau parțială a obligațiilor sale în caz de forță majoră, astfel cum este definită de legislația aplicabilă, incluzând dar fără a se limita la: calamități naturale, incendii, inundații, epidemii, pandemii, greve, conflicte armate, acte teroriste, întreruperi ale infrastructurii de telecomunicații sau transport, intervenții ale autorităților publice.</p>
        <p>7.2. În situația apariției unui caz de forță majoră, SummitSphere SRL are dreptul de a suspenda, reprograma sau anula evenimentul fără a datora despăgubiri sau restituiri de taxe.</p>
      </>
    ),
  },
  {
    title: "8. Prelucrarea Datelor Personale și Consimțământul pentru Utilizarea Imaginii",
    description: (
      <>
        <p className="mb-4">8.1. Prin înscriere și participare, Participantul consimte în mod expres, liber și informat la colectarea, stocarea, prelucrarea și utilizarea datelor sale personale de către Organizator și colaboratorii acestuia în scopul derulării evenimentului și al promovării ulterioare a activităților organizate de SummitSphere SRL, în conformitate cu legislația privind protecția datelor personale.</p>
        <p>8.2. Participantul autorizează Organizatorul să utilizeze în mod nelimitat și necondiționat imaginea sa, captată în fotografii sau înregistrări video realizate în cadrul evenimentelor, în scop de marketing, promovare, arhivare sau alte scopuri comerciale, fără a solicita vreo remunerație, compensație sau aprobare suplimentară.</p>
      </>
    ),
  },
  {
    title: "9. Proprietatea Intelectuală",
    description: (
      <>
        <p className="mb-4">9.1. Toate materialele, cursurile, prezentările, documentele și resursele furnizate în cadrul evenimentelor organizate de SummitSphere SRL sunt protejate de drepturile de proprietate intelectuală și sunt proprietatea exclusivă a Organizatorului sau a titularilor autorizați.</p>
        <p className="mb-4">9.2. Reproducerea, distribuirea, publicarea, adaptarea, transformarea, transmiterea, expunerea publică sau orice altă formă de utilizare a materialelor fără acordul expres, scris și prealabil al SummitSphere SRL este strict interzisă și atrage răspunderea materială și juridică a Participantului.</p>
        <p>9.3. Pentru fiecare caz de încălcare a drepturilor de proprietate intelectuală, Participantul datorează Organizatorului daune-interese într-un cuantum proporțional cu prejudiciul produs, fără a afecta dreptul Organizatorului de a solicita și alte daune suplimentare, inclusiv cheltuieli de judecată.</p>
      </>
    ),
  },
  {
    title: "10. Confidențialitate",
    description: (
      <>
        <p className="mb-4">10.1. În cadrul evenimentelor organizate de SummitSphere SRL, Participanții pot avea acces la informații tehnice, comerciale, științifice sau de altă natură, inclusiv dar fără a se limita la date, metode de lucru, concepte, planuri de afaceri, cercetări, studii de caz sau alte informații protejate ("Informații Confidențiale").</p>
        <p className="mb-4">10.2. Participantul se obligă să păstreze caracterul confidențial al tuturor Informațiilor Confidențiale la care are acces, să nu le divulge sau să le comunice terților fără consimțământul scris prealabil al Organizatorului.</p>
        <p className="mb-4">10.3. Participantul va utiliza Informațiile Confidențiale exclusiv pentru uz personal și profesional, în scopul desfășurării activităților strict legate de participarea la eveniment și nu le va exploata în interes propriu sau în interesul unor terțe părți.</p>
        <p className="mb-4">10.4. Obligațiile de confidențialitate prevăzute prin această clauză se mențin valabile pe o perioadă de cinci (5) ani de la data participării la eveniment, indiferent dacă între Organizator și Participant continuă sau nu o altă relație contractuală.</p>
        <p>10.5. În caz de încălcare a obligațiilor de confidențialitate, Participantul va răspunde integral pentru prejudiciile directe și indirecte cauzate Organizatorului, fiind dator să plătească daune-interese într-un cuantum rezonabil, fără a aduce atingere dreptului Organizatorului de a solicita despăgubiri suplimentare și cheltuieli de judecată.</p>
      </>
    ),
  },
  {
    title: "11. Excluderea de la Eveniment",
    description: (
      <>
        <p>11.1. Organizatorul își rezervă dreptul discreționar, necondiționat și imediat de a exclude de la eveniment orice Participant care încalcă prevederile prezentului document, regulamentele interne sau care aduce atingere imaginii, ordinii, siguranței sau bunei desfășurări a evenimentului, fără obligația de a restitui taxele de participare sau de a acorda alte compensații.</p>
      </>
    ),
  },
  {
    title: "12. Legea Aplicabilă și Jurisdicția",
    description: (
      <>
        <p className="mb-4">12.1. Prezentul document este guvernat în exclusivitate de legislația română, fără aplicarea regulilor privind conflictul de legi.</p>
        <p>12.2. Orice litigiu născut din sau în legătură cu interpretarea, executarea sau încetarea prezentului document va fi soluționat pe cale amiabilă, iar în lipsa unei soluții amiabile în termen de 30 de zile calendaristice, competența aparține exclusiv instanțelor judecătorești de drept comun din Municipiul București.</p>
      </>
    ),
  },
  {
    title: "13. Acceptarea Termenilor și Condițiilor",
    description: (
      <>
        <p>13.1. Prin completarea și semnarea formularului de înscriere, prin achitarea taxei de participare sau prin participarea efectivă la eveniment, Participantul declară că a citit cu atenție, a înțeles în întregime, a acceptat expres și irevocabil toate prevederile prezentului document, angajându-se să le respecte integral și fără rezerve.</p>
      </>
    ),
  },
];