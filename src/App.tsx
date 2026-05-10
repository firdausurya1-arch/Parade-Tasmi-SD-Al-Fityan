/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, Grid, ZoomIn, ZoomOut, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QURAN_SURAH_LIST, MIN_ZOOM, MAX_ZOOM } from './constants';
import { QuranState } from './types';
import Reader from './components/Reader';

export default function App() {
  const [state, setState] = useState<QuranState>({
    currentSurahId: null,
    zoomLevel: 1.5,
    view: 'home',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSurahSelect = (id: number) => {
    setState((prev) => ({ ...prev, currentSurahId: id, view: 'reader' }));
    setIsSidebarOpen(false);
  };

  const handleNavigate = (direction: 'next' | 'prev') => {
    const currentIndex = QURAN_SURAH_LIST.findIndex(s => s.id === state.currentSurahId);
    if (direction === 'next' && currentIndex < QURAN_SURAH_LIST.length - 1) {
      setState(prev => ({ ...prev, currentSurahId: QURAN_SURAH_LIST[currentIndex + 1].id }));
    } else if (direction === 'prev' && currentIndex > 0) {
      setState(prev => ({ ...prev, currentSurahId: QURAN_SURAH_LIST[currentIndex - 1].id }));
    }
  };

  const handleGoHome = () => {
    setState((prev) => ({ ...prev, currentSurahId: null, view: 'home' }));
    setIsSidebarOpen(false);
  };

  const handleZoom = (delta: number) => {
    setState((prev) => ({
      ...prev,
      zoomLevel: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoomLevel + delta)),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-100 italic-none">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-amber-50 rounded-full transition-colors"
            id="menu-button"
          >
            <Menu className="w-6 h-6 text-amber-800" />
          </button>
          <button 
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Home className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-amber-900 hidden sm:block">Al-Mushaf</h1>
          </button>
        </div>

        {state.view === 'reader' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-amber-50 rounded-full px-3 py-1 border border-amber-200">
              <button 
                onClick={() => handleZoom(-0.1)}
                className="p-1 hover:bg-amber-100 rounded-full text-amber-800"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="mx-2 text-sm font-medium text-amber-900 w-12 text-center">
                {Math.round(state.zoomLevel * 100)}%
              </span>
              <button 
                onClick={() => handleZoom(0.1)}
                className="p-1 hover:bg-amber-100 rounded-full text-amber-800"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {state.view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto p-6 space-y-8"
            >
              <div className="mb-8 text-center relative pt-12 sm:pt-0">
                <h2 className="text-3xl font-bold text-amber-900 mb-2 whitespace-pre-line">
                  Selamat Datang di Parade Tasmi'{"\n"}
                  SD Al Fityan School Tangerang
                </h2>
                <p className="text-amber-700 font-medium">Tahun Pelajaran 2025/2026</p>
                <div className="mt-4 w-24 h-1 bg-amber-200 mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QURAN_SURAH_LIST.map((surah) => (
                  <button
                    key={surah.id}
                    onClick={() => handleSurahSelect(surah.id)}
                    className="flex items-center justify-between p-5 bg-white border border-amber-100 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-left"
                    id={`surah-${surah.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700 font-bold border border-amber-100">
                        {surah.id}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{surah.transliteration}</h3>
                        <p className="text-sm text-gray-500 italic">Surat ke-{surah.id}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </button>
                ))}
              </div>

              {/* Download Instructions */}
              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-dashed border-amber-200">
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  💾 Cara Jalankan Offline di PC (Anti Layar Putih)
                </h3>
                <div className="text-sm text-amber-800 space-y-3">
                  <p>Ikuti langkah ini agar aplikasi lancar di Laptop/PC Anda (Offline):</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Klik <strong>Settings</strong> (ikon gir) di kiri bawah panel ini.</li>
                    <li>Pilih <strong>Export to ZIP</strong> dan simpan di folder PC Anda.</li>
                    <li>Ekstrak ZIP-nya, lalu buka folder tersebut di <strong>Command Prompt (Run as Administrator)</strong>.</li>
                    <li>Ketik: <code className="bg-amber-100 px-2 py-1 rounded text-red-600 font-mono font-bold">npm install</code> (tunggu sampai selesai).</li>
                    <li>Ketik: <code className="bg-amber-100 px-2 py-1 rounded text-red-600 font-mono font-bold">npm run build:exe</code></li>
                  </ol>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200 text-[11px] leading-relaxed">
                    <strong>PENTING:</strong> File aplikasi .exe akan muncul di folder <strong>release</strong> setelah proses selesai.
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <Reader 
                surahId={state.currentSurahId!} 
                zoomLevel={state.zoomLevel} 
                onNavigate={handleNavigate}
                hasPrev={QURAN_SURAH_LIST.findIndex(s => s.id === state.currentSurahId) > 0}
                hasNext={QURAN_SURAH_LIST.findIndex(s => s.id === state.currentSurahId) < QURAN_SURAH_LIST.length - 1}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar Shortcut Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] flex flex-col"
              id="sidebar"
            >
              <div className="p-5 border-b border-amber-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <Grid className="w-5 h-5" /> Daftar Surat
                </h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 hover:bg-amber-50 rounded-full"
                >
                  <X className="w-6 h-6 text-amber-800" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid gap-1">
                  <button
                    onClick={handleGoHome}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 text-amber-900 font-medium transition-colors"
                  >
                    <Home className="w-5 h-5" /> Beranda
                  </button>
                  <div className="h-px bg-amber-50 my-2" />
                  {QURAN_SURAH_LIST.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => handleSurahSelect(surah.id)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                        state.currentSurahId === surah.id
                          ? 'bg-amber-600 text-white'
                          : 'hover:bg-amber-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono opacity-60 w-5">
                          {surah.id}
                        </span>
                        <span className="font-medium">{surah.transliteration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
