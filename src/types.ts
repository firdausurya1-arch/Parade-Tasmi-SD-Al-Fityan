export interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  verses_count: number;
  revelation_place: string;
}

export interface QuranState {
  currentSurahId: number | null;
  zoomLevel: number;
  view: 'home' | 'reader';
}
