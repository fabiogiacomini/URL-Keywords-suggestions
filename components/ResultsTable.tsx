import React, { useState, useRef, useEffect } from 'react';
import { KeywordItem } from '../types';
import { downloadCSV, downloadExcel } from '../utils/csvHelper';

interface ResultsTableProps {
  title: string;
  description: string;
  data: KeywordItem[];
  colorTheme: 'blue' | 'indigo';
  filenamePrefix: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  title, 
  description, 
  data, 
  colorTheme, 
  filenamePrefix 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const themeClasses = {
    blue: {
      header: 'bg-blue-50 text-blue-900',
      badge: 'bg-blue-100 text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      dropdown: 'hover:bg-blue-50 text-blue-700',
    },
    indigo: {
      header: 'bg-indigo-50 text-indigo-900',
      badge: 'bg-indigo-100 text-indigo-800',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      dropdown: 'hover:bg-indigo-50 text-indigo-700',
    }
  };

  const theme = themeClasses[colorTheme];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = (type: 'csv' | 'excel') => {
    const filename = `${filenamePrefix}_keywords_${new Date().toISOString().slice(0, 10)}`;
    if (type === 'csv') {
      downloadCSV(data, filename);
    } else {
      downloadExcel(data, filename);
    }
    setIsMenuOpen(false);
  };

  if (data.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className={`p-6 border-b border-slate-100 ${theme.header}`}>
        <div className="flex justify-between items-start mb-2 relative">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {title}
            <span className={`text-xs px-2 py-0.5 rounded-full ${theme.badge} font-medium`}>
              {data.length} keywords
            </span>
          </h2>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 ${theme.button}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Esporta
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('csv')}
                    className={`block w-full text-left px-4 py-2.5 text-sm text-slate-700 ${theme.dropdown} transition-colors flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                       <polyline points="14 2 14 8 20 8"></polyline>
                       <path d="M16 13H8"></path>
                       <path d="M16 17H8"></path>
                       <path d="M10 9H8"></path>
                    </svg>
                    Scarica CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className={`block w-full text-left px-4 py-2.5 text-sm text-slate-700 ${theme.dropdown} transition-colors flex items-center gap-2 border-t border-slate-50`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                       <line x1="3" y1="9" x2="21" y2="9"></line>
                       <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Scarica Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm opacity-80 max-w-2xl">
          {description}
        </p>
      </div>
      
      <div className="overflow-auto flex-grow">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600 w-1/3">Keyword</th>
              <th className="px-6 py-3 font-semibold text-slate-600 w-1/6">Metrica</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Analisi & Dettagli</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-900">{item.keyword}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {item.metric}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-600">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;