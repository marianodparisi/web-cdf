/* Comportamientos de la maqueta: reveals, rotador, tabs, nav y menú mobile.
   Extraído de src/pages/maqueta.astro para compartirlo entre páginas. */

  (() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Efecto de texto ────────────────────────────────────────────────
       `data-reveal="words"` parte el título en palabras y las sube una a una
       desde detrás de una máscara. Es el reveal editorial: cada palabra
       aparece por debajo de su propia línea, sin blur ni deformación.
       El resto de los `data-reveal` sube el bloque entero.               */
    document.querySelectorAll('[data-reveal="words"]').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((word, index) => {
        const mask = document.createElement('span');
        mask.className = 'as-word';
        const inner = document.createElement('span');
        inner.className = 'as-word__inner';
        inner.textContent = word;
        inner.style.transitionDelay = `${index * 55}ms`;
        mask.appendChild(inner);
        el.appendChild(mask);
        if (index < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });

    const revealAll = () => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));

    if (reduced || !('IntersectionObserver' in window)) {
      revealAll();
    } else {
      /* threshold 0 + rootMargin negativo: alcanza con que asome el borde. Con
         threshold alto, un bloque más alto que el viewport nunca llegaba a
         cumplirlo y se quedaba invisible para siempre. */
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const delay = Number(entry.target.getAttribute('data-reveal-delay') || 0);
            setTimeout(() => entry.target.classList.add('is-in'), delay);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0 }
      );
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

      /* Red de seguridad: el contenido arranca en opacity 0, así que cualquier
         falla del observer dejaría la página en blanco. A los 4 s se muestra
         todo lo que haya quedado colgado. */
      setTimeout(revealAll, 4000);
    }

    /* ── Rotador del hero ─────────────────────────────────────────────── */
    const rotator = document.querySelector('[data-rotator]');
    if (rotator && !reduced) {
      const lines = [...rotator.querySelectorAll('.as-rotator__line')];
      let index = 0;
      if (lines.length > 1) {
        setInterval(() => {
          lines[index].classList.remove('is-active');
          index = (index + 1) % lines.length;
          lines[index].classList.add('is-active');
        }, 2600);
      }
    }

    /* ── Tabs ─────────────────────────────────────────────────────────── */
    const tabs = document.querySelector('[data-tabs]');
    if (tabs) {
      tabs.querySelectorAll('[data-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          const target = button.getAttribute('data-tab');
          tabs.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('is-active', b === button));
          tabs
            .querySelectorAll('[data-panel]')
            .forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-panel') === target));
        });
      });
    }

    /* ── Menú mobile ──────────────────────────────────────────────────── */
    const burger = document.querySelector('.as-burger');
    const nav = document.querySelector('.as-nav');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
    }

    /* ── Nav: transparente sobre el hero, sólida después, y se esconde al
       bajar / reaparece al subir. Replica lo medido en su sitio. ────────── */
    if (nav) {
      const hero = document.querySelector('.as-hero');
      let lastY = window.scrollY;
      let ticking = false;

      // Publica el alto real de la barra para que `scroll-margin-top` de los
      // anclajes no dependa de un número escrito a mano.
      const publicarAlto = () =>
        document.querySelector('.as')?.style.setProperty('--as-nav-h', `${nav.offsetHeight}px`);
      publicarAlto();
      window.addEventListener('resize', publicarAlto, { passive: true });

      const update = () => {
        ticking = false;
        const y = window.scrollY;
        // El punto de corte es el pie del hero menos el alto de la barra: ahí
        // deja de haber foto detrás y la tinta blanca se volvería ilegible.
        const limite = hero ? hero.offsetHeight - nav.offsetHeight : 0;

        // Sin hero oscuro (las internas arrancan en fondo claro) la barra tiene
        // que ser sólida desde arriba: en transparente quedaba tinta blanca
        // sobre blanco, es decir, invisible.
        nav.classList.toggle('is-solid', !hero || y > limite);

        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-hidden');
        } else {
          const bajando = y > lastY;
          // Un margen de gracia evita que parpadee con el rebote del scroll.
          nav.classList.toggle('is-hidden', bajando && y > limite + 160);
        }
        lastY = y;
      };

      update();
      window.addEventListener(
        'scroll',
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(update);
        },
        { passive: true }
      );
    }
  })();
