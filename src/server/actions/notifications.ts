// src/server/actions/notifications.ts (UPDATED - Actually works!)
"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * ============================================
 * NOTIFY ADMIN - Server Action
 * ============================================
 * Saves notification to database
 * Admin dashboard polls and displays it
 */

interface NotificationData {
  participantName: string;
  participantEmail: string;
  eventTitle: string;
  eventId: string;
}

/**
 * ✅ Save notification to database
 * Called after successful participant registration
 */
export async function notifyAdminNewRegistration(data: NotificationData) {
  try {
   

   const supabase = createAdminClient();

    // ✅ Create notification record in database
    const { error } = await supabase.from("admin_notifications").insert({
      type: "participant_registered",
      title: "📝 Nouă înscricare!",
      message: `${data.participantName} (${data.participantEmail}) s-a înscris la ${data.eventTitle}`,
      action_url: `/admin/participants?event=${data.eventId}`,
      action_label: "Vezi participanți",
      event_id: data.eventId,
      participant_email: data.participantEmail,
      read: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[NOTIFICATION] Database error:", error);
      return { success: false, error: error.message };
    }


    return { success: true };
  } catch (error) {
    console.error("[NOTIFICATION] Error:", error);
    return { success: false };
  }
}

/**
 * ✅ Get unread notifications for admin dashboard
 */
export async function getAdminNotifications() {
  try {

     await requireAdmin();
     
const supabase = createAdminClient();

    // ✅ Fetch unread notifications (last 10)
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("*")
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("[NOTIFICATIONS] Fetch error:", error);
      return { success: false, notifications: [] };
    }

    return { success: true, notifications: data || [] };
  } catch (error) {
    console.error("[NOTIFICATIONS] Error:", error);
    return { success: false, notifications: [] };
  }
}

/**
 * ✅ Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("admin_notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("[NOTIFICATION] Mark as read error:", error);
    return { success: false };
  }
}

/**
 * ✅ Delete notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("admin_notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("[NOTIFICATION] Delete error:", error);
    return { success: false };
  }
}

/**
 * ✅ Clear all notifications
 */
export async function clearAllNotifications() {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("admin_notifications")
      .delete()
      .eq("read", false);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("[NOTIFICATION] Clear all error:", error);
    return { success: false };
  }
}