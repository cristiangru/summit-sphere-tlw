// src/components/admin/participants/ParticipantDetailsModal.tsx (FINAL FIX)
"use client";

import { X, Loader2, Download, CheckCircle2, AlertCircle, Check, Copy} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ParticipantWithEvent } from "@/lib/types/participants";
import { useToastContext } from "@/components/ToastProvider";
import { exportParticipantsToExcel, exportParticipantsWithSummary } from "@/lib/utils/exportParticipants";
import { updateParticipantStatus } from "@/src/server/actions/participants";
import { useState } from "react";
import { useUpdateParticipantStatusMutation } from "@/lib/hooks/useParticipants";
interface ParticipantDetailsModalProps {
  participant: ParticipantWithEvent;
  onClose: () => void;
  onParticipantUpdated?: () => void;
  onGenerateInvoice?: (participant: ParticipantWithEvent) => Promise<void>;
}

export default function ParticipantDetailsModal({
  participant,
  onClose,
  onParticipantUpdated,
  onGenerateInvoice,
}: ParticipantDetailsModalProps) {
const statusMutation = useUpdateParticipantStatusMutation(participant.event_id);
  const eventData = Array.isArray(participant?.event) ? participant.event[0] : participant?.event;
  const toast = useToastContext();
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text || text === "N/A") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

const handleConfirmParticipant = async () => {
    if (hasConfirmed || isGenerating) return;

    setIsGenerating(true);
    setHasConfirmed(true);

    try {
      // ✅ 2. Apelăm mutația care știe să curețe cache-ul
      await statusMutation.mutateAsync({
        participantId: participant.id,
        newStatus: "confirmed"
      });

      toast.success("✓ Participant confirmat și mutat în gestiune");
      
      if (onParticipantUpdated) {
        onParticipantUpdated();
      }

      // Închidem modalul după un scurt delay pentru UX
      setTimeout(() => {
        onClose();
      }, 800);

    } catch (error) {
      console.error("[ERROR] Confirm failed:", error);
      toast.error("Eroare la confirmare");
      setHasConfirmed(false);
      setIsGenerating(false);
    }
  };

  const handleExportParticipant = () => {
  try {
    // Export single participant as beautiful Excel
    exportParticipantsToExcel(
      [participant],
      {
        fileName: `${participant.prenume}_${participant.nume}_${new Date().toISOString().split('T')[0]}.xlsx`,
        sheetName: "Detalii Participant"
      }
    );
    toast.success("✓ Export Excel completat");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Eroare necunoscută";
    toast.error(errorMessage);
  }
};

  const isPF = participant.tip_participant === "Fizica";
  const isPending = participant.status === "pending";
  const registrationDate = new Date(participant.created_at).toLocaleString("ro-RO");
