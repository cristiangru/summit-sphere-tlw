
import  About  from "@/components/about/About";


import  Owner  from "@/components/about/Owner";
import Value from "@/components/about/Value";
import SectionTitle from "@/components/TextSection";
import  SectionWrapper  from "@/components/SectionWrapper";
import PointerHighlightDemo  from "@/components/about/TextSection";
// import Breadcrumb from "@/components/Breadcrumb";

export default function AboutPage() {
  // const breadcrumbItems = [
  //   { name: "Acasă", href: "/" },
  //   { name: "Despre noi" },
  // ];

  return (
 <main>
  {/* <SectionWrapper fullWidth>   
   <Breadcrumb items={breadcrumbItems} />
   </SectionWrapper> */}




  <PointerHighlightDemo /> 


 <SectionWrapper> 
              <About />
</SectionWrapper>


     <SectionWrapper>
        <SectionTitle text="Angajamentul nostru față de Educația Continuă" highlight="Educația Continuă" /> 
     </SectionWrapper>

           


     <SectionWrapper>
        <Value />
      </SectionWrapper>

       <SectionWrapper>
        <SectionTitle text="Mintea din spatele SummitSphere" highlight="SummitSphere" /> 
     </SectionWrapper>
      <SectionWrapper>
        <Owner />
      </SectionWrapper>


 </main>
  );
}