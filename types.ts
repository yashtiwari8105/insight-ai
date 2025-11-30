export interface KPI {
  label: string;
  value: string | number;
  trend?: string; // e.g., "+5% vs last month"
  trendColor?: 'green' | 'red' | 'neutral';
  icon?: string; // 'dollar', 'users', 'trend', 'activity'
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface ChartConfig {
  id: string;
  title: string;
  description: string;
  type: ChartType;
  dataKey: string; // The key for the Y-axis value
  xAxisKey: string; // The key for the X-axis label
  data: ChartDataPoint[];
  color?: string;
}

export interface AnalysisResult {
  dashboardTitle: string;
  summary: string;
  kpis: KPI[];
  charts: ChartConfig[];
  recommendations: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
