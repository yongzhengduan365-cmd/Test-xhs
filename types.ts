export interface TestConfig {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  color: string;
  questionCount: number;
}

export interface Question {
  id: number;
  text: string;
  dimension: string; // The specific personality dimension this question measures
  options: {
    label: string;
    value: number | string;
    score?: number; // Optional specific score weight
  }[];
}

export interface ChartDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export interface AnalysisResult {
  mainArchetype: string;
  secondaryArchetype: string; // New: Secondary trait
  shortQuote: string;
  detailedAnalysis: string; // Markdown supported
  personalityTraits: string[];
  radarChart: ChartDataPoint[];
  lifeAspects: {
    work: string;
    love: string;
    social: string;
    growth: string;
  };
}

export enum AppState {
  HOME = 'HOME',
  INTRO = 'INTRO',
  TESTING = 'TESTING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}