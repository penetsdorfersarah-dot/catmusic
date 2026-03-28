import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export default async function handler(req, res) {
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY fehlt' });
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  try {
    const stream = await elevenlabs.textToSoundEffects.convert({
      text: 'cat meowing softly, single short meow',
      duration_seconds: 1.0,
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
