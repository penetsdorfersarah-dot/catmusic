const buffers = { low: null, mid: null, high: null };

async function fetchBuffer(audioContext, range) {
  const response = await fetch(`/api/cat-sound/${range}`);
  if (!response.ok) {
    throw new Error(`Server-Fehler ${response.status} für "${range}"`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

// Lädt alle 3 Sounds parallel, ruft onProgress(loaded, total) nach jedem auf
export async function loadAllSounds(audioContext, onProgress) {
  const ranges = ['low', 'mid', 'high'];
  let loaded = 0;

  await Promise.all(ranges.map(async (range) => {
    buffers[range] = await fetchBuffer(audioContext, range);
    loaded++;
    onProgress?.(loaded, ranges.length);
  }));
}

export function getBuffer(range) {
  return buffers[range];
}
