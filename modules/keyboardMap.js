// 2 Oktaven: C4 bis C6 (25 Tasten)
// Weiße Tasten: a s d f g h j k l ; ' z x c v
// Schwarze Tasten: w e t y u o p [ ] \
//
// 3 Sound-Register (je ~8 Semitöne → max. Pitch-Ratio ≈ 1.5x):
//   low:  C4–G4   baseFreq = 261.63 (C4)
//   mid:  G#4–D#5 baseFreq = 415.30 (G#4)
//   high: E5–C6   baseFreq = 659.25 (E5)

export const NOTES = [
  { note: 'C4',  freq: 261.63, key: 'a',  type: 'white', label: 'C4',  range: 'low',  baseFreq: 261.63 },
  { note: 'C#4', freq: 277.18, key: 'w',  type: 'black',                range: 'low',  baseFreq: 261.63 },
  { note: 'D4',  freq: 293.66, key: 's',  type: 'white', label: 'D4',  range: 'low',  baseFreq: 261.63 },
  { note: 'D#4', freq: 311.13, key: 'e',  type: 'black',                range: 'low',  baseFreq: 261.63 },
  { note: 'E4',  freq: 329.63, key: 'd',  type: 'white', label: 'E4',  range: 'low',  baseFreq: 261.63 },
  { note: 'F4',  freq: 349.23, key: 'f',  type: 'white', label: 'F4',  range: 'low',  baseFreq: 261.63 },
  { note: 'F#4', freq: 369.99, key: 't',  type: 'black',                range: 'low',  baseFreq: 261.63 },
  { note: 'G4',  freq: 392.00, key: 'g',  type: 'white', label: 'G4',  range: 'low',  baseFreq: 261.63 },
  { note: 'G#4', freq: 415.30, key: 'y',  type: 'black',                range: 'mid',  baseFreq: 415.30 },
  { note: 'A4',  freq: 440.00, key: 'h',  type: 'white', label: 'A4',  range: 'mid',  baseFreq: 415.30 },
  { note: 'A#4', freq: 466.16, key: 'u',  type: 'black',                range: 'mid',  baseFreq: 415.30 },
  { note: 'B4',  freq: 493.88, key: 'j',  type: 'white', label: 'B4',  range: 'mid',  baseFreq: 415.30 },
  { note: 'C5',  freq: 523.25, key: 'k',  type: 'white', label: 'C5',  range: 'mid',  baseFreq: 415.30 },
  { note: 'C#5', freq: 554.37, key: 'o',  type: 'black',                range: 'mid',  baseFreq: 415.30 },
  { note: 'D5',  freq: 587.33, key: 'l',  type: 'white', label: 'D5',  range: 'mid',  baseFreq: 415.30 },
  { note: 'D#5', freq: 622.25, key: 'p',  type: 'black',                range: 'mid',  baseFreq: 415.30 },
  { note: 'E5',  freq: 659.25, key: ';',  type: 'white', label: 'E5',  range: 'high', baseFreq: 659.25 },
  { note: 'F5',  freq: 698.46, key: "'",  type: 'white', label: 'F5',  range: 'high', baseFreq: 659.25 },
  { note: 'F#5', freq: 739.99, key: '[',  type: 'black',                range: 'high', baseFreq: 659.25 },
  { note: 'G5',  freq: 783.99, key: 'z',  type: 'white', label: 'G5',  range: 'high', baseFreq: 659.25 },
  { note: 'G#5', freq: 830.61, key: ']',  type: 'black',                range: 'high', baseFreq: 659.25 },
  { note: 'A5',  freq: 880.00, key: 'x',  type: 'white', label: 'A5',  range: 'high', baseFreq: 659.25 },
  { note: 'A#5', freq: 932.33, key: '\\', type: 'black',                range: 'high', baseFreq: 659.25 },
  { note: 'B5',  freq: 987.77, key: 'c',  type: 'white', label: 'B5',  range: 'high', baseFreq: 659.25 },
  { note: 'C6',  freq: 1046.50, key: 'v', type: 'white', label: 'C6',  range: 'high', baseFreq: 659.25 },
];

export const BLACK_KEY_WHITE_INDEX = {
  'C#4': 0, 'D#4': 1, 'F#4': 3, 'G#4': 4, 'A#4': 5,
  'C#5': 7, 'D#5': 8, 'F#5': 10, 'G#5': 11, 'A#5': 12,
};

export const KEY_MAP = Object.fromEntries(NOTES.map(n => [n.key, n]));
