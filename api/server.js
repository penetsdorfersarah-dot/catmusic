import express from 'express';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// 3 verschiedene Sounds für verschiedene Register
// Jeder deckt ~8 Semitöne ab → max. Pitch-Shift-Ratio ≈ 1.5x
const SOUND_CONFIGS = {
  low:  { text: 'large cat deep low meow, slow bass tone',         duration_seconds: 1.0 },
  mid:  { text: 'cat meowing naturally, medium pitch single meow', duration_seconds: 1.0 },
  high: { text: 'kitten high pitched short meow, cute small cat',  duration_seconds: 0.8 },
};

const cache = { low: null, mid: null, high: null };

async function generateSound(range) {
  if (cache[range]) return cache[range];

  const config = SOUND_CONFIGS[range];
  console.log(`Generiere "${range}" Sound: ${config.text}`);

  const stream = await elevenlabs.textToSoundEffects.convert({
    text: config.text,
    duration_seconds: config.duration_seconds,
    prompt_influence: 0.4,
  });

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  cache[range] = Buffer.concat(chunks);
  console.log(`"${range}" geladen (${(cache[range].length / 1024).toFixed(1)} KB)`);
  return cache[range];
}

app.use(express.static(path.join(__dirname, '..')));

app.get('/api/cat-sound/:range', async (req, res) => {
  const { range } = req.params;

  if (!SOUND_CONFIGS[range]) {
    return res.status(400).json({ error: `Unbekanntes Register: ${range}` });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY nicht gesetzt' });
  }

  try {
    const audio = await generateSound(range);
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(audio);
  } catch (err) {
    console.error(`ElevenLabs Fehler (${range}):`, err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Catmusic laeuft auf http://localhost:${PORT}`);
});
