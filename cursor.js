/**
 * Muhammad Yusuf Bin Alias - Portfolio Interaction Engine
 * Features:
 * - Desktop-Only Smooth Trailing Target Reticle Cursor
 * - Desktop-Only 3D Perspective Card Tilt & Spotlight
 * - Universal Mobile & Desktop Automatic Scroll Reveal
 * - Mobile Navigation Drawer Auto-Closer
 * - Global Clipboard Utility
 */
(function() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 992;

  // --- 1. Desktop Reticle Cursor & 3D Tilt (Disabled on Touch / Mobile) ---
  if (!isTouchDevice) {
    let dot = document.querySelector('.cursor-dot');
    let circle = document.querySelector('.cursor-circle');

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'cursor-dot';
      document.body.appendChild(dot);
    }

    if (!circle) {
      circle = document.createElement('div');
      circle.className = 'cursor-circle';
      document.body.appendChild(circle);
    }

    let mouseX = -100;
    let mouseY = -100;
    let circleX = -100;
    let circleY = -100;
    let isVisible = false;

    // Track real-time mouse position
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        circleX = mouseX;
        circleY = mouseY;
        dot.style.opacity = '1';
        circle.style.opacity = '1';
      }

      // Dot follows instantly without any delay
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Fade out when cursor leaves window
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.style.opacity = '0';
      circle.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      dot.style.opacity = '1';
      circle.style.opacity = '1';
    });

    // Smooth linear interpolation (lerp) loop for trailing outer circle
    const delayFactor = 0.16;

    function animateCircle() {
      if (isVisible) {
        circleX += (mouseX - circleX) * delayFactor;
        circleY += (mouseY - circleY) * delayFactor;
        circle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCircle);
    }

    requestAnimationFrame(animateCircle);

    // Interactive hover expansion for buttons, links & cards
    const interactiveSelector = 'a, button, input, textarea, select, .btn, .btn-nav, .nav-pill-link, .jump-link, .nav-toggle-label, label, [role="button"]';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        circle.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        circle.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      }
    });

    // Tactical Click Impulse Effect
    window.addEventListener('mousedown', () => {
      circle.classList.add('cursor-clicking');
      dot.classList.add('cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
      circle.classList.remove('cursor-clicking');
      dot.classList.remove('cursor-clicking');
    });

    // Mouse Spotlight & 3D Card Tilt Engine
    const cardSelector = '.glass-panel, .project-card, .stat-card, .about-pillar-card, .domain-card, .external-link-card, .award-item-card, .glass-profile-card, .about-portrait-card, .tilt-card';

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest(cardSelector);
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // 3D Perspective Tilt for cards with .tilt-card or .glass-profile-card
        if (card.classList.contains('tilt-card') || card.classList.contains('glass-profile-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        }
      }
    });

    // Smooth reset when leaving 3D tilt cards
    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.tilt-card, .glass-profile-card');
      if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
        card.style.transform = '';
      }
    });
  }

  // --- 2. Mobile Navigation Auto-Closer ---
  document.addEventListener('click', function(e) {
    const navLink = e.target.closest('.nav-links a');
    const toggle = document.getElementById('nav-toggle');
    if (navLink && toggle && toggle.checked) {
      toggle.checked = false;
    }
  });

  // --- 3. Automatic Scroll Reveal Engine (Runs on all screen sizes) ---
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealTargets = document.querySelectorAll(
      '.section-header, .glass-panel, .glass-profile-card, .stat-card, .project-card, .about-pillar-card, .domain-card, .award-item-card, .external-link-card, .about-main-layout, .contact-method'
    );

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    revealTargets.forEach((el, index) => {
      el.classList.add('reveal');
      if (index % 3 === 1) el.style.transitionDelay = '0.06s';
      if (index % 3 === 2) el.style.transitionDelay = '0.12s';
      revealObserver.observe(el);
    });
  }
})();

/**
 * Global Email Copy Helper with Visual Feedback
 */
window.copyEmail = function(btn) {
  var email = 'yusufalias15@gmail.com';
  function notify() {
    var span = btn.querySelector('span') || btn;
    var prev = span.innerText;
    span.innerText = 'Copied! ✓';
    btn.style.color = '#34d399';
    setTimeout(function() {
      span.innerText = prev;
      btn.style.color = '';
    }, 2200);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(notify).catch(function() {
      fallbackCopy(email);
      notify();
    });
  } else {
    fallbackCopy(email);
    notify();
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { prompt('Copy email address:', text); }
    document.body.removeChild(ta);
  }
};
