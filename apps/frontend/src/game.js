export default function initGame() {
  const scene = document.getElementById('scene');
  const markersWrap = document.getElementById('markers');
  const timerEl = document.getElementById('timer');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (!scene || !startBtn || !resetBtn) return;

  let startTime = null;
  let timerInterval = null;
  let gameActive = false;

  function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const s = Math.floor(elapsed / 1000);
      const m = Math.floor(s / 60);
      timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
    }, 500);
  }

  function stopTimer() { clearInterval(timerInterval); }

  function showToast(message, type='info') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(),300); }, 2500);
  }

  function createMarker(x,y) {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    markersWrap.appendChild(marker);
  }

  // CLICK — rotated 90deg CCW
  scene.addEventListener('click', async e => {
    if (!gameActive) return showToast('Click Start first', 'warn');
    const rect = scene.getBoundingClientRect();

    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // rotation math:
    const x = rect.height - rawY;  // swap
    const y = rawX;

    const imageWidth = rect.height;
    const imageHeight = rect.width;

    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ x, y, imageWidth, imageHeight })
    });

    const data = await res.json();

    if (data.correct) {
      createMarker(data.center.x, data.center.y);
      stopTimer();
      gameActive = false;
      showToast(`🎉 Found Waldo in ${timerEl.textContent}`, 'success');
    } else {
      showToast('❌ Not Waldo', 'warn');
    }
  });

  startBtn.addEventListener('click', async () => {
    await fetch('/api/reset', { method:'POST' });
    markersWrap.innerHTML = '';
    startTimer();
    gameActive = true;
    showToast('Game Started!', 'info');
  });

  resetBtn.addEventListener('click', async () => {
    await fetch('/api/reset', { method:'POST' });
    markersWrap.innerHTML = '';
    timerEl.textContent = '00:00';
    gameActive = false;
    stopTimer();
    showToast('Game Reset', 'info');
  });
}
