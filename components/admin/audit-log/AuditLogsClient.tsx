"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  user_email: string;
  resource: string;
  resource_id: string;
  details: Record<string, any>;
  severity: "info" | "warning" | "error";
  created_at: string;
}

interface AuditLogsClientProps {
  initialLogs: AuditLog[];
}

const ITEMS_PER_PAGE = 10;

const ACTION_LABELS: Record<string, string> = {
  "PARTICIPANT_REGISTERED": "Înregistrare Participant",
  "PARTICIPANT_CONFIRMED": "Confirmare Participant",
  "PARTICIPANT_STATUS_CHANGED": "Schimbare Status Participant",
  "PARTICIPANT_DELETED": "Ștergere Participant",
  "PARTICIPANTS_BULK_STATUS_CHANGED": "Modificare Status în Masă",
  "PARTICIPANTS_EXPORTED": "Export Participanți",
  "PARTICIPANTS_LIST_VIEWED": "Vizualizare Listă Participanți",
  "AUDIT_LOGS_VIEWED": "Accesare Jurnal Audit",
  "EVENT_CREATED": "Creare Eveniment",
  "EVENT_UPDATED": "Actualizare Eveniment",
  "EVENT_DELETED": "Ștergere Eveniment",
  "EVENT_STATUS_CHANGED": "Schimbare Status Eveniment",
  "EVENT_STATS_VIEWED": "Vizualizare Statistici Eveniment",
  "EVENT_DELETE_REJECTED": "Tentativă Ștergere Blocată"
};

const ALL_ACTIONS = Object.keys(ACTION_LABELS);

export default function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
  const router = useRouter();
  
  // State-uri pentru UI
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Funcție pentru reîmprospătarea datelor de pe server
  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    // Simulăm un mic delay pentru feedback vizual
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Statistici calculate din datele primite
  const stats = useMemo(() => {
    return {
      total: initialLogs.length,
      info: initialLogs.filter(l => l.severity === "info").length,
      warning: initialLogs.filter(l => l.severity === "warning").length,
      error: initialLogs.filter(l => l.severity === "error").length,
    };
  }, [initialLogs]);

  // Logica de filtrare
  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        log.user_email?.toLowerCase().includes(searchStr) ||
        log.action?.toLowerCase().includes(searchStr) ||
        log.resource_id?.toLowerCase().includes(searchStr) ||
        JSON.stringify(log.details).toLowerCase().includes(searchStr);

      const matchesAction = !actionFilter || log.action === actionFilter;
      const matchesSeverity = !severityFilter || log.severity === severityFilter;

      return matchesSearch && matchesAction && matchesSeverity;
    });
  }, [initialLogs, searchTerm, actionFilter, severityFilter]);

  // Paginație
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "error": return "bg-red-100 text-red-700 border-red-200";
      case "warning": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* BUTON REFRESH & STATS */}
      <div className="flex justify-end">
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Se încarcă..." : "Actualizează"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} color="slate" />
        <StatCard title="Info" value={stats.info} color="emerald" icon="ℹ️" />
        <StatCard title="Avertizări" value={stats.warning} color="amber" icon="⚠️" />
        <StatCard title="Erori" value={stats.error} color="red" icon="🚨" />
      </div>

      {/* FILTRE */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Caută în detalii sau email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset la prima pagina la cautare
            }}
          />
        </div>
        <select 
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-medium text-sm"
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Toate Acțiunile</option>
          {ALL_ACTIONS.map(action => (
            <option key={action} value={action}>{ACTION_LABELS[action] || action}</option>
          ))}
        </select>
        <select 
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-medium text-sm"
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Severitate</option>
          <option value="info">Info</option>
          <option value="warning">Avertisment</option>
          <option value="error">Eroare</option>
        </select>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dată & Oră</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Acțiune</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Administrator</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Detalii</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {new Date(log.created_at).toLocaleString('ro-RO')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getSeverityStyle(log.severity)}`}>
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {log.user_email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedLog(log)} 
                        className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">Nicio înregistrare găsită</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINAȚIE */}
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Pagina {currentPage} / {totalPages || 1}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 disabled:opacity-20 border rounded-xl bg-white hover:shadow-sm transition-all"
            ><ChevronLeft className="w-4 h-4" /></button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 disabled:opacity-20 border rounded-xl bg-white hover:shadow-sm transition-all"
            ><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* MODAL DETALII */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 space-y-6 relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Detaliu Jurnal Audit</h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              ><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Efectuat de</p>
                <p className="font-bold text-slate-700 break-all">{selectedLog.user_email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Resursă Vizată</p>
                <p className="font-bold text-slate-700">{selectedLog.resource.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-black uppercase">Payload Detaliat (JSON)</p>
              <div className="bg-slate-900 text-emerald-400 p-6 rounded-2xl font-mono text-xs overflow-auto max-h-72 shadow-inner border border-slate-800">
                <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
              </div>
            </div>

            <button 
              onClick={() => setSelectedLog(null)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >Închide</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon = "" }: { title: string, value: number, color: string, icon?: string }) {
  const styles: Record<string, string> = {
    slate: "bg-white border-slate-100 text-slate-900",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    red: "bg-red-50 border-red-100 text-red-700",
  };
  
  return (
    <div className={`p-5 rounded-2xl border transition-all hover:shadow-md ${styles[color]}`}>
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{title}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-3xl font-black mt-1 leading-none">{value}</p>
    </div>
  );
}