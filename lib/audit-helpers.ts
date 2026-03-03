// src/lib/audit-helpers.ts
"use server";

/**
 * Helper to format participant deletion details for audit log
 */
export function formatParticipantDeletionDetails(participant: any, adminEmail?: string) {
  return {
    participantEmail: participant.email,
    participantName: `${participant.prenume} ${participant.nume}`,
    participantStatus: participant.status,
    participantType: participant.tip_participant,
    eventId: participant.event_id,
    createdAt: participant.created_at,
    updatedAt: participant.updated_at,
    deletedBy: adminEmail || "system",
    deletedAt: new Date().toISOString(),
    reason: "Admin deletion",
  };
}

/**
 * Helper to format status change details for audit log
 */
export function formatStatusChangeDetails(
  oldStatus: string,
  newStatus: string,
  participantEmail: string,
  participantName: string,
  reason?: string
) {
  return {
    participantEmail,
    participantName,
    oldStatus,
    newStatus,
    statusChangeReason: reason || "Manual status update",
    changedAt: new Date().toISOString(),
  };
}

/**
 * Helper to format registration details for audit log
 */
export function formatRegistrationDetails(
  email: string,
  tipParticipant: string,
  ipAddress: string,
  recaptchaScore?: number
) {
  return {
    email,
    tipParticipant,
    ipAddress,
    recaptchaScore: recaptchaScore || null,
    registeredAt: new Date().toISOString(),
  };
}

/**
 * Helper to get action display name
 */
export function getActionDisplayName(action: string): string {
  const actions: Record<string, string> = {
    PARTICIPANT_REGISTERED: "Participant Registered",
    PARTICIPANT_DELETED: "Participant Deleted",
    PARTICIPANT_STATUS_CHANGED: "Status Changed",
    PARTICIPANTS_BULK_STATUS_CHANGED: "Bulk Status Change",
    PARTICIPANTS_EXPORTED: "Data Exported",
  };

  return actions[action] || action;
}

/**
 * Helper to get action icon
 */
export function getActionIcon(action: string): string {
  if (action.includes("DELETED")) return "🗑️";
  if (action.includes("REGISTERED")) return "➕";
  if (action.includes("CHANGED")) return "🔄";
  if (action.includes("EXPORTED")) return "📥";
  return "📝";
}