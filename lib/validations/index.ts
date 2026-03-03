// src/lib/validations/index.ts (COMPLETE FIXED - specializare_custom working)
import { z } from "zod";

// ============================================
// REGEX PATTERNS - CENTRALIZED
// ============================================
const phoneRegex = /^[\d\s+()-]{10,20}$/;
const ibanRegex = /^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$/;
const cuiRegex = /^(RO)?[0-9]{6,10}$/i;
const regComRegex = /^J(0[1-9]|[1-4]\d|40)\/\d{1,7}\/\d{4}$/i;
const cnpRegex = /^[1-9]\d{12}$/;

// ============================================
// COMMON SCHEMAS
// ============================================
export const uuidSchema = z.string().uuid("Format ID invalid");

export const emailSchema = z
  .string()
  .min(1, "Email-ul este obligatoriu")
  .email("Adresă de email invalidă")
  .toLowerCase()
  .trim();

// ============================================
// SPECIALIZARE OPTIONS - FIXED ENUM
// ============================================
export const SPECIALIZARE_OPTIONS = [
  "Obstetrica și Ginecologie",
  "Dermatologie",
  "Pediatrie",
  "Endocrinologie",
  "ORL (Oto-Rino-Laringologie)",
  "Medicina de Familie",
  "Gastroenterologie",
  "Altă Specializare",
] as const;

