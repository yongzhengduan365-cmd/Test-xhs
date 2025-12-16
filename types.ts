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
  options: {
    label: string;
    value: number | string;
  }[];
}

export interface ChartDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export interface AnalysisResult {
  mainArchetype: string;
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
  TESTING = 'TESTING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}
