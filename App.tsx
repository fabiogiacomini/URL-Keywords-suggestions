import React, { useState } from 'react';
import { AnalysisState, KeywordItem } from './types';
import { fetchCurrentTrafficKeywords, fetchPotentialKeywords } from './services/geminiService';
import ResultsTable from './components/ResultsTable';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [currentKeywords, setCurrentKeywords] = useState<KeywordItem[]>([]);
  const [potentialKeywords, setPotentialKeywords] = useState<KeywordItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setState(AnalysisState.ANALYZING_CURRENT);
    setError(null);
    setCurrentKeywords([]);
    setPotentialKeywords([]);

    try {
      // Step 1: Fetch Current Traffic Keywords
      const currentData = await fetchCurrentTrafficKeywords(formattedUrl);
      setCurrentKeywords(currentData);

      // Step 2: Fetch Potential Keywords
      setState(AnalysisState.ANALYZING_POTENTIAL);
      const potentialData = await fetchPotentialKeywords(formattedUrl);
      setPotentialKeywords(potentialData);

      setState(AnalysisState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("Si è verificato un errore durante l'analisi. Assicurati che l'URL sia corretto e riprova.");
      setState(AnalysisState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sticky Header/Input */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SEO Insight Pro</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full md:max-w-xl gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Inserisci URL (es. apple.com)"
                className="flex-grow rounded-lg border-slate-300 border px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all shadow-sm"
                disabled={state === AnalysisState.ANALYZING_CURRENT || state === AnalysisState.ANALYZING_POTENTIAL}
              />
              <button
                type="submit"
                disabled={state === AnalysisState.ANALYZING_CURRENT || state === AnalysisState.ANALYZING_POTENTIAL || !url}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-all shadow-sm flex items-center gap-2 ${
                  state === AnalysisState.ANALYZING_CURRENT || state === AnalysisState.ANALYZING_POTENTIAL || !url
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 hover:shadow-md'
                }`}
              >
                {state === AnalysisState.ANALYZING_CURRENT || state === AnalysisState.ANALYZING_POTENTIAL ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analisi in corso...
                  </>
                ) : (
                  'Analizza'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {state === AnalysisState.IDLE && (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
               </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Inizia la tua analisi SEO</h2>
            <p className="text-slate-500 max-w-md mx-auto">Inserisci l'URL di un sito web per scoprire le keyword che portano traffico e le opportunità nascoste rispetto ai competitor.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {/* Progress Status */}
        {(state === AnalysisState.ANALYZING_CURRENT || state === AnalysisState.ANALYZING_POTENTIAL) && (
          <div className="mb-8 space-y-4">
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 animate-pulse">
                <p className="text-brand-700 font-medium flex items-center gap-2">
                   {state === AnalysisState.ANALYZING_CURRENT 
                     ? "1/2 Analisi del traffico attuale tramite Google Search..." 
                     : "2/2 Analisi competitor e gap di mercato in corso..."}
                </p>
             </div>
          </div>
        )}

        <div className="space-y-12">
          {/* Section 1: Current Traffic */}
          {(currentKeywords.length > 0 || state === AnalysisState.ANALYZING_POTENTIAL || state === AnalysisState.COMPLETE) && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResultsTable 
                title="Top Keywords Attuali" 
                description="Le 20 parole chiave che stimiamo stiano portando il maggior volume di traffico organico al sito, basate sui risultati di ricerca attuali."
                data={currentKeywords}
                colorTheme="blue"
                filenamePrefix="current_traffic"
              />
            </section>
          )}

          {/* Section 2: Potential Keywords */}
          {(state === AnalysisState.COMPLETE && potentialKeywords.length > 0) && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <ResultsTable 
                title="Opportunità ad Alto Potenziale" 
                description="Keywords strategiche utilizzate dai competitor o rilevanti per il settore che questo sito non sta ancora intercettando efficacemente."
                data={potentialKeywords}
                colorTheme="indigo"
                filenamePrefix="potential_opportunities"
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;