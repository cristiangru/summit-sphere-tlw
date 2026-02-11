
import Services from '@/components/servicii/Services';
import PointerHighlightDemo  from "@/components/servicii/TextSection";
import Compare from '@/components/servicii/Compare';
import  SectionWrapper  from "@/components/SectionWrapper";
import SectionTitle from "@/components/TextSection";

export default function ServicesPage() {
  // const breadcrumbItems = [
  //   { name: "Acasă", href: "/" },
  //   { name: "Despre noi" },
  // ];

  return (
 <main className="min-h-screen">
  {/* <SectionWrapper fullWidth>   
   <Breadcrumb items={breadcrumbItems} />
   </SectionWrapper> */}

             
            
              <PointerHighlightDemo /> 





    <Compare />






   <SectionWrapper>
<SectionTitle text="Serviciile noastre" highlight="noastre" />
      </SectionWrapper>

 <SectionWrapper> 

    <Services />

</SectionWrapper>


 </main>
  );
}