export interface KeywordItem {
  keyword: string;
  metric: string; // For current: "Estimated Traffic", For potential: "Opportunity Score"
  details: string; // Context or reason
}

export interface AnalysisResult {
  currentKeywords: KeywordItem[];
  potentialKeywords: KeywordItem[];
}

export enum AnalysisState {
  IDLE = 'IDLE',
  ANALYZING_CURRENT = 'ANALYZING_CURRENT',
  ANALYZING_POTENTIAL = 'ANALYZING_POTENTIAL',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}