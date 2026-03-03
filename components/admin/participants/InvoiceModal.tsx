// src/components/participants/InvoiceModal.tsx (UPDATED)
"use client";

import { X, Download, Send, CheckCircle, Loader2 } from "lucide-react";
import { ParticipantWithEvent } from "@/lib/types/participants";
import { useToastContext } from "@/components/ToastProvider";
import { useState } from "react";

interface InvoiceModalProps {
  participant: ParticipantWithEvent;
  onClose: () => void;
  onMarkAsPaid?: (participantId: string) => Promise<void>;
}

export default function InvoiceModal({
  participant,
  onClose,
  onMarkAsPaid,
}: InvoiceModalProps) {
  const toast = useToastContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMarkAsPaid = async () => {
    try {
      setIsProcessing(true);
      if (onMarkAsPaid) {
        await onMarkAsPaid(participant.id);
        toast.success("✓ Factura confirmată - Status schimbat la Confirmat");
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      toast.error("Eroare la marcare ca plătit");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.info("Descărcare factură în curs...");
    // TODO: Implement invoice PDF generation
  };

  const handleSendInvoice = () => {
    toast.info("Trimiterea facturii în curs...");
    // TODO: Implement email invoice sending
  };

  const invoiceNumber = `INV-${participant.id.slice(0, 8).toUpperCase()}-${new Date().getFullYear()}`;
  const invoiceDate = new Date().toLocaleDateString("ro-RO");
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("ro-RO");

  const isPF = participant.tip_participant === "Fizica";
  const price = participant.event?.price || 0;
  const currency = participant.event?.currency || "RON";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Factură
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {invoiceNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Invoice Header - Bill To */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                De la
              </p>
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">SummitSphere</p>
                <p className="text-slate-600 dark:text-slate-400">contact@summitsphere.com</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Pentru
              </p>
              <div className="text-sm space-y-1">
                {isPF ? (
                  <>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {participant.gender} {participant.prenume} {participant.nume}
                    </p>
                    {participant.cnp && (
                      <p className="text-slate-600 dark:text-slate-400">
                        CNP: {participant.cnp}
                      </p>
                    )}
                    {participant.adresa_pf && (
                      <p className="text-slate-600 dark:text-slate-400">
                        {participant.adresa_pf}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {participant.denumire_societate}
                    </p>
                    {participant.cui && (
                      <p className="text-slate-600 dark:text-slate-400">
                        CUI: {participant.cui}
                      </p>
                    )}
                    {participant.registrul_comertului && (
                      <p className="text-slate-600 dark:text-slate-400">
                        J: {participant.registrul_comertului}
                      </p>
                    )}
                    {participant.sediu_social && (
                      <p className="text-slate-600 dark:text-slate-400">
                        {participant.sediu_social}
                      </p>
                    )}
                    {participant.persoana_contact && (
                      <p className="text-slate-600 dark:text-slate-400">
                        Persoană de contact: {participant.persoana_contact}
                      </p>
                    )}
                  </>
                )}
                <p className="text-slate-600 dark:text-slate-400">{participant.email}</p>
                <p className="text-slate-600 dark:text-slate-400">{participant.telefon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Nr. Factură
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {invoiceNumber}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                Așteptând plată
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Data Facturii
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {invoiceDate}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Data Scadenței
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {dueDate}
            </p>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="col-span-2">Descriere</div>
              <div className="text-right">Cantitate</div>
              <div className="text-right">Total</div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="col-span-2">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {participant.event?.title || "Eveniment"}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  {participant.event?.location}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  {new Date(participant.event?.start_date || "").toLocaleDateString("ro-RO")}
                </p>
              </div>
              <div className="text-right text-slate-900 dark:text-white font-semibold">
                1
              </div>
              <div className="text-right text-slate-900 dark:text-white font-semibold">
                {price.toFixed(2)} {currency}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Total */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="grid grid-cols-4 gap-4 text-right">
            <div className="col-span-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Total
            </div>
            <div className="text-xl font-bold text-[#2D9A8F]">
              {price.toFixed(2)} {currency}
            </div>
          </div>
        </div>

        {/* Bank Details for PJ */}
        {!isPF && participant.iban && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase mb-2">
              Detalii Plată
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              IBAN: {participant.iban}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Descarcă PDF
            </button>
            <button
              onClick={handleSendInvoice}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              Trimite Email
            </button>
            <button
              onClick={handleMarkAsPaid}
              disabled={isProcessing}
              className="px-4 py-2.5 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {isProcessing ? "Se procesează..." : "Confirmă Plată"}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}