const eventPrice = eventData?.price ? Number(eventData.price) : 0;  
const eventCurrency = eventData?.currency || "RON";
const eventTitle = eventData?.title || "N/A";
const eventLocation = eventData?.location || "Locație nespecificată";


  // ✅ FIXED: Use correct database field names (snake_case)
  const billingFields = isPF
    ? [
        { label: "Nume Complet", value: `${participant.prenume} ${participant.nume}`, id: "full_name" },
        { label: "CNP", value: participant.cnp, id: "cnp" },
        { label: "Adresă", value: participant.adresa_pf, id: "adresa_pf" }, // ✅ snake_case
      ]
    : [
        { label: "Denumire Firmă", value: participant.denumire_societate, id: "denom" }, // ✅ snake_case
        { label: "CUI / CIF", value: participant.cui, id: "cui" },
        { label: "Nr. Reg. Com.", value: participant.registrul_comertului, id: "reg" }, // ✅ snake_case
        { label: "Sediu Social", value: participant.sediu_social, id: "sediu" }, // ✅ snake_case
        { label: "IBAN", value: participant.iban, id: "iban" }, // ✅ This is the database field!
        { label: "Persoană Contact", value: participant.persoana_contact, id: "contact" }, // ✅ snake_case
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[98vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600">📋</span> Detalii Facturare Participant
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-3">
          {participant.nume} {participant.prenume} 
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          
        {/* ROW 1: EVENT & PRICE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-4 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl">
              <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">Eveniment</p>
              {/* ✅ FIX: Afișăm titlul extras corect */}
              <p className="text-base font-bold text-slate-900 dark:text-white">{eventTitle}</p>
              <p className="text-xs text-slate-50">{eventLocation}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex flex-col justify-center">
              <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Total de Plată</p>
              {/* ✅ FIX: Afișăm prețul extras corect */}
              <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{eventPrice.toFixed(2)} {eventCurrency}</p>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
  {/* Registration Date */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
      <span className="text-xs font-black">📅</span>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Înregistrat</p>
      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
        {registrationDate}
      </p>
    </div>
  </div>

  {/* Status Badge */}
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
      isPending
        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
    }`}>
      {isPending ? "⏳" : "✅"}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</p>
      <p className={`text-xs font-bold truncate ${
        isPending
          ? "text-yellow-700 dark:text-yellow-400"
          : "text-emerald-700 dark:text-emerald-400"
      }`}>
        {isPending ? "Așteptând Confirmare" : "Confirmat"}
      </p>
    </div>
  </div>
</div>


             {/* ROW 2: CONTACT DETAILS */}
          <section className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border-2 border-blue-500/20">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
      📞 Detalii Contact 
    </h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {[
      { label: "Titlu", value: participant.gender, id: "gen" },
            { label: "Nume", value: participant.nume, id: "nume" },
      { label: "Prenume", value: participant.prenume, id: "prenume" },
      { label: "Telefon", value: participant.telefon, id: "tel" },
      { label: "Email", value: participant.email, id: "mail" },
      { label: "Specializare", value: participant.specializare, id: "spec" },
    ]
      .map((field) => (
        <div
          key={field.id}
          className="group bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center hover:border-blue-400 transition-all"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{field.label}</p>
            <p className={`text-sm font-bold truncate select-all ${
              field.value ? "text-slate-800 dark:text-slate-100" : "text-slate-400 italic"
            }`}>
              {field.value || "N/A"}
            </p>
          </div>
          {field.value && (
            <button
              onClick={() => copyToClipboard(field.value || "", field.id)}
              className="ml-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-blue-500 hover:text-white transition-all shrink-0"
            >
              {copiedField === field.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      ))}
  </div>
</section>

          {/* ROW 3: BILLING DATA - FIXED */}
          <section className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border-2 border-teal-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isPF ? "👤 Date Facturare Pers. Fizică" : "🏢 Date Facturare Companie"}
              </h3>
              {!isPF && <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded uppercase">Recomandat pt Facturare</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {billingFields.map((field) => (
                <div
                  key={field.id}
                  className="group bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center hover:border-teal-400 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{field.label}</p>
                    <p className={`text-sm font-bold truncate select-all ${
                      field.value ? "text-slate-800 dark:text-slate-100" : "text-slate-400 italic"
                    }`}>
                      {field.value || "N/A"}
                    </p>
                  </div>
                  {field.value && (
                    <button
                      onClick={() => copyToClipboard(field.value || "", field.id)}
                      className="ml-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-teal-500 hover:text-white transition-all shrink-0"
                    >
                      {copiedField === field.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

       
   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Acorduri politici</h3>
          {/* ROW 4: AGREEMENTS */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-2">
            
            {[
              { key: "politica_confidentialitate", label: "GDPR" },
              { key: "termeni_conditii", label: "T&C" },
              { key: "marketing_consent", label: "MKT" },
              { key: "acord_foto_video", label: "Foto" },
              { key: "informare_natura_eveniment", label: "Info" },
            ].map((item) => {
              const val = participant[item.key as keyof typeof participant];
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    val
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {val ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <X className="w-3 h-3 text-slate-400" />
                  )}
                  <span
                    className={`text-[10px] font-bold ${
                      val ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </section>

          {/* ACTION BUTTONS */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-950 pt-4 pb-2 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            {isPending && (
              <button
                onClick={handleConfirmParticipant}
                disabled={isGenerating || hasConfirmed}
                className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-400 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-600/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmă & Generează Factură
                  </>
                )}
              </button>
            )}
            <button
  onClick={handleExportParticipant}
  className="px-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 h-12 rounded-xl font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-center gap-2"
>
  <Download className="w-4 h-4" />
  Export Excel
</button>
{/* <button
  onClick={() => {
    try {
      // This would require passing event participants
      // For now, just export this one with summary
      exportParticipantsWithSummary([participant], participant.event?.title);
      toast.success("✓ Export Excel cu rezumat completat");
    } catch (error) {
      toast.error("Eroare la export");
    }
  }}
  className="px-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 h-12 rounded-xl font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all flex items-center justify-center gap-2"
>
  <Download className="w-4 h-4" />
  Export cu Rezumat
</button> */}
            <button
              onClick={onClose}
              className="px-6 border border-slate-200  h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}