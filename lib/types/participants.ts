// src/lib/types/participants.ts (UPDATED - ALL 5 AGREEMENTS)
export interface Participant {
  id: string;
  event_id: string;
  gender: "Dl." | "Dna.";
  nume: string;
  prenume: string;
  email: string;
  telefon: string;
  specializare: string;
  specializare_custom?: string; // For custom specialization when "Altă Specializare" is selected
  tip_participant: "Fizica" | "Juridica";
  
  // Persoană Fizică
  cnp?: string;
  adresa_pf?: string;
  
  // Persoană Juridică
  denumire_societate?: string;
  cui?: string;
  registrul_comertului?: string;
  sediu_social?: string;
  iban?: string;
  persoana_contact?: string;
  
  status: "pending" | "confirmed" | "cancelled" | "no-show" | "attended";
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  source: string;
  notes?: string;
  amount_paid: string | number | null;
  
  // ✅ AGREEMENTS (5 TOTAL)
  politica_confidentialitate: boolean;
  termeni_conditii: boolean;
  marketing_consent: boolean;
  acord_foto_video: boolean;
  informare_natura_eveniment: boolean;
  
  // ✅ SOFT DELETE
  deleted_at: string | null;
}

export interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  price: number;
  currency: string;
  status: "active" | "cancelled" | "completed";
}

export interface ParticipantWithEvent extends Participant {
  event?: Event;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: "name" | "email" | "date" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TableFilters {
  status: ParticipantStatus | "";
  search: string;
  eventId: string | "";
  tipParticipant: "Fizica" | "Juridica" | "";
  sortBy: "name" | "email" | "date" | "status";
  sortOrder: "asc" | "desc";
}

export interface ExportOptions {
  format: "csv" | "pdf" | "xlsx";
  includeHeaders: boolean;
  selectedFields?: string[];
}

export type ParticipantStatus = "pending" | "confirmed" | "cancelled" | "no-show" | "attended";

export interface ParticipantStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  attended: number;
  noShow: number;
}