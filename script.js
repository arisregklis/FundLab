// FundLab — early access form handler
(function () {
  const form = document.getElementById('early-form');
  const success = document.getElementById('form-success');
  const errorBox = document.getElementById('form-error');
  if (!form) return;

  const ENDPOINT = 'https://api.web3forms.com/submit';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorBox.hidden = true;

    const data = new FormData(form);
    const payload = {
      access_key: 'aeb566d0-0fbb-48f0-8c12-442534c89eb1',
      subject: 'FundLab Early Access — νέα εγγραφή',
      name: (data.get('name') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      phone: (data.get('phone') || '').toString().trim(),
      role: data.get('role'),
      city: data.get('city'),
      ts: new Date().toISOString(),
    };

    const emailValid = payload.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    const phoneValid = payload.phone.length >= 7;

    if (!payload.name) {
      const input = form.querySelector('input[name="name"]');
      input.style.outline = '2px solid #ec4899';
      input.focus();
      return;
    }
    if (!emailValid && !phoneValid) {
      const emailInput = form.querySelector('input[name="email"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      emailInput.style.outline = '2px solid #ec4899';
      phoneInput.style.outline = '2px solid #ec4899';
      emailInput.focus();
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

    // Send to endpoint if configured; surface real errors
    if (ENDPOINT) {
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Αποστολή…';

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('bad status');
      } catch (_) {
        btn.disabled = false;
        btn.textContent = origText;
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
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
