import { z } from "zod";

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere")
    .max(50, "Numele este prea lung")
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/, "Numele conține caractere invalide"),
  lastName: z
    .string()
    .min(2, "Prenumele trebuie să aibă cel puțin 2 caractere")
    .max(50, "Prenumele este prea lung")
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/, "Prenumele conține caractere invalide"),
  email: z
    .string()
    .email("Adresa de email nu este validă")
    .max(100, "Email-ul este prea lung"),
  phone: z
    .string()
    .regex(
      /^(\+40|0)[0-9]{8,9}$/,
      "Numărul de telefon trebuie să fie valid (ex: +40728909983 sau 0728909983)"
    )
    .max(15, "Numărul de telefon este prea lung"),
  message: z
    .string()
    .min(10, "Mesajul trebuie să aibă cel puțin 10 caractere")
    .max(2000, "Mesajul este prea lung (maxim 2000 caractere)"),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "Trebuie să accepți politica de prelucrare a datelor",
    }),
  recaptchaToken: z.string().min(1, "reCAPTCHA token lipsă"),
});

export type ContactFormData = z.infer<typeof contactSchema>;