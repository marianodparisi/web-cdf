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

    /* ── Carousel ───────────────────────────────────────────────────────
       El deslizar es del navegador (`overflow-x` + `scroll-snap`); esto sólo
       agrega las flechas de desktop, donde no hay dedo. Si el JS no corre, la
       fila se sigue pudiendo arrastrar: las flechas ya vienen ocultas en CSS
       hasta 768px y acá se apagan si no hay a dónde ir. */
    document.querySelectorAll('[data-carousel]').forEach((track) => {
      const nav = (track.closest('section') || document).querySelector('[data-carousel-nav]');
      if (!nav) return;

      /* Un paso es una tarjeta más su calle. Se mide en vivo porque el ancho
         cambia entre breakpoints. */
      const step = () => {
        const card = track.firstElementChild;
        if (!card) return track.clientWidth;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return card.getBoundingClientRect().width + gap;
      };

      const sync = () => {
        const max = track.scrollWidth - track.clientWidth;
        /* 1px de tolerancia: con scroll fraccional el extremo nunca cae justo. */
        nav.querySelectorAll('[data-dir]').forEach((b) => {
          const dir = Number(b.getAttribute('data-dir'));
          b.disabled = dir < 0 ? track.scrollLeft <= 1 : track.scrollLeft >= max - 1;
        });
      };

      nav.querySelectorAll('[data-dir]').forEach((b) => {
        b.addEventListener('click', () => {
          track.scrollBy({ left: step() * Number(b.getAttribute('data-dir')) });
        });
      });

      track.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    });

    /* ── Mapa de destinos ───────────────────────────────────────────────
       Un solo destino activo a la vez: se sincroniza el punto del mapa con su
       ficha. Escucha hover, foco de teclado y click, porque en mobile no hay
       hover y el tap tiene que servir igual. */
    document.querySelectorAll('[data-mapa]').forEach((mapa) => {
      const puntos = [...mapa.querySelectorAll('[data-destino]')];
      const fichas = [...mapa.querySelectorAll('[data-ficha]')];
      if (!puntos.length) return;

      const activar = (slug) => {
        puntos.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-destino') === slug));
        fichas.forEach((f) => f.classList.toggle('is-active', f.getAttribute('data-ficha') === slug));
      };

      puntos.forEach((punto) => {
        const slug = punto.getAttribute('data-destino');
        ['mouseenter', 'focus', 'click'].forEach((evt) =>
          punto.addEventListener(evt, () => activar(slug))
        );
      });
    });

    /* ── Tabs ───────────────────────────────────────────────────────────
       `querySelectorAll`, no `querySelector`: la página de ministerio tiene dos
       bloques de pestañas y con el singular sólo se enganchaba el primero; el
       segundo quedaba muerto. Cada bloque se resuelve dentro de sí mismo, así
       que dos bloques pueden repetir el mismo `data-panel` sin pisarse. */
    document.querySelectorAll('[data-tabs]').forEach((tabs) => {
      tabs.querySelectorAll('[data-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          const target = button.getAttribute('data-tab');
          tabs.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('is-active', b === button));
          tabs
            .querySelectorAll('[data-panel]')
            .forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-panel') === target));

          /* Los paneles dormidos están en `display: none`, así que el observer
             nunca los vio y su contenido sigue en `opacity: 0`. Al abrirlos hay
             que revelarlos a mano: si no, el panel aparece vacío hasta que
             entra la red de seguridad de los 4 s. */
          const abierto = tabs.querySelector(`[data-panel="${target}"]`);
          if (abierto) {
            abierto.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
          }
        });
      });
    });

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
