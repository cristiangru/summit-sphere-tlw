"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Acasă", href: "/" },
    { name: "Despre noi", href: "/despre-noi" },
    { name: "Servicii", href: "/servicii" },
    { name: "Portofoliu", href: "/portofoliu" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Termeni și Condiții", href: "/termeni-si-conditii" },
    { name: "Politica de Cookies", href: "/politica-de-cookies" },
    {
      name: "Politica de Confidențialitate",
      href: "/politica-de-confidentialitate",
    },
  ];

  const regulatoryLinks = [
    { name: "ANPC", href: "https://anpc.ro/" },
    { name: "SAL", href: "/sal" },
    { name: "SOL", href: "https://ec.europa.eu/consumers/odr" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/summit.sphere/",
      label: "Instagram",
    },
    { icon: Mail, href: "mailto:office@summitsphere.ro", label: "Email" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      {/* Container principal - Am schimbat py-12/20 în pt (sus) și pb (jos mai mic) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 lg:gap-8 mb-10">
          {/* Col 1 - Brand */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/img/logo.png"
                alt="SummitSphere Logo"
                width={48}
                height={48}
              />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                SummitSphere
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs text-center sm:text-left">
              "Atingând noi culmi împreună: Explorează, învață și conectează-te"
            </p>
            <div className="flex gap-2 justify-center sm:justify-start">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:from-[#06b6d4] to-[#2D9A8F] dark:hover:bg-emerald-900/30 transition-colors duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <social.icon className="h-5 w-5 text-neutral-700 dark:text-neutral-300 hover:text-[#2d9b92]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Link-uri rapide
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-center sm:text-left">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#2d9b92] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Legal */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-center sm:text-left">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#2d9b92] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-2 justify-center sm:justify-start">
              {regulatoryLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[10px] text-neutral-600 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded hover:bg-neutral-100 font-bold uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 - Contact */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Contact
            </h3>
            <div className="space-y-4 w-full flex flex-col items-center sm:items-start">
              {/* Email */}
              <a
                href="mailto:contact@summitsphere.ro"
                className="flex items-center sm:items-start gap-3 group text-center sm:text-left"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#2d9b92] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">
                    Email
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-[#2d9b92]break-all">
                 office@summitsphere.ro
                  </p>
                </div>
              </a>

              {/* Telefon */}
              <a
                href="tel:+40721234567"
                className="flex items-center sm:items-start gap-3 group text-center sm:text-left"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#2d9b92] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">
                    Telefon
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-[#2d9b92]">
                    +40 721 234 567
                  </p>
                </div>
              </a>

              {/* Adresă */}
              <div className="flex items-center sm:items-start gap-3 text-center sm:text-left">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#2d9b92] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">
                    Locație
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-tight">
                    Șoseaua Chitilei nr. 23,
                    <br /> Sector 1, București
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider - Am scăzut marginile (my-6 în loc de my-12) */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>

        {/* Bottom Section - Spațiu foarte mic acum sub Powered By */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
            © {currentYear}{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">
              SummitSphere
            </span>
            . Toate drepturile rezervate.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 mx-auto sm:mx-0">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Powered by
            </span>
            <LinkPreview
              url="https://www.nextdev.ro/"
              isStatic={true} // ← asta
              imageSrc="/preview-nextdev.png" // ← și asta (vezi pasul 2)
              className="text-xs sm:text-sm font-bold  text-[#2d9b92]"
            >
              NextDev
            </LinkPreview>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
