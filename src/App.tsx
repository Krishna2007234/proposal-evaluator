import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Send, Lightbulb, Target, ShieldAlert, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [idea, setIdea] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEvaluate = async () => {
    if (!idea.trim()) return;
    
    setIsLoading(true);
    setError('');
    setAnalysis('');

    try {
      const prompt = `
        You are an expert business analyst and strategist. Evaluate the following business proposal.
        
        Business Idea:
        "${idea}"
        
        Please provide a comprehensive evaluation structured with the following sections:
        
        ## 1. Executive Summary
        A brief overview of the idea and its potential.
        
        ## 2. SWOT Analysis
        *   **Strengths:** Internal advantages.
        *   **Weaknesses:** Internal disadvantages.
        *   **Opportunities:** External factors that could be exploited.
        *   **Threats:** External factors that could cause trouble.
        
        ## 3. Risk Assessment
        Identify key risks (market, financial, operational, etc.) and their potential impact.
        
        ## 4. Strategic Suggestions
        Actionable recommendations to improve the proposal, mitigate risks, and increase the chances of success.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'No analysis generated.');
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate the proposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans text-neutral-900">
      {/* Left Panel: Input */}
      <div className="w-full md:w-1/3 lg:w-2/5 p-8 md:p-12 border-r border-neutral-200 bg-white flex flex-col h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Lightbulb size={20} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Proposal Evaluator</h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Describe your business idea, and our AI will provide a comprehensive SWOT analysis, risk assessment, and strategic suggestions.
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <label htmlFor="idea" className="block text-sm font-medium text-neutral-700 mb-2">
            Business Idea Description
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A subscription box service for eco-friendly pet toys..."
            className="w-full flex-1 p-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-neutral-800 placeholder:text-neutral-400"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleEvaluate}
            disabled={isLoading || !idea.trim()}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Send size={18} />
                Evaluate Proposal
              </>
            )}
          </button>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>

      {/* Right Panel: Output */}
      <div className="w-full md:w-2/3 lg:w-3/5 bg-neutral-50 h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          {!analysis && !isLoading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-12 text-center text-neutral-400"
            >
              <div className="grid grid-cols-2 gap-6 max-w-md">
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col items-center gap-3">
                  <Target className="text-indigo-400" size={24} />
                  <span className="text-sm font-medium text-neutral-600">SWOT Analysis</span>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col items-center gap-3">
                  <ShieldAlert className="text-rose-400" size={24} />
                  <span className="text-sm font-medium text-neutral-600">Risk Assessment</span>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col items-center gap-3 col-span-2">
                  <TrendingUp className="text-emerald-400" size={24} />
                  <span className="text-sm font-medium text-neutral-600">Strategic Suggestions</span>
                </div>
              </div>
              <p className="mt-8 text-sm">Enter your business idea to generate a comprehensive evaluation.</p>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-12"
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-4 rounded-full border-b-2 border-indigo-200 animate-spin" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lightbulb className="text-indigo-600 animate-pulse" size={24} />
                </div>
              </div>
              <p className="mt-6 text-neutral-500 font-medium animate-pulse">Analyzing your proposal...</p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-10 prose prose-neutral prose-indigo max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-neutral-100
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-neutral-600 prose-p:leading-relaxed
                prose-li:text-neutral-600 prose-li:marker:text-indigo-500
                prose-strong:text-neutral-900 prose-strong:font-semibold
                first:prose-h2:mt-0"
              >
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
