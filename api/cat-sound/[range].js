import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const PROMPTS = {
  low:  'large cat deep low meow, slow bass tone',
  mid:  'cat meowing naturally, medium pitch single meow',
  high: 'kitten high pitched short meow, cute small cat',
};

export default async function handler(req, res) {
  const range = req.query.range;

  if (!PROMPTS[range]) {
    return res.status(400).json({ error: `Unbekanntes Register: ${range}` });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY fehlt' });
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  try {
    const stream = await elevenlabs.textToSoundEffects.convert({
      text: PROMPTS[range],
      duration_seconds: range === 'high' ? 0.8 : 1.0,
      prompt_influence: 0.4,
    });

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const audio = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.send(audio);
  } catch (err) {
    console.error('ElevenLabs Fehler:', err.message);
    res.status(500).json({ error: err.message });
  }
}
