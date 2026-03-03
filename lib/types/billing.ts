// src/types/billing.ts
export interface ParticipantFormData {
  id: string;
  event_id: string;
  nume: string;
  prenume: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  city?: string;
  country?: string;
  dietary_restrictions?: string;
  special_requests?: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface BillingDetails {
  participantId: string;
  participantName: string;
  participantEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  price: number;
  currency: string;
  amountPaid: number;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentMethod?: string;
  status: "pending" | "paid" | "refunded";
}

export interface Invoice {
  id: string;
  participantId: string;
  eventId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  created_at: string;
  paid_at?: string;
}