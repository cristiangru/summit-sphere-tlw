"use client";

import PointerHighlightDemo  from "@/components/contact/TextSection";
import SectionTitle from "@/components/TextSection";
import ContactInfo from "@/components/contact/ContactInfo";
import  SectionWrapper  from "@/components/SectionWrapper";
import MapSection from "@/components/contact/Map";


export default function ContactPage() {
  return (
    <>


        <SectionWrapper> 
              <PointerHighlightDemo />
              </SectionWrapper>

       <SectionWrapper> 
        <ContactInfo />
      </SectionWrapper>

         <SectionTitle text="Locația noastră" highlight="noastră" />
            
   
      <MapSection />
         
    </>
  );
}