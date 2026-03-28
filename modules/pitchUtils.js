// Basis-Note: C4 = 261.63 Hz (die Note die ElevenLabs generiert)
export const BASE_FREQ = 261.63;

// playbackRate für Web Audio API: targetFreq / baseFreq
export function getPlaybackRate(targetFreq) {
  return targetFreq / BASE_FREQ;
}
