// FundLab — early access form handler
(function () {
  const form = document.getElementById('early-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  // Optional: paste your Formspree / Web3Forms endpoint here
  // e.g. 'https://formspree.io/f/xxxxxx' or 'https://api.web3forms.com/submit'
  const ENDPOINT = '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      email: (data.get('email') || '').toString().trim(),
      role: data.get('role'),
      city: data.get('city'),
      ts: new Date().toISOString(),
    };

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      const input = form.querySelector('input[name="email"]');
      input.style.outline = '2px solid #ec4899';
      input.focus();
      return;
    }
    if (!payload.city) {
      const sel = form.querySelector('select[name="city"]');
      sel.style.outline = '2px solid #ec4899';
      sel.focus();
      return;
    }

    // Local backup so signups aren't lost during early dev
    try {
      const prev = JSON.parse(localStorage.getItem('fundlab_early') || '[]');
      prev.push(payload);
      localStorage.setItem('fundlab_early', JSON.stringify(prev));
    } catch (_) {}

    // Send to endpoint if configured
    if (ENDPOINT) {
      try {
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (_) { /* silent */ }
    }

    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Reset outline on input
  form.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('input', () => { el.style.outline = ''; });
    el.addEventListener('change', () => { el.style.outline = ''; });
  });
})();
