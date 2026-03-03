// src/lib/types/database.ts
interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  status: "active" | "cancelled" | "completed";
  price: number;      // Câmp nou
  currency: string;   // Câmp nou
}

export interface Participant {
  id: string;
  event_id: string;
  gender: string | null;
  nume: string;
  prenume: string;
  email: string;
  telefon: string;
  specializare: string;
  tip_participant: 'Fizica' | 'Juridica';
  cnp: string | null;
  adresa_pf: string | null;
  denumire_societate: string | null;
  cui: string | null;
  registrul_comertului: string | null;
  sediu_social: string | null;
  iban: string | null;
  persoana_contact: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'attended';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  source: string;
  notes: string | null;
}

export interface StatusHistory {
  id: string;
  participant_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  reason: string | null;
  changed_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  user_email: string;
  resource: string;
  resource_id: string | null;
  details: Record<string, any> | null;
  severity: 'info' | 'warning' | 'error';
  created_at: string;
}