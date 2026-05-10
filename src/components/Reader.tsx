import { useState, useEffect, useRef } from 'react';
import { fetchSurahVerses, fetchSurahInfo } from '../services/quranService';
import { Verse, Surah } from '../types';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ReaderProps {
  surahId: number;
  zoomLevel: number;
  onNavigate?: (direction: 'next' | 'prev') => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function Reader({ surahId, zoomLevel, onNavigate, hasNext, hasPrev }: ReaderProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [info, setInfo] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSurah = async () => {
      setLoading(true);
      setError(null);
      try {
        const [versesData, infoData] = await Promise.all([
          fetchSurahVerses(surahId),
          fetchSurahInfo(surahId),
        ]);
        setVerses(versesData);
        setInfo(infoData);
        // Reset scroll
        if (containerRef.current) containerRef.current.scrollTop = 0;
      } catch (err) {
        setError('Gagal memuat surat. Pastikan koneksi internet aktif.');
      } finally {
        setLoading(false);
      }
    };
    loadSurah();
  }, [surahId]);

  // Calculate line height and screen height based on zoom
  const baseFontSize = 24; // Base pixel size for zoom Level 1
  const fontSize = baseFontSize * zoomLevel;
  const lineHeight = 2.4; // Spacious line height
  const unitLineHeight = fontSize * lineHeight;
  const viewHeight = unitLineHeight * 5 + 32; // 5 lines + some padding

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-amber-800 gap-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-medium">Memuat Ayat...</p>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-900 font-bold mb-2">Terjadi Kesalahan</p>
        <p className="text-gray-500 max-w-xs">{error || 'Data surat tidak ditemukan'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-full font-bold shadow-md hover:bg-amber-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fdfcf7] relative overflow-hidden">
      {/* Surah Header in-reader */}
      <div className="bg-white border-b border-amber-50 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1">
             <button
                disabled={!hasPrev}
                onClick={() => onNavigate?.('prev')}
                className="p-2 hover:bg-amber-50 disabled:opacity-30 rounded-xl transition-all"
             >
                <ChevronLeft className="w-6 h-6 text-amber-800" />
             </button>
             <button
                disabled={!hasNext}
                onClick={() => onNavigate?.('next')}
                className="p-2 hover:bg-amber-50 disabled:opacity-30 rounded-xl transition-all"
             >
                <ChevronRight className="w-6 h-6 text-amber-800" />
             </button>
           </div>
           <div className="text-right">
             <p className="text-amber-600 font-mono text-xs leading-none mb-1">Surat {info.id}</p>
             <h2 className="text-xl font-bold text-amber-900">{info.transliteration}</h2>
           </div>
        </div>
        <div className="text-3xl font-quran text-amber-950 font-bold" dir="rtl">
          {info.name}
        </div>
      </div>

      {/* Fixed Height Perspective (5 Lines Viewport) */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div 
          className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden relative"
          style={{ 
            height: `${viewHeight}px`, 
            width: '100%',
            maxWidth: '1600px'
          }}
        >
          {/* Reader Scroll Container */}
          <div 
            ref={containerRef}
            className="h-full overflow-y-auto overflow-x-hidden pb-32"
          >
            <div 
              className="mx-auto relative px-8"
              style={{ 
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                paddingTop: '1rem',
              }}
            >
              {/* Bismillah */}
              {surahId !== 1 && surahId !== 9 && (
                <div className="text-center mb-8 flex flex-col items-center gap-4">
                   <p className="font-quran leading-relaxed text-amber-950 text-4xl" dir="rtl">
                     بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                   </p>
                   <div className="w-1/2 h-px bg-amber-100" />
                </div>
              )}

              <div 
                className="mushaf-text font-quran text-amber-950 select-none pb-40" 
                dir="rtl"
                style={{ 
                  textAlign: 'justify',
                  textAlignLast: 'center',
                }}
              >
                {verses.map((verse) => (
                  <span key={verse.id} className="inline-block mb-4">
                    <span className="inline leading-[2.8]">
                       {verse.text_uthmani}
                    </span>
                    <span 
                      className="inline-flex items-center justify-center min-w-[1.6em] h-[1.6em] rounded-full border-2 border-amber-600 text-[0.45em] mx-1 align-middle font-mono font-black text-amber-950 bg-amber-50 shadow-sm"
                      style={{ 
                        transform: 'translateY(-0.2em)'
                      }}
                    >
                      {verse.verse_number}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
