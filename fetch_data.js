import fs from 'fs';
import fetch from 'node-fetch';

const surahIds = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 77];
const data = {};

async function fetchData() {
  for (const id of surahIds) {
    console.log(`Fetching surah ${id}...`);
    const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`);
    const json = await res.json();
    data[id] = json.verses;

    const infoRes = await fetch(`https://api.quran.com/api/v4/chapters/${id}?language=id`);
    const infoJson = await infoRes.json();
    data[`info_${id}`] = infoJson.chapter;
  }

  fs.writeFileSync('./src/data/quran_offline.json', JSON.stringify(data, null, 2));
  console.log('Done!');
}

fetchData();
