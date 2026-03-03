// src/app/admin/analytics/page.tsx
import { getChartsData } from "@/src/server/actions/charts";
import AnalyticsClient from "@/components/admin/analitycs/AnalyticsClient";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Analytics Pro | Dashboard",
};


export default async function AnalyticsPage() {
  // Preluăm datele pe server pentru o încărcare instantanee (LCP optimizat)
  const result = await getChartsData(30);

  // Type Guard: Gestionăm eroarea înainte de a randa componenta de client
  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 m-10">
        <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Eroare de Sincronizare</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-xs text-center">
          {result.error || "Nu am putut prelua datele de analytics din baza de date."}
        </p>
        <button 
          onClick={() => { /* Server components don't have onClick, we use a simple link or refresh */ }}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Reîncearcă pagina
        </button>
      </div>
    );
  }

  // Dacă succesul este true, TypeScript garantează că result.data există
  return <AnalyticsClient initialData={result.data} />;
}