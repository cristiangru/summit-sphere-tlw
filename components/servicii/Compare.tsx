import React from "react";
import { Compare } from "@/components/ui/compare";

export default function CompareDemo() {
  return (
    <section className="relative w-full 

      mt-5 sm:mt-20 md:mt-4 
      pt-12 md:pt-10
      pb-16 md:pb-10
      bg-white overflow-hidden"
    >
      <div className="relative z-10 w-full px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          
          {/* Containerul principal */}
          <div className="w-full md:max-w-4xl md:[perspective:1500px] flex items-center justify-center">
            <div
              className="w-full relative 
                /* Efect 3D pe desktop */
                md:[transform:rotateX(10deg)_translateZ(40px)] 
                /* Responsive Aspect Ratio */
                aspect-[4/5] sm:aspect-[4/3] md:aspect-video 
                /* Design & Border */
                p-1.5 sm:p-2 md:p-3
                bg-neutral-100 border border-neutral-200 
                rounded-2xl md:rounded-[2rem] 
                shadow-2xl shadow-black/10"
            >
              <div className="w-full h-full overflow-hidden rounded-xl md:rounded-[1.2rem] bg-white">
                <Compare
                  firstImage="/img/compare/1.png"
                  secondImage="https://assets.aceternity.com/linear-dark.png"
                  firstImageClassName="object-cover w-full h-full"
                  secondImageClassname="object-cover w-full h-full"
                  className="w-full h-full"
                  slideMode="hover"
                />
              </div>

              {/* Umbra de sub card */}
              <div className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/5 blur-3xl rounded-[100%]" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}