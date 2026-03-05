// src/lib/audit.ts (FIXED - SAVES TO SUPABASE)
/**
 * Audit logging for compliance and security
 * Tracks all important admin actions
 * ✅ NOW SAVES TO SUPABASE!
 */

import { createAdminClient } from "@/lib/supabase/server";


export interface AuditLog {
  action: string; // e.g., "PARTICIPANT_CONFIRMED", "CSV_EXPORTED"
  userId: string; // Clerk user ID or "system"
  userEmail: string; // User email
  resource: string; // e.g., "participants", "events"
  resourceId?: string; // ID of affected resource
  details?: Record<string, any>; // Additional context
  timestamp: Date;
  severity: "info" | "warning" | "error"; // Log level
}

/**
 * ✅ Log an action (SAVES TO SUPABASE + CONSOLE)
 */
export async function logAudit({
  action,
  userId,
  userEmail,
  resource,
  resourceId,
  details,
  severity = "info",
}: Omit<AuditLog, "timestamp">): Promise<void> {
  const log: AuditLog = {
    action,
    userId,
    userEmail,
    resource,
    resourceId,
    details,
    timestamp: new Date(),
    severity,
  };

  // Format for console output
  const logMessage = `[AUDIT ${severity.toUpperCase()}] ${action} by ${userEmail}`;
  const logData = {
    action,
    userId,
    userEmail,
    resource,
    resourceId,
    details,
    timestamp: log.timestamp.toISOString(),
  };

  // 1. Log to console
  if (severity === "error") {
    console.error(logMessage, logData);
  } else if (severity === "warning") {
    console.warn(logMessage, logData);
  } else {
    console.log(logMessage, logData);
  }

  // 2. ✅ SAVE TO SUPABASE
  try {
   const supabase = createAdminClient();

    
    const { error } = await supabase
      .from("audit_logs")
      .insert({
        action: log.action,
        user_id: log.userId,
        user_email: log.userEmail,
        resource: log.resource,
        resource_id: log.resourceId || null,
        details: log.details || {},
        severity: log.severity,
        created_at: log.timestamp.toISOString(),
      });

    if (error) {
      console.error("[ERROR] Failed to save audit log to Supabase:", error);
    } else {
      console.log(`[SUCCESS] Audit log saved: ${action}`);
    }
  } catch (error) {
    console.error("[ERROR] Exception saving audit log:", error);
  }
}

/**
 * ✅ Log security events specifically
 */
export async function logSecurityEvent(
  action: string,
  userId: string,
  userEmail: string,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    action,
    userId,
    userEmail,
    resource: "security",
    details,
    severity: "warning",
  });
}

/**
 * ✅ Log successful admin action
 */
export async function logAdminAction(
  action: string,
  userId: string,
  userEmail: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    action,
    userId,
    userEmail,
    resource,
    resourceId,
    details,
    severity: "info",
  });
}