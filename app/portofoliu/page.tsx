
import Portofoliu from "@/components/portofoliu/Portofoliu";
import  SectionWrapper  from "@/components/SectionWrapper";
import PointerHighlightDemo  from "@/components/portofoliu/TextSection";
import SectionTitle from "@/components/TextSection";
// import Breadcrumb from "@/components/Breadcrumb";

export default function About() {
  // const breadcrumbItems = [
  //   { name: "Acasă", href: "/" },
  //   { name: "Despre noi" },
  // ];

  return (
 <main className="min-h-screen">
  {/* <SectionWrapper fullWidth>   
   <Breadcrumb items={breadcrumbItems} />
   </SectionWrapper> */}

             
 <SectionWrapper> 
  <PointerHighlightDemo />
  </SectionWrapper>
              
                   {/* <SectionWrapper className="mt-10">
                      <SectionTitle text="Conceptul devine realitate" highlight="realitate" /> 
                   </SectionWrapper> */}

 <SectionWrapper> 

    <Portofoliu />

</SectionWrapper>

 
 </main>
  );
}