// ============================================
// PARTICIPANT REGISTRATION SCHEMA - FIXED
// ============================================
export const participantRegistrationSchema = z.object({
  eventId: uuidSchema,
  tipParticipant: z
    .enum(["Fizica", "Juridica"])
    .refine(val => val, "Selectează un tip de participant"),
 
  gender: z
    .enum(["D-na.", "Dl."])
    .refine(val => val, "Selectează un titlu"),

  // ✅ CONTACT FIELDS - ALL REQUIRED
  nume: z
    .string()
    .trim()
    .min(1, "Nume este obligatoriu")
    .min(2, "Nume prea scurt (minim 2 caractere)")
    .max(100, "Nume prea lung (maxim 100 caractere)"),
  
  prenume: z
    .string()
    .trim()
    .min(1, "Prenume este obligatoriu")
    .min(2, "Prenume prea scurt (minim 2 caractere)")
    .max(100, "Prenume prea lung (maxim 100 caractere)"),
  
  email: emailSchema,
  
  telefon: z
    .string()
    .trim()
    .min(1, "Telefon este obligatoriu")
    .regex(phoneRegex, "Format telefon invalid (ex: 0722123456 sau +40722123456)"),
  
  // ✅ SPECIALIZARE - REQUIRED ENUM
  specializare: z
    .enum(SPECIALIZARE_OPTIONS, {
      message: "Selectează o specializare valida"
    }),

  // ✅ CUSTOM SPECIALIZATION - JUST optional, NO validation here!
  specializare_custom: z
    .string()
    .optional(),

  tip_participant: z
    .enum(["Fizica", "Juridica"])
    .optional(),

  // ✅ AGREEMENTS - REQUIRED & OPTIONAL
  recaptchaToken: z
    .string()
    .min(1, "Verificarea bot este obligatorie"),
  
  politica_confidentialitate: z
    .boolean()
    .refine(v => v === true, "Trebuie să accepți politica de confidențialitate"),
  
  termeni_conditii: z
    .boolean()
    .refine(v => v === true, "Trebuie să accepți termenii și condițiile"),
  
  marketing_consent: z
    .boolean()
    .default(false),

  // ✅ FOTO/VIDEO AGREEMENT (REQUIRED)
  acord_foto_video: z
    .boolean()
    .refine(v => v === true, "Trebuie să accepți acordul foto/video"),

  // ✅ NATURA EVENIMENT AGREEMENT (OPTIONAL)
  informare_natura_eveniment: z
    .boolean()
    .default(false),

  // ✅ FIZICA FIELDS - CONDITIONAL REQUIRED
  cnp: z.string().trim().optional(),
  adresaPF: z.string().trim().optional(),

  // ✅ JURIDICA FIELDS - CONDITIONAL REQUIRED
  denumireSocietate: z.string().trim().optional(),
  cui: z.string().trim().optional(),
  registrulComertului: z.string().trim().optional(),
  sediuSocial: z.string().trim().optional(),
  banca: z.string().trim().optional(),

  // ✅ PERSOANĂ DE CONTACT - OPTIONAL
  persoanadeContact: z
    .string()
    .trim()
    .max(100, "Persoană de contact prea lungă (maxim 100 caractere)")
    .optional(),
})
.superRefine((data, ctx) => {
  // ============================================
  // ✅ CUSTOM SPECIALIZATION VALIDATION
  // ============================================
  // ONLY validate if "Altă Specializare" is selected!
  if (data.specializare === "Altă Specializare") {
    if (!data.specializare_custom || data.specializare_custom.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Te rog să specifici specializarea ta",
        path: ["specializare_custom"],
      });
    } else if (data.specializare_custom.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Specializarea trebuie să aibă cel puțin 2 caractere",
        path: ["specializare_custom"],
      });
    } else if (data.specializare_custom.trim().length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Specializarea prea lungă (maxim 100 caractere)",
        path: ["specializare_custom"],
      });
    }
  }
  // ✅ If NOT "Altă Specializare", skip validation completely!

  // ============================================
  // ✅ FIZICA VALIDATION
  // ============================================
  if (data.tipParticipant === "Fizica") {
    // CNP Validation
    if (!data.cnp || data.cnp.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CNP este obligatoriu",
        path: ["cnp"],
      });
    } else if (!cnpRegex.test(data.cnp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CNP invalid (trebuie să fie 13 cifre, ex: 1900101234567)",
        path: ["cnp"],
      });
    }

    // Adresa PF Validation
    if (!data.adresaPF || data.adresaPF.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Adresa domiciliu este obligatorie",
        path: ["adresaPF"],
      });
    } else if (data.adresaPF.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Adresa domiciliu prea scurtă (minim 5 caractere)",
        path: ["adresaPF"],
      });
    } else if (data.adresaPF.length > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Adresa domiciliu prea lungă (maxim 200 caractere)",
        path: ["adresaPF"],
      });
    }
  }

  // ============================================
  // ✅ JURIDICA VALIDATION
  // ============================================
  else if (data.tipParticipant === "Juridica") {
    // Denumire Societate Validation
    if (!data.denumireSocietate || data.denumireSocietate.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Denumirea societății este obligatorie",
        path: ["denumireSocietate"],
      });
    } else if (data.denumireSocietate.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Denumirea societății prea scurtă (minim 2 caractere)",
        path: ["denumireSocietate"],
      });
    } else if (data.denumireSocietate.length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Denumirea societății prea lungă (maxim 100 caractere)",
        path: ["denumireSocietate"],
      });
    }

    // CUI Validation
    if (!data.cui || data.cui.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CUI este obligatoriu",
        path: ["cui"],
      });
    } else if (!cuiRegex.test(data.cui)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CUI invalid (format: 6-10 cifre, ex: 12345678 sau RO12345678)",
        path: ["cui"],
      });
    }

    // Sediu Social Validation
    if (!data.sediuSocial || data.sediuSocial.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sediul social este obligatoriu",
        path: ["sediuSocial"],
      });
    } else if (data.sediuSocial.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sediul social prea scurt (minim 5 caractere)",
        path: ["sediuSocial"],
      });
    } else if (data.sediuSocial.length > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sediul social prea lung (maxim 200 caractere)",
        path: ["sediuSocial"],
      });
    }

  const regCom = (data.registrulComertului || "").trim();
  if (!regCom) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Numărul de ordine în Registrul Comerțului este obligatoriu (ex: J40/1234/2025)",
      path: ["registrulComertului"],
    });
  } else if (!regComRegex.test(regCom)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Format invalid pentru Registrul Comerțului (ex: J40/123/2025 sau J08/9999/2020)",
      path: ["registrulComertului"],
    });
  }

  

