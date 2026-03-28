import express from 'express';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

let cachedAudio = null;

app.use(express.static(__dirname));

app.get('/api/cat-sound', async (req, res) => {
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY nicht gesetzt' });
  }
  if (cachedAudio) {
    res.set('Content-Type', 'audio/mpeg');
    return res.send(cachedAudio);
  }
  try {
    console.log('Generiere Katzengeräusch...');
    const stream = await elevenlabs.textToSoundEffects.convert({
      text: 'cat meowing softly, single short meow',
      duration_seconds: 1.0,
      prompt_influence: 0.4,
    });
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    cachedAudio = Buffer.concat(chunks);
    console.log(`Sound geladen (${(cachedAudio.length / 1024).toFixed(1)} KB)`);
    res.set('Content-Type', 'audio/mpeg');
    res.send(cachedAudio);
  } catch (err) {
    console.error('Fehler:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Catmusic läuft auf http://localhost:${process.env.PORT || 3000}`);
});
