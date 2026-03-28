const cat = () => document.getElementById('cat-character');

export function triggerReaction(range) {
  const el = cat();
  if (!el) return;
  el.dataset.range = range;
  el.classList.remove('reacting');
  void el.offsetWidth; // reflow
  el.classList.add('reacting');

  // Nur auf den Bounce reagieren, nicht auf cat-idle
  const onEnd = (e) => {
    if (e.animationName === 'cat-bounce') {
      el.classList.remove('reacting');
      el.removeEventListener('animationend', onEnd);
    }
  };
  el.addEventListener('animationend', onEnd);
}

export function spawnPaw(noteStr) {
  const keyEl = document.querySelector(`[data-note="${noteStr}"]`);
  if (!keyEl) return;

  const rect = keyEl.getBoundingClientRect();
  const paw = document.createElement('div');
  paw.className = 'paw-particle';
  paw.textContent = '🐾';

  // Zufällige leichte Variation
  const offsetX = (Math.random() - 0.5) * 20;
  const rotation = (Math.random() - 0.5) * 40;
  paw.style.setProperty('--rotate', `${rotation}deg`);
  paw.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
  paw.style.top  = `${rect.top}px`;

  document.body.appendChild(paw);
  paw.addEventListener('animationend', () => paw.remove(), { once: true });
}
