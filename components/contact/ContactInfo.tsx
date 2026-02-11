"use client";
import ContactForm from "@/components/contact/ContactForm";
import { PinContainer } from "@/components/ui/3d-pin";
import { IconMapPin, IconPhone, IconMail } from "@tabler/icons-react";

const contactInfo = [
  {
    icon: IconMapPin,
    title: "Locație",
    content: "Șoseaua Chitilei nr. 23, București",
  },
  {
    icon: IconPhone,
    title: "Telefon",
    content: "0764 507 330",
  },
  {
    icon: IconMail,
    title: "Email",
    content: "office@summitsphere.ro",
  },
];

export default function ContactPage() {
  return (
    // MODIFICARE: Adăugat pt-32 pentru a coborî tot conținutul sub Navbar
    <div className="relative   overflow-hidden pt-5 pb-10">
      
      {/* Background Decor subtil pentru a umple spațiul creat */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2D9A8F]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* MODIFICARE: Adăugat un Header pentru pagină ca să nu înceapă direct cu grid-ul */}


        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-12">
          
          {/* Left Side - 3D Pins */}
          <div className="lg:col-span-5 space-y-12 py-10">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className="h-[12rem] flex items-center justify-center"
                >
                  <PinContainer title={info.title}>
                    <div className="flex basis-[20rem] flex-col p-4 tracking-tight text-slate-100/50 sm:basis-[25rem] w-[20rem] h-[8rem]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <IconComponent className="w-6 h-6 text-[#2D9A8F]" />
                        </div>
                        <h3 className="max-w-xs !m-0 font-bold text-base text-slate-100">
                          {info.title}
                        </h3>
                      </div>

                      <div className="flex flex-1 w-full rounded-lg mt-4 bg-black items-center p-4">
                        <span className="text-white">{info.content}</span>
                      </div>
                    </div>
                  </PinContainer>
                </div>
              );
            })}
          </div>

          {/* Right Side - Formularul mutat mai jos prin py-10 */}
          <div className="lg:col-span-7 py-10">
            <div className="relative group">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}