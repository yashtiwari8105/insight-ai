import React, { useState } from 'react';
import { Sparkles, BarChart2, FileText, RefreshCcw, Loader2, Zap, ArrowRight, BrainCircuit } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ChartRenderer from './components/ChartRenderer';
import KPICard from './components/KPICard';
import { analyzeCsvData } from './services/geminiService';
import { AppState, AnalysisResult } from './types';
import { MAX_ROWS_FOR_ANALYSIS } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (csvText: string, fileName: string) => {
    setAppState(AppState.PARSING);
    setErrorMsg(null);
    
    // Simple truncation for safety
    const lines = csvText.split('\n');
    let processedCsv = csvText;
    
    if (lines.length > MAX_ROWS_FOR_ANALYSIS) {
      processedCsv = lines.slice(0, MAX_ROWS_FOR_ANALYSIS).join('\n');
    }

    setAppState(AppState.ANALYZING);

    try {
      const result = await analyzeCsvData(processedCsv);
      setAnalysis(result);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to analyze data. Please try a different file.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysis(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30 selection:text-blue-100">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                 <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Insight<span className="text-blue-400">AI</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Intelligence Module</p>
              </div>
            </div>
            {appState === AppState.COMPLETE && (
              <button 
                onClick={handleReset}
                className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                New Analysis
              </button>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* State: IDLE - Upload Section */}
          {appState === AppState.IDLE && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
              <div className="text-center mb-12 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3 h-3" />
                  Next Gen Analytics
                </div>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight text-glow">
                  Unleash your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Data Potential</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Drop your CSV file into our neural engine. We'll identify patterns, visualize trends, and generate strategic insights in seconds.
                </p>
              </div>
              
              <FileUpload onFileSelect={handleFileSelect} />
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 px-4">
                {[
                  { icon: BarChart2, title: "Visual Synthesis", desc: "Auto-generated charts that adapt to your data's narrative." },
                  { icon: Zap, title: "Instant Insights", desc: "AI-driven detection of anomalies and growth opportunities." },
                  { icon: FileText, title: "Strategic Briefs", desc: "Executive summaries written in plain, actionable language." }
                ].map((feature, idx) => (
                  <div key={idx} className="glass-panel p-8 rounded-2xl hover:bg-slate-800/50 transition-colors">
                    <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* State: LOADING */}
          {(appState === AppState.PARSING || appState === AppState.ANALYZING) && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                  <div className="font-mono text-xs text-blue-400/70">PROCESSING_NODE_01</div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                {appState === AppState.PARSING ? "Ingesting Data Stream..." : "Neural Analysis in Progress..."}
              </h3>
              <p className="text-slate-400 max-w-md text-center">
                Deconstructing rows, identifying correlations, and formulating strategy. Stand by.
              </p>
            </div>
          )}

          {/* State: ERROR */}
          {appState === AppState.ERROR && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in-up">
               <div className="glass-panel p-10 rounded-3xl border-red-500/30 text-center max-w-md relative overflow-hidden">
                 <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                 <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="text-3xl">⚠️</span>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">Analysis Failed</h3>
                 <p className="text-slate-400 mb-8">{errorMsg}</p>
                 <button 
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-red-900/20"
                 >
                   Retry Operation
                 </button>
               </div>
             </div>
          )}

          {/* State: COMPLETE - Dashboard */}
          {appState === AppState.COMPLETE && analysis && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Dashboard Title & Meta */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Analysis Complete
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{analysis.dashboardTitle}</h2>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 1. Executive Summary (Top Left - Spans 8 cols) */}
                <div className="md:col-span-8 glass-panel rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText className="w-32 h-32 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Strategic Briefing
                  </h3>
                  <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line font-light">
                    {analysis.summary}
                  </div>
                </div>

                {/* 2. KPIs (Top Right - Spans 4 cols - Vertical Stack or Grid) */}
                <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                  {analysis.kpis.map((kpi, index) => (
                    <div key={index} className="delay-100 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                       <KPICard kpi={kpi} />
                    </div>
                  ))}
                </div>

                {/* 3. Charts (Middle - Grid) */}
                {analysis.charts.map((chart, index) => (
                  <div 
                    key={chart.id} 
                    className={`min-h-[400px] ${index === 0 ? 'md:col-span-8' : 'md:col-span-4'} animate-fade-in-up`}
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                  >
                     <ChartRenderer config={chart} index={index} />
                  </div>
                ))}

                {/* 4. Recommendations (Bottom - Full Width) */}
                <div className="md:col-span-12 mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-amber-400" />
                    Recommended Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {analysis.recommendations.map((rec, idx) => (
                      <div 
                        key={idx} 
                        className="gradient-border bg-slate-900/50 p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-sm font-bold text-slate-400 font-mono border border-white/10">
                            0{idx + 1}
                          </span>
                          <div>
                            <p className="text-slate-200 font-medium leading-relaxed">{rec}</p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider group cursor-pointer">
                              Initialize Action <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;