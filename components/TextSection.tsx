
"use client";


import { PointerHighlight } from "@/components/ui/pointer-highlight";

interface SectionTitleProps {
  text: string;
  highlight?: string;
  
}

export default function SectionTitle({ text, highlight }: SectionTitleProps) {
  // Dacă nu există highlight sau nu se găsește în text, afișăm titlul normal
  if (!highlight || !text.toLowerCase().includes(highlight.toLowerCase())) {
    return (
      <h2 className="text-4xl  sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black text-center py-12 md:py-16 lg:py-20 whitespace-pre-wrap">
        {text}
      </h2>
    );
  }

  // Regex pentru highlight (sigur pentru caractere speciale)
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
   <h2 className="text-2xl mt-10 sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-black text-center pt-24 md:pt-32 lg:pt-25 pb-16 whitespace-pre-wrap break-words">
  {parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} className="inline-block">
        <PointerHighlight>{part}</PointerHighlight>
      </span>
    ) : (
      <span key={index} className="inline">
        {part}
      </span>
    )
  )}
</h2>
  );
}
