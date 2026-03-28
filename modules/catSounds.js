export async function loadCatSound(audioCtx) {
  const res = await fetch('/api/cat-sound');
  if (!res.ok) throw new Error(`Server-Fehler ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return audioCtx.decodeAudioData(arrayBuffer);
}
