import { PointerHighlight } from "@/components/ui/pointer-highlight";

export default function PointerHighlightDemo() {
  return (
   <div className="pt-24 md:pt-32 lg:pt-32 pb-2">
  <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
   <h2
  className="
    mx-auto max-w-3xl px-5 sm:px-6 md:px-8
    text-2xl sm:text-3xl md:text-4xl lg:text-4xl
    font-bold tracking-tight text-black dark:text-white
    leading-tight
    text-center
  "
>
  <div>Descoperă. Inspiră.</div>
  <div className="mt-3 sm:mt-4 flex justify-center">
    <PointerHighlight>
      <span className="inline align-baseline">Conectează</span>
    </PointerHighlight>
  </div>
</h2>
  </div>
</div>
  );
}