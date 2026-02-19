/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Image as ImageIcon, Loader2, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchImages } from './services/gemini';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';

interface SearchResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export default function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await searchImages(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-bottom border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">SmartSearch</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-neutral-500">
            <span className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Powered by Gemini
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-display font-bold text-neutral-900 mb-6 tracking-tight"
          >
            Find the perfect <span className="text-indigo-600">visuals</span> <br />
            with AI-powered search.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
          >
            Describe what you're looking for in plain English. Our AI understands context and finds relevant sources across the web.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., minimalist architectural photography of desert homes..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-neutral-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-neutral-500 font-medium animate-pulse">Analyzing your request...</p>
            </motion.div>
          ) : result ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
                  <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    AI Insights
                  </h2>
                  <div className="prose prose-neutral max-w-none">
                    <Markdown>{result.text}</Markdown>
                  </div>
                </section>
              </div>

              {/* Sidebar / Sources */}
              <div className="space-y-6">
                <section className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                  <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Sources & References</h2>
                  <div className="space-y-3">
                    {result.sources.length > 0 ? (
                      result.sources.map((source, i) => (
                        <a 
                          key={i}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all group"
                        >
                          <div className="mt-1 p-1.5 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{source.title}</p>
                            <p className="text-xs text-neutral-500 truncate">{new URL(source.uri).hostname}</p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500 italic">No direct sources found.</p>
                    )}
                  </div>
                </section>

                <section className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
                  <h3 className="font-display font-bold text-lg mb-2">Pro Tip</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    Try adding specific styles like "cinematic lighting", "macro", or "vintage film" to get more precise results.
                  </p>
                  <button className="mt-4 flex items-center gap-2 text-sm font-bold group">
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-neutral-200 rounded-[40px]"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Ready to search?</h3>
              <p className="text-neutral-500 max-w-xs mx-auto">
                Enter a description above to start exploring smart image insights.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <ImageIcon className="w-5 h-5" />
            <span className="font-display font-bold">SmartSearch</span>
          </div>
          <p className="text-sm text-neutral-400">
            © 2024 Smart Image Search App. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-neutral-400 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-indigo-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
