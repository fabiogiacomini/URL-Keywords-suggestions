import { KeywordItem } from '../types';
import * as XLSX from 'xlsx';

export const downloadCSV = (data: KeywordItem[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = ['Keyword', 'Metrica', 'Dettagli'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      // Escape quotes and wrap in quotes to handle commas in text
      const escapedKeyword = `"${item.keyword.replace(/"/g, '""')}"`;
      const escapedMetric = `"${item.metric.replace(/"/g, '""')}"`;
      const escapedDetails = `"${item.details.replace(/"/g, '""')}"`;
      return [escapedKeyword, escapedMetric, escapedDetails].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadExcel = (data: KeywordItem[], filename: string) => {
  if (!data || data.length === 0) return;

  // Format data for Excel (headers match object keys for simplicity, or map them)
  const formattedData = data.map(item => ({
    'Keyword': item.keyword,
    'Metrica': item.metric,
    'Dettagli': item.details
  }));

  // Create a new workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Auto-adjust column width (basic estimation)
  const wscols = [
    { wch: 30 }, // Keyword width
    { wch: 20 }, // Metric width
    { wch: 60 }  // Details width
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Keywords");

  // Generate binary and download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};