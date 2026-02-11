"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";

const servicesData = {
  "conferinte-medicale": {
    title: "Organizare Conferințe Medicale",
    shortDescription:
      "Organizare Conferințe Medicale ",
    color: "from-blue-500 to-cyan-500",
    introduction: {
      content: [
        "Într-un domeniu atât de complex și de important precum cel medical, succesul unui eveniment nu se măsoară doar în numărul de participanți sau în frumusețea locației, ci în capacitatea de a crea contexte reale pentru schimb de cunoștințe, dezvoltare profesională și colaborare autentică. La SummitSphere, înțelegem profund responsabilitatea pe care o presupune organizarea unei conferințe medicale și abordăm fiecare proiect cu profesionalism, viziune strategică și respect total pentru valorile domeniului sănătății.",
        "Fiecare conferință organizată de noi este tratată ca un proiect unic, construit în jurul nevoilor, obiectivelor și așteptărilor clientului. Pornim de la o planificare atentă, strategică, în care definim împreună tematica, structura sesiunilor, profilul participanților și identitatea evenimentului. Fiecare detaliu, de la selecția și coordonarea speakerilor, la organizarea logistică și promovarea către publicul țintă, este realizat cu o rigoare care reflectă standardele înalte ale industriei medicale.",
        "Experiența noastră vastă ne permite să gestionăm întregul flux operațional, de la alegerea locației potrivite, asigurarea dotărilor tehnice de ultimă generație, până la coordonarea activităților în ziua evenimentului și gestionarea feedback-ului ulterior. Ne ocupăm de procesul complet de înscriere a participanților, de gestionarea acreditărilor necesare, de emiterea diplomelor de participare și, atunci când este cazul, de coordonarea procedurilor pentru obținerea creditelor EMC sau EFC.",
        "Mai mult decât atât, la SummitSphere oferim soluții integrate de comunicare și marketing, adaptate specificului fiecărui eveniment. Prin campanii targetate, materiale vizuale profesioniste și strategii de promovare adaptate mediului medical, contribuim la creșterea vizibilității și a impactului conferințelor pe care le organizăm.",
        "O componentă esențială a activității noastre este respectarea deplină a tuturor normelor etice și de conformitate: protecția datelor personale (GDPR), reglementările Colegiilor profesionale, ale autorităților de acreditare și respectarea protocoalelor industriei medicale. Toate aceste standarde sunt integrate organic în fiecare proiect, fără compromisuri.",
        "La SummitSphere, nu ne limităm la a livra servicii operaționale. Construim parteneriate reale, în care ne implicăm activ în atingerea obiectivelor clienților noștri. Punem accent pe inovație, pe adaptabilitate și pe găsirea celor mai bune soluții pentru ca fiecare conferință să devină nu doar un eveniment organizat cu succes, ci o referință memorabilă în cariera și parcursul profesional al participanților.",
        "Alegând SummitSphere pentru organizarea conferinței tale medicale, alegi siguranța unei echipe cu expertiză solidă, care înțelege exigențele comunității medicale și livrează evenimente la cele mai înalte standarde de calitate. Alegi un partener de încredere care îți respectă misiunea și îți amplifică impactul în comunitate.",
        "SummitSphere – pentru că viitorul sănătății se construiește prin evenimente care contează!",
      ],
    },
  },
  "promovare-evenimente-medicale": {
    title: "Promovare și Marketing",
    shortDescription:
      "Promovare și Marketing pentru Evenimente Medicale",
    color: "from-purple-500 to-pink-500",
    introduction: {
      content: [
        "Promovarea eficientă a unui eveniment medical nu înseamnă doar prezență vizibilă, ci transmiterea unui mesaj clar, profesionist și adaptat publicului-țintă. La SummitSphere, înțelegem specificitatea comunicării în domeniul medical și dezvoltăm campanii de promovare integrate, care maximizează impactul și atrag participanți relevanți.",
        "Ne concentrăm pe construirea unor strategii personalizate, adaptate profilului evenimentului, tematicii abordate și obiectivelor stabilite. Utilizăm canale variate – de la platforme online specializate în sănătate, social media profesională, newslettere dedicate comunității medicale, până la colaborări cu parteneri instituționali și societăți profesionale.",
        "Fiecare campanie este susținută de materiale de comunicare concepute cu atenție, de la invitații și afișe digitale până la conținut editorial specializat și campanii de e-mail marketing personalizat. Analizăm constant rezultatele și optimizăm în timp real strategiile pentru a asigura o rată ridicată de conversie și participare.",
        "Obiectivul nostru nu este doar creșterea vizibilității, ci atragerea acelor participanți care adaugă valoare evenimentului: profesioniști autentici, lideri de opinie, specialiști interesați să dezvolte comunitatea medicală.",
        "Prin promovare strategică și execuție impecabilă, la SummitSphere ne asigurăm că fiecare eveniment organizat de noi are nu doar audiență, ci și relevanță și impact.",
        "SummitSphere – fiecare campanie de promovare este construită strategic pentru a crea nu doar vizibilitate, ci și relevanță, generând conexiuni autentice între profesioniști și consolidând prestigiul evenimentului în comunitatea medicală.",
      ],
    },
  },
  "workshop-uri-seminarii": {
    title: "Workshop-uri și Seminarii",
    shortDescription: "Workshop-uri și Seminarii Medicale",
    color: "from-pink-500 to-rose-500",
    introduction: {
      content: [
        "Într-o lume în continuă transformare, unde noile descoperiri din domeniul medical apar într-un ritm accelerat, organizarea de workshop-uri și seminarii devine esențială pentru formarea continuă și consolidarea cunoștințelor profesioniștilor din sănătate. La SummitSphere, concepem workshop-uri și seminarii interactive care nu doar transmit informație, ci creează contexte reale pentru schimb de experiență, dezbatere aplicată și colaborare interdisciplinară.",
        "Fiecare program este construit în jurul celor mai actuale teme de interes medical, fiind adaptat nivelului de expertiză al participanților și obiectivelor educaționale propuse. Punem accent pe aplicabilitate practică, studiile de caz, simulările și dezbaterile dinamice, oferind astfel un cadru ideal pentru dezvoltarea abilităților și schimbul de idei între specialiști.",
        "În organizarea acestor evenimente, colaborăm strâns cu lectori recunoscuți în domeniu, experți în cercetare clinică și practicieni cu experiență reală, pentru a asigura o experiență de înaltă valoare științifică și profesională. De la selecția temelor și elaborarea agendelor, până la logistica completă și suportul tehnic, fiecare detaliu este gestionat cu rigurozitate și dedicare.",
        "Scopul nostru este să creăm evenimente care să inspire, să provoace gândirea critică și să stimuleze colaborarea profesională. Prin atmosfera interactivă și abordarea aplicată, workshop-urile și seminariile SummitSphere devin adevărate catalizatoare pentru evoluția profesională a participanților.",
        "La finalul fiecărui workshop sau seminar, participanții nu doar acumulează cunoștințe, ci pleacă cu idei aplicabile, conexiuni valoroase și motivația de a contribui activ la schimbarea pozitivă în domeniul sănătății.",
        "SummitSphere – unde educația medicală devine experiență vie și inspirație pentru progres!",
      ],
    },
  },
  "networking-medical": {
    title: "Evenimente de Networking",
    shortDescription: "Evenimente de Networking",
    color: "from-indigo-500 to-blue-500",
    introduction: {
      content: [
        "Într-un ecosistem profesional dinamic, în care conexiunile autentice accelerează inovația și colaborarea, evenimentele de networking au devenit o componentă esențială în cadrul conferințelor și workshop-urilor medicale.",
        "La SummitSphere, nu lăsăm socializarea profesională la întâmplare – o planificăm strategic, creând oportunități reale de interacțiune și consolidare a relațiilor între participanți.",
        "Organizăm sesiuni de networking structurat, întâlniri individuale sau de grup, activități sociale tematice și contexte relaxate care facilitează discuții relevante și valoroase.",
        "Fiecare moment de interacțiune este gândit pentru a sprijini schimbul de idei, transferul de cunoștințe și crearea de parteneriate durabile în domeniul sănătății.",
        "Prin integrarea inteligentă a momentelor de networking în agenda evenimentelor, încurajăm dezvoltarea rețelelor profesionale, deschiderea către noi colaborări și consolidarea comunităților de practică. Participanții nu doar împart informații, ci construiesc relații care pot duce la proiecte comune, cercetări colaborative sau noi inițiative profesionale.",
        "Punem accent pe crearea unui mediu propice relaționării, în care schimburile de idei să fie naturale și valoroase, iar barierele tradiționale de comunicare să fie eliminate. Prin design-ul evenimentelor noastre, networkingul nu este un simplu moment de pauză, ci devine un instrument strategic de dezvoltare profesională și de creștere a impactului comunității medicale.",
        "SummitSphere - credem că relațiile construite la un eveniment de networking bine organizat pot schimba parcursuri profesionale și pot deschide oportunități remarcabile pentru viitorul sănătății.",
      ],
    },
  },
  "simpozioane-medicale": {
    title: "simpozioane Medicale",
    shortDescription: " Simpozioane Medicale",
    color: "from-orange-500 to-amber-500",
    introduction: {
      content: [
        "Organizarea unui simpozion medical reprezintă o provocare complexă ce implică mult mai mult decât gestionarea logisticii. Este vorba despre crearea unui spațiu autentic de dezbatere științifică, de schimb academic valoros și de prezentare a celor mai noi descoperiri din domeniul sănătății.",
        "La SummitSphere, punem la dispoziție expertiza necesară pentru a transforma fiecare simpozion într-un eveniment de referință în comunitatea profesională. Înțelegem că succesul unui simpozion constă în calitatea conținutului științific, în rigurozitatea organizatorică și în atmosfera de colaborare între participanți.",
        "De la stabilirea conceptului și selecția tematicilor de actualitate, până la managementul lectorilor, logistică de ultimă generație și promovare strategică, oferim servicii complete, adaptate standardelor din domeniul medical și academic. Ne ocupăm de toate aspectele tehnice esențiale – sonorizare, videoproiecție, sisteme de înregistrare profesională – pentru a asigura o desfășurare impecabilă a fiecărei sesiuni.",
        "În același timp, sprijinim vizibilitatea evenimentului prin campanii de comunicare dedicate, atrăgând un public țintă format din specialiști, cercetători și lideri de opinie din sănătate. Toate aceste elemente sunt gândite într-o abordare unitară, care pune accent pe excelență științifică, profesionalism organizatoric și impact pe termen lung.",
        "Organizarea unui simpozion medical cu SummitSphere înseamnă garanția unui eveniment desfășurat la cele mai înalte standarde, cu respectarea deplină a normelor etice, a principiilor de confidențialitate și a standardelor internaționale de calitate în domeniul conferințelor științifice.",
        "SummitSphere – pentru simpozioane medicale care nu doar informează, ci formează și inspiră viitorul sănătății!",
      ],
    },
  },
  "consultanta-evenimente-medicale": {
    title: "Servicii de Consultanță",
    shortDescription:
      "Servicii de Consultanță pentru Organizarea Evenimentelor Medicale",
    color: "from-teal-500 to-emerald-500",
    introduction: {
      content: [
        "În organizarea evenimentelor medicale de înalt nivel, succesul nu este niciodată rezultatul întâmplării, ci al unei strategii bine construite, a unei structuri operaționale clare și a unei comunicări eficiente.",
        "La SummitSphere, punem la dispoziția clienților noștri expertiza acumulată din organizarea și coordonarea unor proiecte complexe din domeniul sănătății, oferind servicii de consultanță complete și personalizate.",
        "Oferim suport de la primele etape ale conceptului, ajutând la definirea obiectivelor strategice ale evenimentului și la stabilirea celor mai eficiente modalități de atingere a acestora. Fiecare proiect este abordat individual, adaptat specificului publicului țintă, tematicii științifice și standardelor industriei medicale.",
        "Consultanța noastră acoperă toate dimensiunile unui eveniment de succes: de la structurarea programului științific și selecția lectorilor potriviți, până la construirea unei identități vizuale coerente, elaborarea unui plan de promovare specializat și alegerea celor mai potrivite soluții logistice și tehnice.",
        "În plus, sprijinim clienții în procesul de obținere a acreditărilor necesare (EMC, EFC) și în respectarea normelor de etică și confidențialitate aplicabile evenimentelor medicale.",
        "Abordăm fiecare colaborare nu ca pe o simplă furnizare de servicii, ci ca pe un parteneriat strategic, în care succesul clientului devine obiectivul nostru central. Ne implicăm activ în toate fazele implementării, oferind recomandări adaptate realității din teren și sprijin constant pentru optimizarea fiecărui aspect al evenimentului.",
        "Prin soluții eficiente, personalizate și bazate pe cele mai bune practici din domeniu, SummitSphere transformă provocările organizării evenimentelor medicale în oportunități de excelență și impact.",
        "SummitSphere – partenerul tău strategic pentru evenimente medicale care inspiră, conectează și transformă!",
      ],
    },
  },
  "evenimente-online-medicale": {
    title: "Gestionare Evenimente Online",
    shortDescription: "Gestionare Evenimente Online",
    color: "from-cyan-500 to-sky-500",
    introduction: {
      content: [
        "Transformările rapide din era digitală au schimbat fundamental modul în care comunitățile profesionale interacționează, învață și colaborează.",
        "În acest context, organizarea și gestionarea evenimentelor medicale online a devenit o soluție indispensabilă pentru menținerea schimbului de cunoștințe la cel mai înalt nivel, indiferent de distanțe geografice.",
        "La SummitSphere, oferim soluții complete și personalizate pentru organizarea de conferințe, simpozioane, workshop-uri și seminarii în format virtual sau hibrid, adaptate rigorilor și exigențelor domeniului medical.",
        "Ne ocupăm de toate aspectele tehnice și operaționale, de la selecția platformelor digitale potrivite (Zoom, Teams, Webex, platforme customizate) până la suportul logistic pentru difuzarea live, înregistrarea sesiunilor, gestionarea interacțiunii cu publicul și asigurarea unei experiențe fluide pentru toți participanții.",
        "Punem accent pe securitatea datelor, calitatea transmisiunii și protecția informațiilor științifice, respectând standardele internaționale de confidențialitate și reglementările GDPR aplicabile în domeniul medical.",
        "Fiecare eveniment online este conceput pentru a menține implicarea și atenția participanților, prin utilizarea unor funcționalități avansate de Q&A, sondaje live, sesiuni de networking virtual, camere de lucru în grup și zone expoziționale digitale.",
        "De asemenea, sprijinim clienții noștri în procesul de înregistrare a participanților, emiterea diplomelor de participare electronice și realizarea rapoartelor de evaluare post-eveniment.",
        "Prin gestionarea profesională a evenimentelor online, la SummitSphere creăm punți de comunicare eficiente între specialiștii din domeniul sănătății, susținând formarea continuă și colaborarea fără bariere de timp sau spațiu.",
        "SummitSphere - partenerul tău pentru evenimente medicale online care păstrează excelența, indiferent de distanță!",
      ],
    },
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const service = useMemo(() => {
    const cleanSlug = slug?.replace(/^\//, "");
    return servicesData[cleanSlug as keyof typeof servicesData];
  }, [slug]);

  if (!service) return null;

  const paragraphs = service.introduction.content;
  const flowPoints = paragraphs.slice(0, paragraphs.length - 1);
  const lastPoint = paragraphs[paragraphs.length - 1];

  return (
    <div className="relative min-h-screen bg-slate-50 py-20 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#2D9A8F]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Restrângem containerul la max-w-6xl pentru un look mai compact */}
      <div className="max-w-7xl mx-auto mt-8 relative z-10">
        
        {/* HERO HEADER - CENTRAT */}
        <header className="relative z-10 mb-20  mt-20 text-center mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight ">
            {service.shortDescription.split("–")[0]}
            <span className="block mt-2 bg-clip-text text-[#2D9A8F] italic  font-medium">
              {service.shortDescription.split("–")[1]}
            </span>
          </h1>
          <div className="mt-6 h-1 w-20 bg-[#2D9A8F]/20 mx-auto rounded-full" />
        </header>

        {/* GRID CONTAINER - Gap redus la 12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Accent Card - Mai îngust și compact */}
          <aside className="lg:col-span-5 lg:sticky lg:top-40 self-start z-40"> 
            <div className="relative group overflow-hidden rounded-[2rem] bg-slate-900 p-8 shadow-xl border border-white/5">
              <Meteors number={15} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[#2D9A8F] text-4xl font-black opacity-30 italic leading-none uppercase tracking-tighter"> 
                    Viziune 
                  </h3>
                  <Compass className="w-10 h-10 text-[#2D9A8F] opacity-20 transform -rotate-12" />
                </div>
                
                <p className="text-lg text-slate-200 leading-relaxed font-light italic text-justify opacity-90">
                  "{lastPoint}"
                </p>
                
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#2D9A8F]/50 to-transparent" />
                  <span className="text-[#2D9A8F] font-mono text-[10px] tracking-widest uppercase">SummitSphere</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Detailed Flow - Spațiere redusă între puncte */}
          <div className="lg:col-span-7 space-y-12 lg:pt-4">
            {flowPoints.map((text: string, idx: number) => (
              <div key={idx} className="relative pl-10 group transition-all duration-300">
                {/* Connector Line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-hover:bg-[#2D9A8F]/30 transition-colors" />
                
                {/* Glow Bullet */}
                <div className="absolute -left-[3px] top-2 h-[7px] w-[7px] rounded-full bg-slate-300 group-hover:bg-[#2D9A8F] transition-all" />
                
                <div className="space-y-3">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-[#2D9A8F]/30 transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed text-justify group-hover:text-slate-900 transition-colors">
                    {text}
                  </p>
                </div>
              </div>
            ))}

            {/* FINAL MINIMALIST SECTION - Mai compactă */}
            <div className="relative mt-20 pt-12 border-t border-slate-200/60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <h2 className="text-xl md:text-2xl font-light text-slate-800 text-center sm:text-left">
                  Pregătit pentru <span className="font-bold text-[#2D9A8F]">excelență?</span>
                </h2>

                <Link href="/contact" className="group">
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 group-hover:text-[#2D9A8F] transition-colors">
                      Contact
                    </span>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 group-hover:border-[#2D9A8F] group-hover:bg-[#2D9A8F] transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}