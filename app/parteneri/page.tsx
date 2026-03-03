import PointerHighlightDemo  from "@/components/parteneri/TextSection";
import Parteneriate from "@/components/parteneri/Parteneriate";
import  SectionWrapper  from "@/components/SectionWrapper";



export default function ParteneriPage() {
  return (
    <>
    <SectionWrapper> 
                 <PointerHighlightDemo />
                 </SectionWrapper>

       <SectionWrapper> 
        <Parteneriate />
      </SectionWrapper>
      
    </>
  );
}