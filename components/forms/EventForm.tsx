// src/components/forms/EventForm.tsx (COMPLETE FIXED)
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle,
  ChevronRight,
  User,
  Building2,
  ArrowLeft,
  AlertCircle,
  Home,
  ChevronDown,
  Info,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import {
  participantRegistrationSchema,
  SPECIALIZARE_OPTIONS,
  type ParticipantRegistration,
} from "@/lib/validations/index";
import { submitParticipantRegistration } from "@/src/server/actions/participants";

export default function EventForm({
  eventId,
  eventTitle = "Evenimentul",
}: {
  eventId: string;
  eventTitle?: string;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ParticipantRegistration>({
    resolver: zodResolver(participantRegistrationSchema) as any,
    mode: "onChange",
    defaultValues: {
      eventId: eventId,
      tipParticipant: "Fizica",
      gender: undefined,
      nume: "",
      prenume: "",
      email: "",
      telefon: "",
      specializare: undefined,
      specializare_custom: "",
      politica_confidentialitate: false,
      termeni_conditii: false,
      marketing_consent: false,
      acord_foto_video: false,
      informare_natura_eveniment: false,
      recaptchaToken: "",
      cnp: "",
      adresaPF: "",
      denumireSocietate: "",
      cui: "",
      banca: "",
      sediuSocial: "",
      registrulComertului: "",
      persoanadeContact: "",
    },
  });

  const tipParticipant = watch("tipParticipant");
  const selectedSpecializare = watch("specializare");

  const watchedCnp = watch("cnp");
  const watchedCui = watch("cui");
  const watchedregistrulComertului = watch("registrulComertului");
  const watchedIban = watch("banca");

  useEffect(() => {
    if (watchedregistrulComertului && watchedregistrulComertului.length > 0)
      trigger("registrulComertului");
  }, [watchedregistrulComertului, trigger]);

  useEffect(() => {
    if (watchedCnp && watchedCnp.length > 0) trigger("cnp");
  }, [watchedCnp, trigger]);

  useEffect(() => {
    if (watchedCui && watchedCui.length > 0) trigger("cui");
  }, [watchedCui, trigger]);

  useEffect(() => {
    if (watchedIban && watchedIban.length > 0) trigger("banca");
  }, [watchedIban, trigger]);


useEffect(() => {
  if (isSuccess) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [isSuccess]);

  const handleNext = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ["tipParticipant"];
    if (step === 2)
      fields = [
        "gender",
        "prenume",
        "nume",
        "email",
        "telefon",
        "specializare",
      ];

    const isStepValid = await trigger(fields);
    if (isStepValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: ParticipantRegistration) => {
    const isFinalValid = await trigger();
    if (!isFinalValid) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitParticipantRegistration(data);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setServerError(res.error || "Eroare la procesarea datelor.");
      }
    } catch (e) {
      setServerError("Eroare de conexiune cu serverul.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess)
    return (
      <SuccessView
        onReset={() => {
          setIsSuccess(false);
          setStep(1);
          reset();
        }}
      />
    );

  return (
<div className="min-h-screen font-sans selection:bg-[#2D9A8F] selection:text-white mt-20 md:mt-30">
  <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 relative z-10">
    {/* Border fix, proeminent (2px) cu culoarea ta de brand, fără efecte de hover */}
    <div className="bg-white dark:bg-slate-900 border-2 border-[#2D9A8F] rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-[0_40px_80px_-20px_rgba(45,154,143,0.15)]">  
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter text-center uppercase italic leading-tight">
              Înregistrare
            </h1>
            <AnimatePresence mode="wait">
              {/* PASUL 1: TIP PARTICIPANT */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-[#2D9A8F] text-white w-10 h-10 flex items-center justify-center rounded-full font-black italic">
                      1
                    </span>
                    <h2 className="text-xl font-black uppercase italic tracking-tight">
                      Cine ești?
                    </h2>
                  </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {(["Fizica", "Juridica"] as const).map((t) => (
    <button
      key={t}
      type="button"
      onClick={() =>
        setValue("tipParticipant", t, {
          shouldValidate: true,
        })
      }
      className={`p-8 rounded-[2rem] border-2 transition-all duration-300 text-left flex flex-col relative overflow-hidden group 
        ${tipParticipant === t 
          ? "border-[#2D9A8F] bg-[#2D9A8F]/5 shadow-[0_20px_40px_-15px_rgba(45,154,143,0.2)]" 
          : "border-slate-100 bg-white hover:border-[#2D9A8F]/30 hover:bg-slate-50"}`}
    >
      {/* Iconița cu fundal adaptiv */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 
          ${tipParticipant === t 
            ? "bg-[#2D9A8F] text-white shadow-lg shadow-[#2D9A8F]/30" 
            : "bg-slate-50 text-slate-400 group-hover:text-[#2D9A8F]"}`}
      >
        {t === "Fizica" ? (
          <User size={32} strokeWidth={1.5} />
        ) : (
          <Building2 size={32} strokeWidth={1.5} />
        )}
      </div>

      {/* Text Label */}
      <div className="space-y-1">
        <span className={`block font-bold text-base transition-colors ${tipParticipant === t ? "text-slate-700" : "text-slate-700"}`}>
          Persoană {t}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
          Selectează opțiunea
        </span>
      </div>

      {/* Indicator subtil de selecție (Bulina) */}
      {tipParticipant === t && (
        <motion.div 
          layoutId="activeSelection"
          className="absolute top-6 right-6 w-4 h-4 bg-[#2D9A8F] rounded-full border-4 border-white dark:border-slate-900 shadow-sm" 
        />
      )}

      {/* Efect de fundal la hover */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-[#2D9A8F]/10 rounded-full blur-3xl transition-opacity ${tipParticipant === t ? "opacity-100" : "opacity-0"}`} />
    </button>
  ))}
</div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-black text-white font-black py-6 rounded-3xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-[0.2em] shadow-xl shadow-slate-200"
                  >
                    Continuă <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}

              {/* PASUL 2: DATE CONTACT */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-[#2D9A8F] text-white w-10 h-10 flex items-center justify-center rounded-full font-black italic">
                      2
                    </span>
                    <h2 className="text-xl font-black uppercase italic tracking-tight">
                      Date Contact
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <div className="flex flex-col">
  <label className="text-xs font-black text-black uppercase tracking-widest mb-3 block">
    Gen *
  </label>
  
  <div className="relative group">
    <select
      {...register("gender")}
      className={`w-full bg-white border-2 rounded-xl p-4 outline-none transition-all font-bold text-sm appearance-none cursor-pointer pr-12
        ${errors.gender 
          ? "border-red-500 ring-4 ring-red-50" 
          : "border-slate-200 focus:border-[#2D9A8F] focus:ring-4 focus:ring-[#2D9A8F]/5"
        }`}
    >
      <option value="">Alege...</option>
      <option value="D-na.">D-na.</option>
      <option value="Dl.">Dl.</option>
    </select>

    {/* SĂGEATA STILIZATĂ */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#2D9A8F] transition-colors">
      <ChevronDown size={20} strokeWidth={2.5} />
    </div>
  </div>

  {errors.gender && (
    <p className="text-red-500 text-[11px] mt-2 font-black uppercase tracking-wider">
      {errors.gender.message}
    </p>
  )}
</div>
                    <FormInput
                      label="Nume *"
                      {...register("nume")}
                      error={errors.nume}
                    />
                    <FormInput
                      label="Prenume *"
                      {...register("prenume")}
                      error={errors.prenume}
                    />

                    <FormInput
                      label="Email *"
                      type="email"
                      {...register("email")}
                      error={errors.email}
                    />

               <div>
  <label className="text-xs font-black text-black uppercase tracking-widest mb-3 block">
    Specializare *
  </label>
  
  <div className="relative group">
    <select
      {...register("specializare")}
      className={`w-full bg-white border-2 rounded-xl p-4 outline-none transition-all font-bold text-sm appearance-none cursor-pointer pr-12
        ${errors.specializare 
          ? "border-red-500 ring-4 ring-red-50" 
          : "border-slate-200 focus:border-[#2D9A8F] focus:ring-4 focus:ring-[#2D9A8F]/5"
        }`}
    >
      <option value="">Selectează specializarea...</option>
      {SPECIALIZARE_OPTIONS.map((spec) => (
        <option key={spec} value={spec}>
          {spec}
        </option>
      ))}
    </select>

    {/* SĂGEATA CUSTOM */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#2D9A8F] transition-colors">
      <ChevronDown size={20} strokeWidth={2.5} />
    </div>
  </div>

  {errors.specializare && (
    <p className="text-red-500 text-[11px] mt-2 font-black uppercase tracking-wider">
      {errors.specializare.message}
    </p>
  )}
</div>
                    <FormInput
                      label="Telefon *"
                      {...register("telefon")}
                      error={errors.telefon}
                    />

                    {selectedSpecializare === "Altă Specializare" && (
                      <div>
                        <FormInput
                          label="Specifică Specializarea *"
                          {...register("specializare_custom")}
                          error={errors.specializare_custom}
                          placeholder="Ex: Ortopedie"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-5 border-2 border-slate-200 rounded-xl hover:border-black transition-colors bg-white"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-black text-white font-black rounded-3xl hover:translate-y-[-2px] transition-all uppercase text-md  shadow-lg shadow-slate-200"
                    >
                      Următorul Pas
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PASUL 3: FACTURARE */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-[#2D9A8F] text-white w-10 h-10 flex items-center justify-center rounded-full font-black italic">
                      3
                    </span>
                    <h2 className="text-xl font-black uppercase italic tracking-tight">
                      Detalii Facturare
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {tipParticipant === "Fizica" ? (
                      <>
                        <FormInput
                          label="Cod Numeric Personal (CNP) *"
                          {...register("cnp")}
                          error={errors.cnp}
                          placeholder="13 cifre"
                        />
                        <FormInput
                          label="Adresa de facturare *"
                          {...register("adresaPF")}
                          error={errors.adresaPF}
                        />
                      </>
                    ) : (
                      <>
                        <FormInput
                          label="Denumirea societății *"
                          {...register("denumireSocietate")}
                          error={errors.denumireSocietate}
                          placeholder="Ex: SC Exemplu Business SRL"
                        />
                        <FormInput
                          label="Adresa Sediului Social *"
                          {...register("sediuSocial")}
                          error={errors.sediuSocial}
                          placeholder="Strada, Nr, Oraș..."
                        />
                        <FormInput
                          label="Codul Unic de Identificare (CUI) *"
                          {...register("cui")}
                          error={errors.cui}
                          placeholder="Ex: RO12345678"
                        />
                        <FormInput
                          label="Nr. de Înregistrare la Registrul Comerțului *"
                          {...register("registrulComertului")}
                          error={errors.registrulComertului}
                          placeholder="Ex: J40/123/2023"
                        />
                        <FormInput
                          label="Bancă (IBAN) *"
                          {...register("banca")}
                          placeholder="Ex: RO49AAAA1B31007593840000"
                          error={errors.banca}
                        />
                        <FormInput
                          label="Persoană Contact"
                          {...register("persoanadeContact")}
                          placeholder="Numele persoanei de contact"
                          error={errors.persoanadeContact}
                        />
                      </>
                    )}
                  </div>

                  <div className="space-y-8 max-w-3xl mx-auto">
                    {/* TITLU SECȚIUNE */}
                    <div className="space-y-2 ml-2">
                      <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase">
                        Acorduri și Consimțământ
                 
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Te rugăm să parcurgi și să bifezi clauzele de mai jos
                        pentru a finaliza înscrierea.
                      </p>
                    </div>

                    <div className="grid gap-6">
                      {/* CARD 1: CADRUL LEGAL */}
                      <div
                        className={`relative group overflow-hidden bg-white dark:bg-slate-900 border ${errors.politica_confidentialitate || errors.termeni_conditii ? "border-red-200 shadow-red-50" : "border-slate-200 dark:border-slate-800"} rounded-[2.5rem] p-8 shadow-sm transition-all duration-300`}
                      >
                        <div className="space-y-6">
                          <div>
                            <FormCheckbox
                              label={
                                <span className="text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                                  Îmi exprim acordul pentru prelucrarea datelor
                                  mele personale în conformitate cu{" "}
                                  <a
                                    href="/politica-de-confidentialitate"
                                    target="_blank"
                                    className="text-[#2D9A8F] hover:underline font-black transition-colors"
                                  >
                                    Politica de Confidențialitate
                                  </a>{" "}
                                  a SummitSphere SRL.*
                                </span>
                              }
                              {...register("politica_confidentialitate")}
                            />
                            {errors.politica_confidentialitate && (
                              <p className="mt-2 ml-9 text-xs font-bold text-red-500 animate-bounce-subtle">
                                {errors.politica_confidentialitate.message ||
                                  "Acest acord este obligatoriu"}
                              </p>
                            )}
                          </div>

                          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 ml-9" />

                          <div>
                            <FormCheckbox
                              label={
                                <span className="text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                                  Declar că am citit și accept{" "}
                                  <a
                                    href="/termeni-si-conditii"
                                    target="_blank"
                                    className="text-[#2D9A8F] hover:underline font-black transition-colors"
                                  >
                                    Termenii și Condițiile
                                  </a>{" "}
                                  SummitSphere SRL, așa cum sunt publicați pe
                                  site.*
                                </span>
                              }
                              {...register("termeni_conditii")}
                            />
                            {errors.termeni_conditii && (
                              <p className="mt-2 ml-9 text-xs font-bold text-red-500 animate-bounce-subtle">
                                {errors.termeni_conditii.message ||
                                  "Trebuie să accepți termenii și condițiile"}
                              </p>
                            )}
                          </div>

                          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 ml-9" />

                          <FormCheckbox
                            label={
                              <span className="text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                                Îmi exprim consimțământul de a primi, prin
                                e-mail, comunicări privind evenimentele viitoare
                                organizate de SummitSphere SRL, având oricând
                                posibilitatea de a-mi retrage acordul.
                              </span>
                            }
                            {...register("marketing_consent")}
                          />
                        </div>
                      </div>

                      {/* CARD 2: MEDIA & FOTO */}
                      <div
                        className={`bg-[#2D9A8F]/5 dark:bg-[#2D9A8F]/10 border ${errors.acord_foto_video ? "border-red-300 bg-red-50/30" : "border-[#2D9A8F]/20"} rounded-[2.5rem] p-8 transition-all`}
                      >
                        <div className="space-y-4">
                          <FormCheckbox
                            label={
                              <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Sunt de acord cu realizarea și utilizarea
                                materialelor foto și video în cadrul
                                evenimentului.*
                              </span>
                            }
                            {...register("acord_foto_video")}
                          />
                          {errors.acord_foto_video && (
                            <p className="ml-9 text-xs font-bold text-red-500">
                              Te rugăm să bifezi acordul foto și video
                            </p>
                          )}
                          <div className="ml-9 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#2D9A8F]/30 rounded-full" />
                            <p className="pl-6 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 text-justify italic">
                              Participarea la acest eveniment implică
                              posibilitatea de a apărea în fotografii sau
                              filmări utilizate oficial.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CARD 3: NATURA EVENIMENTULUI */}
                      <div
                        className={`bg-slate-50 dark:bg-slate-950/40 border ${errors.informare_natura_eveniment ? "border-red-300" : "border-slate-200 dark:border-slate-800"} rounded-[2.5rem] p-8`}
                      >
                        <div className="space-y-4">
                          <FormCheckbox
                            label={
                              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                                Am luat la cunoștință caracterul informativ al
                                evenimentului.
                              </span>
                            }
                            {...register("informare_natura_eveniment")}
                          />
                          {errors.informare_natura_eveniment && (
                            <p className="ml-9 text-xs font-bold text-red-500">
                              Confirmarea este necesară pentru a continua
                            </p>
                          )}
                          <div className="ml-9 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#2D9A8F]/30 rounded-full" />
                            <p className="pl-6 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 text-justify italic">
                        Acest eveniment are caracter educațional și informativ.
Informațiile prezentate în cadrul evenimentului au scop general de educație medicală și prevenție și nu reprezintă consultație medicală, diagnostic sau recomandare personalizată de tratament.

                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="flex justify-center p-5 bg-white ">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(v) =>
                          setValue("recaptchaToken", v || "", {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                    {errors.recaptchaToken && (
                      <p className="text-red-600 text-xs font-black text-center uppercase">
                        {errors.recaptchaToken.message}
                      </p>
                    )}

                    {serverError && (
                      <div className="p-5 bg-red-600 text-white text-xs font-black text-center uppercase tracking-widest rounded-xl shadow-lg">
                        {serverError}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="p-5 border-2 border-slate-200 rounded-xl bg-white hover:border-black transition-colors"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-black text-white font-black rounded-3xl hover:translate-y-[-2px] transition-all disabled:opacity-50 uppercase text-md py-6 shadow-xl"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin mx-auto" />
                        ) : (
                          "Finalizează Înscrierea"
                        )}
                      </button>
                    </div>



{/* ATENTIONARE LOCURI LIMITATE */}
  <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-2xl rounded-l-md">
    <div className="flex gap-3">
      <div className="text-amber-500 shrink-0">
        <Info size={20} strokeWidth={2.5} />
      </div>
      <div className="space-y-1">
        <h4 className="text-amber-800 font-black text-[11px] uppercase tracking-wider">
          Locuri Limitate
        </h4>
        <p className="text-amber-700/80 text-xs font-medium leading-relaxed text-justify">
          Locul este considerat rezervat după efectuarea plății. Completarea formularului reprezintă doar etapa de înscriere.
        </p>
      </div>
    </div>
    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE ---

const FormInput = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, ...props }, ref) => (
    <div className="w-full">
      <label className="text-xs font-black text-black uppercase tracking-widest mb-3 block">
        {label}
      </label>
    <input
  ref={ref}
  {...props}
  className={`
    w-full p-4 rounded-xl text-sm font-bold text-black outline-none transition-all shadow-sm bg-white border-2
    placeholder:text-slate-300
    ${error 
      ? "border-red-500 ring-4 ring-red-50" 
      : "border-slate-200 focus:border-[#2D9A8F] focus:ring-4 focus:ring-[#2D9A8F]/5"
    }
  `}
/>
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-red-600">
          <AlertCircle size={14} strokeWidth={3} />
          <p className="text-[11px] font-black uppercase italic tracking-tight">
            {error.message}
          </p>
        </div>
      )}
    </div>
  ),
);
FormInput.displayName = "FormInput";

const FormCheckbox = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, ...props }, ref) => (
    <label className="flex items-start gap-4 cursor-pointer group py-2 text-justify">
      <div className="relative flex items-center shrink-0">
        <input
          type="checkbox"
          ref={ref}
          {...props}
          className="peer appearance-none w-6 h-6 border-2 border-black rounded-md checked:bg-black transition-all cursor-pointer"
        />
        {/* Iconița de bifă care apare doar la checked */}
        <svg
          className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block stroke-white outline-none left-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span
        className={`text-sm md:text-md font-medium leading-tight tracking-tight ${
          error
            ? "text-red-600 font-bold"
            : "text-slate-700 group-hover:text-black transition-colors"
        }`}
      >
        {label}
      </span>
    </label>
  ),
);
FormCheckbox.displayName = "FormCheckbox";

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(45,154,143,0.2)] relative overflow-hidden"
      >
        {/* Decorare Fundal Subtilă */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2D9A8F]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

        {/* Iconița de Succes cu "Glow" */}
        <div className="relative">
          <motion.div 
            initial={{ rotate: -15, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-tr from-[#2D9A8F] to-[#3dbbb0] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_-10px_rgba(45,154,143,0.4)]"
          >
            <CheckCircle className="text-white" size={48} strokeWidth={2.5} />
          </motion.div>
          
          {/* Cercuri animate în spatele iconiței */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
             <div className="w-24 h-24 bg-[#2D9A8F]/20 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
          Înregistrare <span className="text-[#2D9A8F]">Confirmată!</span>
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium text-sm leading-relaxed px-6">
          Te-ai înscris cu succes la eveniment. 
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="group w-full bg-[#2D9A8F] hover:bg-[#258278] text-white font-bold py-5 rounded-[1.5rem] shadow-[0_15px_30px_-8px_rgba(45,154,143,0.4)] transition-all flex items-center justify-center gap-3 text-sm tracking-tight active:scale-95"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
            Înapoi la Pagina Principală
          </Link>
          
          <button
            onClick={onReset}
            className="w-full text-slate-400 hover:text-[#2D9A8F] font-bold py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group"
          >
            <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#2D9A8F]" />
            Altă Înregistrare
            <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#2D9A8F]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
