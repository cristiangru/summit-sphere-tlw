// src/lib/types/events.ts (UPDATE EventStats interface)
"use client";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  status: "active" | "cancelled" | "completed";
  price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}
export interface EventStats {
  totalParticipants: number;
  confirmedParticipants: number;
  pendingParticipants: number;
  attendedParticipants: number;
  noShowParticipants: number;
  cancelledParticipants: number;
  occupancyRate: number;
  availableSpots: number;
}

export interface EnhancedEvent extends Event {
  stats?: EventStats;
}

export interface EventFormData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  price: number;
  currency: string;
}

export interface EventsResponse {
  success: boolean;
  events?: Event[];
  error?: string;
  total?: number;
}

export interface EventStatsResponse {
  success: boolean;
  stats?: EventStats;
  error?: string;
}

export interface CreateEventResponse {
  success: boolean;
  eventId?: string;
  message?: string;
  error?: string;
}

export interface UpdateEventResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DeleteEventResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ChangeEventStatusResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type FilterTab = "active" | "completed" | "cancelled" | "all";
export type YearFilter = "all" | number;

export interface FilterState {
  tab: FilterTab;
  year: YearFilter;
  search: string;
}