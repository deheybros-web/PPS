/* ===================================================
   PPS — Persatuan Pelajar Spesus
   Main JavaScript
   =================================================== */

/* ─── Navbar Scroll Effect ─── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── Mobile Nav Toggle ─── */
(function () {
  const btn = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!btn || !mobileNav) return;
  btn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // Close on nav-link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      btn.classList.remove('active');
    });
  });
})();

/* ─── Active Nav Link ─── */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link, .mobile-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (
      (path === '/' || path.endsWith('index.html') && !path.includes('/about') && !path.includes('/contact') && !path.includes('/join')) && href.includes('../index') ||
      path.includes('/about') && href.includes('about') ||
      path.includes('/contact') && href.includes('contact') ||
      path.includes('/join') && href.includes('join')
    ) {
      link.classList.add('active');
    }
  });
})();

/* ─── Smooth Scroll ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

/* ─── Fade-in on Scroll ─── */
(function () {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─── Counter Animation ─── */
(function () {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ─── Join Form Validation & WhatsApp ─── */
(function () {
  const form = document.getElementById('joinForm');
  if (!form) return;

  const WA_NUMBER = '6282234881913'; // Kelvin Eden Donata

  const showError = (input, msg) => {
    const group = input.closest('.form-group');
    if (!group) return;
    input.classList.add('error');
    let errEl = group.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      group.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.classList.add('show');
  };

  const clearError = (input) => {
    input.classList.remove('error');
    const group = input.closest('.form-group');
    if (!group) return;
    const errEl = group.querySelector('.form-error');
    if (errEl) errEl.classList.remove('show');
  };

  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = {
      nama: { el: form.querySelector('#nama'), label: 'Nama Lengkap' },
      kelas: { el: form.querySelector('#kelas'), label: 'Kelas' },
      umur: { el: form.querySelector('#umur'), label: 'Umur' },
      wa: { el: form.querySelector('#wa'), label: 'Nomor WhatsApp' },
      alasan: { el: form.querySelector('#alasan'), label: 'Alasan Bergabung' },
    };

    let valid = true;

    // Reset errors
    Object.values(fields).forEach(f => clearError(f.el));

    // Validate
    if (!fields.nama.el.value.trim()) {
      showError(fields.nama.el, 'Nama lengkap wajib diisi.');
      valid = false;
    }

    if (!fields.kelas.el.value.trim()) {
      showError(fields.kelas.el, 'Kelas wajib diisi.');
      valid = false;
    }

    const umurVal = parseInt(fields.umur.el.value, 10);
    if (!fields.umur.el.value.trim() || isNaN(umurVal) || umurVal < 10 || umurVal > 20) {
      showError(fields.umur.el, 'Masukkan umur yang valid (10–20 tahun).');
      valid = false;
    }

    const waVal = fields.wa.el.value.replace(/\D/g, '');
    if (!waVal || waVal.length < 9) {
      showError(fields.wa.el, 'Nomor WhatsApp tidak valid.');
      valid = false;
    }

    if (!fields.alasan.el.value.trim() || fields.alasan.el.value.trim().length < 10) {
      showError(fields.alasan.el, 'Alasan bergabung minimal 10 karakter.');
      valid = false;
    }

    if (!valid) return;

    // Build WhatsApp message
    const msg = [
      '✋ *PENDAFTARAN PPS*',
      '_(Persatuan Pelajar Spesus - Cabang Purwokerto)_',
      '',
      '📝 *Nama:* ' + fields.nama.el.value.trim(),
      '🏫 *Kelas:* ' + fields.kelas.el.value.trim(),
      '🎂 *Umur:* ' + fields.umur.el.value.trim() + ' tahun',
      '📱 *Nomor WA:* ' + fields.wa.el.value.trim(),
      '💬 *Alasan Bergabung:*\n' + fields.alasan.el.value.trim(),
      '',
      '— Dikirim melalui website PPS',
    ].join('\n');

    const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');

    // Success state
    const btn = form.querySelector('.form-submit');
    const origText = btn.innerHTML;
    btn.innerHTML = '✅ Berhasil! Membuka WhatsApp...';
    btn.style.background = '#25D366';
    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = '';
    }, 3500);
  });
})();