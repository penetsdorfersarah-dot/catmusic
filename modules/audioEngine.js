import { getBuffer } from './catSounds.js';

let audioContext = null;

// Aktive Gain-Nodes für Sustain-Pedal
const sustainedNodes = new Set();

export function initAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}

export function getAudioContext() {
  return audioContext;
}

export function playNote(note, isSustaining) {
  if (!audioContext) return;

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const buffer = getBuffer(note.range);
  if (!buffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = note.freq / note.baseFreq;

  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  gain.gain.setValueAtTime(0.9, now);

  if (isSustaining) {
    // Ton hält — wird erst beim Loslassen der Leertaste gefadet
    sustainedNodes.add({ gain, source });
  } else {
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    source.stop(now + 1.8);
  }

  source.connect(gain);
  gain.connect(audioContext.destination);
  source.start(now);
}

// Leertaste losgelassen: alle gehaltenen Töne ausblenden
export function releaseSustain() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  sustainedNodes.forEach(({ gain, source }) => {
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    source.stop(now + 1.2);
  });
  sustainedNodes.clear();
}
