const BASE_FREQ = 261.63; // C4

let ctx = null;
let catBuffer = null;
const sustainedNodes = new Set();

export function initAudio() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function setBuffer(buffer) {
  catBuffer = buffer;
}

export function playNote(freq, sustain) {
  if (!ctx || !catBuffer) return;
  if (ctx.state === 'suspended') ctx.resume();

  const source = ctx.createBufferSource();
  source.buffer = catBuffer;
  source.playbackRate.value = freq / BASE_FREQ;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.9, now);

  if (sustain) {
    sustainedNodes.add({ gain, source });
  } else {
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    source.stop(now + 1.8);
  }

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
}

export function releaseSustain() {
  if (!ctx) return;
  const now = ctx.currentTime;
  sustainedNodes.forEach(({ gain, source }) => {
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    source.stop(now + 1.2);
  });
  sustainedNodes.clear();
}
