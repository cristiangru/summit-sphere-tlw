"use client";
import React, { useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { submitContactForm } from "@/src/server/actions/contact";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function ContactFormDemo() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
      recaptchaToken: "",
    },
  });

  const consent = watch("consent");

  const onRecaptchaChange = useCallback(
    (token: string | null) => {
      setValue("recaptchaToken", token ?? "", { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus(null);

    const result = await submitContactForm(data);

    if (result.success) {
      setSubmitStatus({ type: "success", message: result.message });
      reset();
      recaptchaRef.current?.reset();
    } else {
      setSubmitStatus({ type: "error", message: result.error });
      recaptchaRef.current?.reset();
      setValue("recaptchaToken", "");
    }
  };

  return (
    <div className="shadow-2xl mx-auto w-full max-w-xl rounded-[2.5rem] bg-white p-8 md:p-12 border border-slate-200 dark:border-white/10 dark:bg-black relative overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 tracking-tight text-center mb-5">
        Solicită o programare
      </h2>

      {submitStatus && (
        <div
          className={cn(
            "mb-6 flex items-start gap-3 rounded-xl p-4 text-sm",
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          )}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <p>{submitStatus.message}</p>
        </div>
      )}

      <form className="my-10 mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">Nume</Label>
            <Input
              id="firstName"
              placeholder="Popescu"
              type="text"
              {...register("firstName")}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <FieldError message={errors.firstName.message} />}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Prenume</Label>
            <Input
              id="lastName"
              placeholder="Ion"
              type="text"
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <FieldError message={errors.lastName.message} />}
          </LabelInputContainer>
        </div>

        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="ion@example.com"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError message={errors.email.message} />}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              placeholder="+40 728909983"
              type="tel"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <FieldError message={errors.phone.message} />}
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="message">Detalii eveniment / Mesaj</Label>
          <textarea
            id="message"
            placeholder="Spune-ne cum te putem ajuta"
            rows={5}
            {...register("message")}
            aria-invalid={!!errors.message}
            className="flex w-full rounded-md border-none bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm text-black dark:text-white transition duration-400 focus:outline-none focus:ring-2 focus:ring-[#2D9A8F] dark:shadow-[0px_0px_1px_1px_#404040]"
          />
          {errors.message && <FieldError message={errors.message.message} />}
        </LabelInputContainer>

        <div className="mb-6 flex flex-col items-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaChange}
            onExpired={() => setValue("recaptchaToken", "")}
            theme="light"
          />
          {errors.recaptchaToken && (
            <FieldError message="Te rugăm să completezi verificarea reCAPTCHA" />
          )}
        </div>

        <div className="mb-10 flex items-start space-x-3">
          <input
            id="consent"
            type="checkbox"
            {...register("consent")}
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
        {errors.consent && (
          <div className="-mt-6 mb-4">
            <FieldError message={errors.consent.message} />
          </div>
        )}

        <button
          className="group/btn relative block h-12 w-full rounded-xl bg-slate-900 dark:bg-[#2D9A8F] font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(45,154,143,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting || !consent}
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Se trimite...
              </>
            ) : (
              <>
                Trimite Solicitarea
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </div>
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-xs text-red-500 dark:text-red-400 mt-1">{message}</p>;
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-[#2D9A8F] opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-[#2D9A8F] opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);