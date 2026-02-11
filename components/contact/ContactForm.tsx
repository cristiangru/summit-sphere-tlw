"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function ContactFormDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Form data:", formData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* MODIFICĂRI: 
       - max-w-xl (mai lat)
       - border border-slate-200 / dark:border-white/10
       - p-12 (mai mult spațiu interior)
    */
    <div className="shadow-2xl mx-auto w-full max-w-xl rounded-[2.5rem] bg-white p-8 md:p-12 border border-slate-200 dark:border-white/10 dark:bg-black relative overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight text-center mb-5">
        Solicită o programare
      </h2>

      <form className="my-10 mt-15" onSubmit={handleSubmit}>
        {/* Nume și Prenume - Rămân neschimbate */}
        <div className="mb-10 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">Nume</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Popescu"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Prenume</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Ion"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        {/* Email și Telefon pe același rând */}
        <div className="mb-10 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <LabelInputContainer>
            <Label htmlFor="email">Email </Label>
            <Input
              id="email"
              name="email"
              placeholder="ion@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+40 728909983"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        {/* Mesaj - Acum vine imediat sub ele */}
        <LabelInputContainer className="mb-10">
          <Label htmlFor="message">Detalii eveniment / Mesaj</Label>
          <textarea
            id="message"
            name="message"
            placeholder="Spune-ne cum te putem ajuta"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="flex w-full rounded-md border-none bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm text-black dark:text-white transition duration-400 focus:outline-none focus:ring-2 focus:ring-[#2D9A8F] dark:shadow-[0px_0px_1px_1px_#404040]"
          />
        </LabelInputContainer>

        <div className="mb-10 flex items-start space-x-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleChange}
            required
            className="mt-1 h-5 w-5 rounded border-neutral-300 text-[#2D9A8F] focus:ring-[#2D9A8F] cursor-pointer"
          />
          <label
            htmlFor="consent"
            className="text-sm text-neutral-600 dark:text-neutral-400 leading-snug cursor-pointer"
          >
            Sunt de acord cu prelucrarea datelor cu caracter personal conform
            politicilor SummitSphere.
          </label>
        </div>

        <button
          className="group/btn relative block h-12 w-full rounded-xl bg-slate-900 dark:bg-[#2D9A8F] font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(45,154,143,0.4)] disabled:opacity-50"
          type="submit"
          disabled={loading || !formData.consent}
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? "Se trimite..." : "Trimite Solicitarea"}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </div>
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-[#2D9A8F] opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-[#2D9A8F] opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
