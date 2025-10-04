/* Main UI Logic for bg.remove */
(() => {
  const qs = (sel, ctx=document) => ctx.querySelector(sel);
  const $ = qs;

  const root = document.documentElement;
  const dropZone = $('#dropZone');
  const fileInput = $('#fileInput');
  const browseBtn = $('#browseBtn');
  const progress = $('#progress');
  const progressBar = $('#progressBar');
  const progressText = $('#progressText');
  const errorBox = $('#error');
  const results = $('#results');
  const origPreview = $('#originalPreview');
  const procPreview = $('#processedPreview');
  const skeleton = $('#processingSkeleton');
  const downloadBtn = $('#downloadBtn');
  const resetBtn = $('#resetBtn');
  const themeToggle = $('#themeToggle');
  const clearCacheBtn = $('#clearCacheBtn');

  const MAX_SIZE = 16 * 1024 * 1024; // 16MB
  const VALID_TYPES = ['image/png','image/jpeg','image/webp'];

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  // Theme init
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) setTheme(storedTheme); else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }
  function clearError() { errorBox.hidden = true; }

  function resetUI() {
    results.hidden = true;
    downloadBtn.disabled = true;
    progress.hidden = true;
    progressBar.style.width = '0%';
    progressText.textContent = 'Uploading…';
    procPreview.src = '';
    origPreview.src = '';
  }

  function handleFiles(file) {
    clearError();
    if (!file) return;
    if (!VALID_TYPES.includes(file.type)) return showError('Unsupported file. Use PNG, JPG, or WebP.');
    if (file.size > MAX_SIZE) return showError('File too large (max 16MB).');

    const reader = new FileReader();
    reader.onload = e => {
      origPreview.src = e.target.result;
      results.hidden = false;
    };
    reader.readAsDataURL(file);

    uploadAndProcess(file);
  }

  function simulateProgress(start=0, end=90, duration=1200) {
    const startTime = performance.now();
    function frame(now) {
      const elapsed = now - startTime;
      const pct = Math.min(end, start + (elapsed / duration) * (end - start));
      progressBar.style.width = pct + '%';
      if (pct < end) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  async function uploadAndProcess(file) {
    progress.hidden = false;
    skeleton.hidden = false;
    downloadBtn.disabled = true;

    simulateProgress();

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/remove-bg', { method: 'POST', body: formData });
      if (!response.ok) {
        let errMsg = 'Processing failed';
        try { const data = await response.json(); errMsg = data.error || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const blob = await response.blob();
      progressBar.style.width = '100%';
      progressText.textContent = 'Done';
      skeleton.hidden = true;
      const url = URL.createObjectURL(blob);
      procPreview.src = url;
      downloadBtn.disabled = false;
      downloadBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = url; a.download = 'removed_background.png';
        document.body.appendChild(a); a.click(); a.remove();
      }, { once: true });
    } catch (e) {
      showError(e.message);
      skeleton.hidden = true;
      progress.hidden = true;
    }
  }

  // Drag & drop
  ;['dragenter','dragover','dragleave','drop'].forEach(ev => {
    dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); });
  });
  ;['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.parentElement.classList.add('dragover')));
  ;['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.parentElement.classList.remove('dragover')));
  dropZone.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    resetUI();
    handleFiles(file);
  });

  // Browse
  browseBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    resetUI();
    handleFiles(file);
  });

  resetBtn.addEventListener('click', () => {
    resetUI();
    fileInput.value = '';
    origPreview.src = '';
    procPreview.src = '';
    results.hidden = true;
  });

  clearCacheBtn?.addEventListener('click', async () => {
    // Optional endpoint for clearing temp. Not implemented here.
    showError('Temp clear endpoint not implemented. Delete files manually in uploads/ processed/.');
    setTimeout(clearError, 4000);
  });

  // Accessibility: keyboard activation
  dropZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
})();
