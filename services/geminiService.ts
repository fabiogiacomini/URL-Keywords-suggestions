import { GoogleGenAI } from "@google/genai";
import { KeywordItem } from "../types";

// Initialize the API client
// Note: In a production environment, API calls should be proxied through a backend 
// to keep the API key secure. For this frontend-only demo, we use process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON from markdown code blocks if Gemini adds them
const cleanAndParseJSON = (text: string): any[] => {
  try {
    let cleanText = text.trim();
    // More robust cleanup for markdown code blocks
    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0];
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0];
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response:", text);
    throw new Error("Errore nel parsing dei dati ricevuti dall'IA.");
  }
};

export const fetchCurrentTrafficKeywords = async (url: string): Promise<KeywordItem[]> => {
  const prompt = `
    Sei un analista SEO tecnico esperto. Il tuo compito è analizzare il dominio: ${url}.

    ISTRUZIONI CRITICHE DI "GROUNDING" (VERIFICA DEL CONTESTO):
    1. Prima di estrarre qualsiasi keyword, usa Google Search per determinare INEQUIVOCABILMENTE il settore di attività di questa azienda specifica.
    2. Cerca attivamente la pagina "Chi siamo" o la "Home" per leggere la mission aziendale (es. se si occupano di GRC, E-commerce, Edilizia, Energia, ecc.).
    3. ATTENZIONE: Evita assolutamente di confondere questa azienda con altre che hanno nomi simili ma operano in settori diversi (es. non confondere un'azienda di consulenza GRC con una compagnia energetica). Basati ESCLUSIVAMENTE sui servizi reali trovati sul sito.

    TASK:
    Una volta identificato con certezza il settore (es. Governance, Risk & Compliance), stima le 20 keyword principali che portano traffico organico qualificato a questo sito.
    
    OUTPUT:
    Devi restituire SOLO un array JSON valido. Non aggiungere testo prima o dopo.
    Il formato JSON deve essere:
    [
      {
        "keyword": "parola chiave reale",
        "metric": "Traffico Stimato (Alto/Medio/Basso)",
        "details": "Motivo rilevanza (es. 'Servizio core identificato in home', 'Blog post su normativa X')"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("Nessuna risposta generata.");
    
    const result = cleanAndParseJSON(text);
    return result;
  } catch (error) {
    console.error("Error fetching current keywords:", error);
    throw error;
  }
};

export const fetchPotentialKeywords = async (url: string): Promise<KeywordItem[]> => {
  const prompt = `
    Agisci come un Senior SEO Strategist specializzato in analisi dei competitor. 
    Sito in analisi: ${url}.

    FASE 1: IDENTIFICAZIONE SETTORE E COMPETITOR
    Usa Google Search per:
    1. Confermare il settore esatto (es. Governance Risk & Compliance, Cybersecurity, Retail, ecc.).
    2. Identificare 2-3 competitor diretti REALI e autorevoli per questo specifico settore.

    FASE 2: GAP ANALYSIS
    Identifica 20 "Keywords ad Alto Potenziale" che i competitor stanno usando o che sono trend emergenti nel settore specifico, ma che questo sito non sta ancora coprendo adeguatamente.
    
    CRITERI:
    - Se il sito è B2B (es. servizi GRC), privilegia keyword transazionali o informative professionali (es. "software gestione rischi", "consulenza iso 27001").
    - Evita keyword troppo generiche o consumer se l'azienda è B2B.
    - Le keyword devono essere opportunità concrete di business.

    OUTPUT:
    Devi restituire SOLO un array JSON valido.
    Il formato JSON deve essere:
    [
      {
        "keyword": "keyword opportunità",
        "metric": "Potenziale (Alto/Molto Alto)",
        "details": "Strategia (es. 'Usata dal competitor X', 'Gap normativo', 'Domanda crescente nel settore')"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("Nessuna risposta generata.");

    const result = cleanAndParseJSON(text);
    return result;
  } catch (error) {
    console.error("Error fetching potential keywords:", error);
    throw error;
  }
};