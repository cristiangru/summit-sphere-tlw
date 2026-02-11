"use client";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScrollDemo() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-full min-h-[100dvh] bg-white dark:bg-black py-0">
      <ContainerScroll
        titleComponent={
          <div className="mb-2 sm:mb-20 px-4"> 
 <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white leading-[1.2] sm:leading-tight">
  Conectăm oameni <br className="hidden sm:block" />
  <span className="text-2xl sm:text-5xl font-bold mt-4 block text-black dark:text-white leading-[1.4] sm:leading-tight">
    Inspirăm soluții pentru un <br className="block sm:hidden" /> 
    viitor mai <span className="text-[#2D9A8F] inline-block mt-1 sm:mt-0">sănătos</span>
  </span>
</h1>
          </div>
        }
      >
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src="/images/6.png"
            alt="hero"
            width={1200}
            height={720}
            className="mx-auto rounded-2xl object-cover 
              /* Pe mobil forțăm imaginea să fie uriașă și să ignore perspectiva mică */
              h-[60vh] sm:h-full 
              w-[140%] sm:w-full 
              max-w-none sm:max-w-full
              scale-[1.5] sm:scale-100 
              translate-y-[10%] sm:translate-y-0
              object-center"
            draggable={false}
            priority
          />
        </div>
      </ContainerScroll>
    </div>
  );
}