// IBAN / Banca - obligatoriu
  const ibanVal = (data.banca || "").trim().replace(/\s+/g, ''); // elimină spații
  if (!ibanVal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "IBAN-ul este obligatoriu pentru persoane juridice",
      path: ["banca"],
    });
  } else if (!ibanRegex.test(ibanVal)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "IBAN invalid – trebuie să înceapă cu RO + 22 caractere (ex: RO49AAAA1B31007593840000)",
      path: ["banca"],
    });
  }
  
  }
});

export type ParticipantRegistration = z.infer<typeof participantRegistrationSchema>;

// ============================================
// EVENT SCHEMAS
// ============================================

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "Titlul trebuie să aibă cel puțin 3 caractere")
    .max(200, "Titlul nu trebuie să depășească 200 de caractere"),
  description: z
    .string()
    .max(1000, "Descrierea nu trebuie să depășească 1000 de caractere")
    .optional()
    .default(""),
  start_date: z
    .string()
    .min(1, "Data de început este obligatorie")
    .refine(
      (date) => {
        try {
          const d = new Date(date);
          return !isNaN(d.getTime());
        } catch {
          return false;
        }
      },
      "Format dată/oră invalid"
    ),
  end_date: z
    .string()
    .min(1, "Data de sfârşit este obligatorie")
    .refine(
      (date) => {
        try {
          const d = new Date(date);
          return !isNaN(d.getTime());
        } catch {
          return false;
        }
      },
      "Format dată/oră invalid"
    ),
  location: z
    .string()
    .min(3, "Locația trebuie să aibă cel puțin 3 caractere")
    .max(255),
  price: z
    .number()
    .min(0, "Prețul nu poate fi negativ"),
  currency: z
    .string()
    .default("RON"),
  max_participants: z
    .number()
    .int("Trebuie să fie un număr întreg")
    .positive("Trebuie să fie mai mare decât 0"),
})
.refine(
  (data) => {
    try {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return endDate > startDate;
    } catch {
      return false;
    }
  },
  {
    message: "Data de sfârşit trebuie să fie după data de început",
    path: ["end_date"],
  }
);

export type CreateEvent = z.infer<typeof createEventSchema>;

export const updateEventSchema = z.object({
  id: uuidSchema,
  title: z
    .string()
    .min(3, "Titlul trebuie să aibă cel puțin 3 caractere")
    .max(200, "Titlul nu trebuie să depășească 200 de caractere")
    .optional(),
  description: z
    .string()
    .max(1000)
    .optional(),
  start_date: z
    .string()
    .refine(
      (date) => {
        try {
          const d = new Date(date);
          return !isNaN(d.getTime());
        } catch {
          return false;
        }
      },
      "Format dată/oră invalid"
    )
    .optional(),
  end_date: z
    .string()
    .refine(
      (date) => {
        try {
          const d = new Date(date);
          return !isNaN(d.getTime());
        } catch {
          return false;
        }
      },
      "Format dată/oră invalid"
    )
    .optional(),
  location: z
    .string()
    .min(3, "Locația trebuie să aibă cel puțin 3 caractere")
    .optional(),
  price: z
    .number()
    .min(0)
    .optional(),
  currency: z
    .string()
    .optional(),
  max_participants: z
    .number()
    .int()
    .positive()
    .optional(),
})
.refine(
  (data) => {
    if (data.start_date && data.end_date) {
      try {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return endDate > startDate;
      } catch {
        return false;
      }
    }
    return true;
  },
  {
    message: "Data de sfârşit trebuie să fie după data de început",
    path: ["end_date"],
  }
);

export type UpdateEvent = z.infer<typeof updateEventSchema>;

// ============================================
// STATUS & PAGINATION
// ============================================
export const updateParticipantStatusSchema = z.object({
  participantId: uuidSchema,
  status: z.enum(["pending", "confirmed", "cancelled", "no-show", "attended"]),
  reason: z.string().trim().max(500).optional(),
});

export type UpdateParticipantStatus = z.infer<typeof updateParticipantStatusSchema>;

// ============================================
// PAGINATION SCHEMAS
// ============================================
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Pagination = z.infer<typeof paginationSchema>;

// ============================================
// FILTER SCHEMAS
// ============================================
export const participantFilterSchema = z.object({
  eventId: uuidSchema,
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
});

export type ParticipantFilter = z.infer<typeof participantFilterSchema>;