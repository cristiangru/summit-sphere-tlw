
import News from "@/components/blog/News";
import  SectionWrapper  from "@/components/SectionWrapper";
import PointerHighlightDemo  from "@/components/blog/TextSection";
// import Breadcrumb from "@/components/Breadcrumb";

export default function Blog() {
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
              

 <SectionWrapper> 

    <News />

</SectionWrapper>

 
 </main>
  );
}