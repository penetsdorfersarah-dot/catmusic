import { KEY_MAP } from './modules/keyboardMap.js';
import { renderPiano, highlightKey } from './modules/piano.js';
import { initAudio, setBuffer, playNote, releaseSustain } from './modules/audioEngine.js';
import { loadCatSound } from './modules/catSounds.js';
import { triggerReaction, spawnPaw } from './modules/catAnimation.js';

const statusEl      = document.getElementById('status');
const currentNoteEl = document.getElementById('current-note');
const pianoEl       = document.getElementById('piano');

let ready   = false;
let loading = false;
let sustain = false;
const held  = new Set();

// Piano rendern
renderPiano(pianoEl, onNote);

// ── Audio-Init (einmalig beim ersten User-Gesture) ────────────
async function startAudio() {
  if (ready || loading) return;
  loading = true;
  statusEl.textContent = 'Lade Katzengeräusch...';
  statusEl.className   = 'status loading';
  try {
    const audioCtx = initAudio();
    const buffer   = await loadCatSound(audioCtx);
    setBuffer(buffer);
    ready = true;
    statusEl.textContent = 'Bereit! Spiel los!';
    statusEl.className   = 'status ready';
  } catch (err) {
    statusEl.textContent = 'Fehler: ' + err.message;
    statusEl.className   = 'status error';
    console.error(err);
  } finally {
    loading = false;
  }
}

// ── Note spielen ─────────────────────────────────────────────
function onNote(note) {
  if (!ready) return;
  playNote(note.freq, sustain);

  currentNoteEl.textContent = note.note;
  currentNoteEl.classList.remove('pop');
  void currentNoteEl.offsetWidth;
  currentNoteEl.classList.add('pop');

  highlightKey(note.note, true);
  setTimeout(() => highlightKey(note.note, false), 180);

  // Katzen-Animation
  const range = note.freq < 415 ? 'low' : note.freq < 659 ? 'mid' : 'high';
  triggerReaction(range);
  spawnPaw(note.note);
}

// ── Tastatur ─────────────────────────────────────────────────
document.addEventListener('keydown', async (e) => {
  if (e.repeat) return;

  if (e.code === 'Space') {
    e.preventDefault();
    sustain = true;
    document.getElementById('sustain-indicator')?.classList.add('active');
    return;
  }

  if (!ready) await startAudio();

  const k    = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const note = KEY_MAP[k];
  if (note && !held.has(k)) {
    held.add(k);
    onNote(note);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    sustain = false;
    document.getElementById('sustain-indicator')?.classList.remove('active');
    releaseSustain();
    return;
  }
  held.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
});

// ── Maus ─────────────────────────────────────────────────────
let mouseDown = false;
document.addEventListener('mousedown', async () => {
  mouseDown = true;
  if (!ready) await startAudio();
});
document.addEventListener('mouseup', () => { mouseDown = false; });

pianoEl.addEventListener('mouseover', (e) => {
  if (!mouseDown || !ready) return;
  const el = e.target.closest('.piano-key');
  if (!el) return;
  const note = Object.values(KEY_MAP).find(n => n.note === el.dataset.note);
  if (note) onNote(note);
});
