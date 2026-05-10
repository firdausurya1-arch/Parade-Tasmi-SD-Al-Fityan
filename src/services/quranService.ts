import { Verse, Surah } from '../types';
import quranOfflineData from '../data/quran_offline.json';

const BASE_URL = 'https://api.quran.com/api/v4';

const offlineData = quranOfflineData as any;

export const fetchSurahVerses = async (surahId: number): Promise<Verse[]> => {
  // Try offline first
  if (offlineData[surahId]) {
    return offlineData[surahId].map((v: any) => ({
      ...v,
      verse_number: v.verse_number || parseInt(v.verse_key.split(':')[1])
    }));
  }

  try {
    const response = await fetch(
      `${BASE_URL}/quran/verses/uthmani?chapter_number=${surahId}`
    );
    if (!response.ok) throw new Error('Failed to fetch verses');
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
};

export const fetchSurahInfo = async (surahId: number): Promise<Surah | null> => {
  // Try offline first
  if (offlineData[`info_${surahId}`]) {
    const data = offlineData[`info_${surahId}`];
    return {
      id: data.id,
      name: data.name_arabic,
      transliteration: data.name_simple,
      verses_count: data.verses_count,
      revelation_place: data.revelation_place,
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/chapters/${surahId}?language=id`);
    if (!response.ok) throw new Error('Failed to fetch surah info');
    const data = await response.json();
    return {
      id: data.chapter.id,
      name: data.chapter.name_arabic,
      transliteration: data.chapter.name_simple,
      verses_count: data.chapter.verses_count,
      revelation_place: data.chapter.revelation_place,
    };
  } catch (error) {
    console.error('Error fetching surah info:', error);
    return null;
  }
};
