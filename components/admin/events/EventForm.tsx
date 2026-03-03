// src/components/admin/events/EventForm.tsx (FINAL - Correct field names)
"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToastContext } from "@/components/ToastProvider";
import { useCreateEventMutation, useUpdateEventMutation } from "@/lib/hooks/useEvents";
import { EnhancedEvent } from "@/lib/types/events";

interface EventFormProps {
  event?: EnhancedEvent;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Convert ISO to datetime-local format (for input display)
 */
const toDatetimeLocal = (isoString?: string): string => {
  try {
    if (!isoString) {
      return new Date().toISOString().slice(0, 16);
    }
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().slice(0, 16);
    }
    return date.toISOString().slice(0, 16);
  } catch {
    return new Date().toISOString().slice(0, 16);
  }
};

export default function EventForm({ event, onClose, onSuccess }: EventFormProps) {
  const toast = useToastContext();
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    start_date: toDatetimeLocal(event?.start_date),
    end_date: toDatetimeLocal(event?.end_date),
    max_participants: event?.max_participants || 50,
    price: event?.price || 0,
    currency: event?.currency || "RON",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Titlul este obligatoriu";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Locația este obligatorie";
    }

    if (!formData.start_date || formData.start_date.trim() === "") {
      newErrors.start_date = "Data de început este obligatorie";
    }

    if (!formData.end_date || formData.end_date.trim() === "") {
      newErrors.end_date = "Data de sfârşit este obligatorie";
    }

    if (formData.start_date && formData.end_date) {
      try {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        if (isNaN(startDate.getTime())) {
          newErrors.start_date = "Format dată/oră invalid";
        } else if (isNaN(endDate.getTime())) {
          newErrors.end_date = "Format dată/oră invalid";
        } else if (endDate <= startDate) {
          newErrors.end_date = "Data de sfârşit trebuie să fie după data de început";
        }
      } catch {
        newErrors.start_date = "Eroare la validarea datei";
      }
    }

    if (formData.max_participants < 1) {
      newErrors.max_participants = "Minimum 1 participant";
    }

    if (formData.price < 0) {
      newErrors.price = "Prețul nu poate fi negativ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("❌ Completează corect formularul");
      return;
    }

    try {
      // ✅ SEND CORRECT FIELD NAMES
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        // ✅ Using correct names: start_date, end_date
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        max_participants: parseInt(String(formData.max_participants)),
        price: parseFloat(String(formData.price)),
        currency: formData.currency,
      };

      console.log("[FORM SUBMIT] Payload:", payload);

      if (event) {
        await updateMutation.mutateAsync({ id: event.id, data: payload });
        // toast.success("✓ Evenimentul a fost actualizat");
      } else {
        await createMutation.mutateAsync(payload);
        // toast.success("✓ Evenimentul a fost creat cu succes");
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Eroare necunoscută";
      console.error("[FORM ERROR]", err);
      toast.error(errorMessage);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {event ? "Editează Eveniment" : "Crează Eveniment"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Titlu *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 text-slate-900 dark:text-white ${
                errors.title
                  ? "border-red-500 dark:border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } bg-white dark:bg-slate-800`}
              placeholder="Ex: PEPTIDE ÎN MEDICINA MODERNĂ "
            />
            {errors.title && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Descriere
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 resize-none"
              placeholder="Descriere detaliată..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Locație *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 text-slate-900 dark:text-white ${
                errors.location
                  ? "border-red-500 dark:border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } bg-white dark:bg-slate-800`}
              placeholder="Ex: Sos. Mihai Bravu, Nr. 251-253"
            />
            {errors.location && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Data & Ora Început *
              </label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 text-slate-900 dark:text-white ${
                  errors.start_date
                    ? "border-red-500 dark:border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } bg-white dark:bg-slate-800`}
              />
              {errors.start_date && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.start_date}</p>
              )}
            </div>

            {/* End */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Data & Ora Sfârşit *
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 text-slate-900 dark:text-white ${
                  errors.end_date
                    ? "border-red-500 dark:border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } bg-white dark:bg-slate-800`}
              />
              {errors.end_date && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Locuri *
            </label>
            <input
              type="number"
              min="1"
              value={formData.max_participants}
              onChange={(e) =>
                setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })
              }
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 text-slate-900 dark:text-white ${
                errors.max_participants
                  ? "border-red-500 dark:border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } bg-white dark:bg-slate-800`}
            />
            {errors.max_participants && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.max_participants}</p>
            )}
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Preț *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20 text-slate-900 dark:text-white ${
                  errors.price
                    ? "border-red-500 dark:border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } bg-white dark:bg-slate-800`}
              />
              {errors.price && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Monedă
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D9A8F]/20"
              >
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Anulare
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[#2D9A8F] text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Se salvează...
                </>
              ) : (
                event ? "Actualizează" : "Crează"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}