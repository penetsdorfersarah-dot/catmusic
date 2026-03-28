import { NOTES, BLACK_KEY_WHITE_INDEX } from './keyboardMap.js';

const WHITE_KEY_WIDTH = 52;  // px
const WHITE_KEY_GAP = 2;     // px
const WHITE_KEY_SLOT = WHITE_KEY_WIDTH + WHITE_KEY_GAP; // 54px
const BLACK_KEY_WIDTH = 34;  // px

function displayKey(key) {
  return key === "'" ? "'" : key === '\\' ? '\\' : key.toUpperCase();
}

export function renderPiano(container, onNotePlay) {
  const whiteNotes = NOTES.filter(n => n.type === 'white');
  const blackNotes = NOTES.filter(n => n.type === 'black');

  const piano = document.createElement('div');
  piano.className = 'piano';

  // Weiße Tasten
  const whiteRow = document.createElement('div');
  whiteRow.className = 'white-keys';

  whiteNotes.forEach(note => {
    const key = document.createElement('div');
    key.className = 'piano-key white-key';
    key.dataset.note = note.note;
    key.innerHTML = `
      <span class="key-shortcut">${displayKey(note.key)}</span>
      <span class="key-note">${note.label}</span>
    `;
    attachNoteEvents(key, note, onNotePlay);
    whiteRow.appendChild(key);
  });

  piano.appendChild(whiteRow);

  // Schwarze Tasten (absolut positioniert)
  const blackLayer = document.createElement('div');
  blackLayer.className = 'black-keys';

  blackNotes.forEach(note => {
    const whiteIndex = BLACK_KEY_WHITE_INDEX[note.note];
    const key = document.createElement('div');
    key.className = 'piano-key black-key';
    key.dataset.note = note.note;
    // Zentriert zwischen weißer Taste [whiteIndex] und [whiteIndex+1]
    const left = whiteIndex * WHITE_KEY_SLOT + WHITE_KEY_SLOT - BLACK_KEY_WIDTH / 2;
    key.style.left = `${left}px`;
    key.innerHTML = `<span class="key-shortcut">${displayKey(note.key)}</span>`;
    attachNoteEvents(key, note, onNotePlay);
    blackLayer.appendChild(key);
  });

  piano.appendChild(blackLayer);
  container.appendChild(piano);
}

function attachNoteEvents(el, note, onNotePlay) {
  el.addEventListener('mousedown', (e) => {
    e.preventDefault();
    onNotePlay(note);
  });
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onNotePlay(note);
  }, { passive: false });
}

export function highlightKey(noteStr, active) {
  const el = document.querySelector(`[data-note="${noteStr}"]`);
  if (el) el.classList.toggle('active', active);
}
