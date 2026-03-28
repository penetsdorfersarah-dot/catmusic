import { KEY_MAP } from './modules/keyboardMap.js';
import { renderPiano, highlightKey } from './modules/piano.js';
import { initAudioContext, playNote, releaseSustain } from './modules/audioEngine.js';
import { loadAllSounds } from './modules/catSounds.js';

const statusEl = document.getElementById('status');
const currentNoteEl = document.getElementById('current-note');
const pianoContainer = document.getElementById('piano');

const pressedKeys = new Set();
let isReady = false;
let initPromise = null;
let sustainActive = false;

renderPiano(pianoContainer, handleNotePlay);

async function initAudio() {
  if (isReady) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      statusEl.textContent = 'Lade Sounds... (0/3)';
      statusEl.className = 'status loading';

      const ctx = initAudioContext();
      await loadAllSounds(ctx, (loaded, total) => {
        statusEl.textContent = `Lade Sounds... (${loaded}/${total})`;
      });

      isReady = true;
      statusEl.textContent = 'Bereit! Spiel los!';
      statusEl.className = 'status ready';
    } catch (err) {
      statusEl.textContent = 'Fehler: ' + err.message;
      statusEl.className = 'status error';
      console.error(err);
    }
  })();

  return initPromise;
}

function handleNotePlay(note) {
  if (!isReady) return;
  playNote(note, sustainActive);

  currentNoteEl.textContent = note.note;
  currentNoteEl.classList.remove('pop');
  void currentNoteEl.offsetWidth;
  currentNoteEl.classList.add('pop');

  highlightKey(note.note, true);
  setTimeout(() => highlightKey(note.note, false), 180);
}

// Tastatur
document.addEventListener('keydown', async (e) => {
  if (e.repeat) return;

  // Leertaste = Sustain-Pedal
  if (e.code === 'Space') {
    e.preventDefault();
    if (!sustainActive) {
      sustainActive = true;
      document.getElementById('sustain-indicator')?.classList.add('active');
    }
    return;
  }

  if (!isReady) await initAudio();

  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const note = KEY_MAP[key];

  if (note && !pressedKeys.has(key)) {
    pressedKeys.add(key);
    handleNotePlay(note);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    sustainActive = false;
    document.getElementById('sustain-indicator')?.classList.remove('active');
    releaseSustain();
    return;
  }
  pressedKeys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
});

// Maus-Init
document.addEventListener('mousedown', () => {
  if (!isReady) initAudio();
}, { once: true });

// Slide über Tasten
let mouseDown = false;
document.addEventListener('mousedown', () => { mouseDown = true; });
document.addEventListener('mouseup', () => { mouseDown = false; });

pianoContainer.addEventListener('mouseover', (e) => {
  if (!mouseDown || !isReady) return;
  const keyEl = e.target.closest('.piano-key');
  if (!keyEl) return;
  const note = Object.values(KEY_MAP).find(n => n.note === keyEl.dataset.note);
  if (note) handleNotePlay(note);
});
