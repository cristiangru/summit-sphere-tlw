
import  SectionWrapper  from "@/components/SectionWrapper";
import Services from "@/components/home/Services";
import HeroScroll from "@/components/home/HeroScroll";
import SectionTitle from "@/components/TextSection";
import Excelenta from "@/components/home/Excelenta";
// import Cta from "@/components/home/Cta";
import BestMember from "@/components/home/BestMember";
import OurValue from "@/components/home/OurValue";
import FQA from "@/components/home/FQA";
import RecentArticles from "@/components/home/RecentArticles";

export default function Home() {
  return (
    <main>


      <SectionWrapper fullWidth>
        <HeroScroll />
      </SectionWrapper>


      <SectionWrapper>
<SectionTitle text="Serviciile noastre" highlight="noastre" />
      </SectionWrapper>

      <SectionWrapper>
        <Services />
      </SectionWrapper>

 
<SectionTitle text="Valorile noastre" highlight="noastre" />

   <SectionWrapper fullWidth>
        <OurValue />
              </SectionWrapper>

                   
                   
                   
                   <SectionWrapper>

 
<SectionTitle text="Excelență medicală" highlight="medicală" />
      </SectionWrapper>
         <SectionWrapper fullWidth>
        <Excelenta />
      </SectionWrapper> 



   <SectionWrapper>
<SectionTitle text="Best team member" highlight="member" />
      </SectionWrapper>
         <SectionWrapper fullWidth>
        <BestMember />
      </SectionWrapper>



      <SectionWrapper>
<SectionTitle text="Articolele noastre" highlight="noastre" />
      </SectionWrapper>
          <SectionWrapper>
        <RecentArticles />
              </SectionWrapper>



                    <SectionWrapper>
<SectionTitle text="Întrebări frecvente" highlight="frecvente" />
      </SectionWrapper>
<SectionWrapper fullWidth>
  <FQA />
</SectionWrapper>


    </main>
  );
}