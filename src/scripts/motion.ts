/**
 * Movimiento del sitio público. Cada `[data-r]` recibe un tipo de entrada
 * según lo que es, sin tener que marcarlo a mano:
 *
 * - títulos (h1–h3 y lockups): palabra por palabra, saliendo de una máscara;
 * - imágenes y figuras: una cortina que las descubre mientras se acomodan;
 * - fotos de tarjetas (series, flyers, ministerios): el marco se abre y la
 *   foto se asienta adentro, sin marcarlas en cada página (si la tarjeta
 *   entera ya entra, sube y su foto se abre con ella);
 * - títulos que son un logo (Arde, Kids): se estampan;
 * - kickers y etiquetas: un barrido de izquierda a derecha;
 * - grupos (botones, fotos, datos, listas): los hijos en cascada;
 * - el resto: aparece subiendo.
 *
 * Los elementos que entran juntos se escalonan entre sí (como un batch de
 * GSAP), así una grilla nunca aparece de golpe. El carácter de cada tema
 * (kids rebota, arde corta, los educativos son calmos) vive en noche.css.
 *
 * Con movimiento reducido no se arma nada: todo queda visible desde el inicio.
 */
import Lenis from 'lenis';

const GROUPS =
  '.lz-actions, .lz-photos, .lz-stats, .lz-times, .lz-data, .lz-tiles, .ie-toc, .dc-checks, .lz-welcome__foot';
/** Marcos de foto de las tarjetas: se descubren y la foto se asienta adentro. */
const FRAMES = '.lz-serie__art, .lz-flyer__img, .lz-card__img, .lz-post__img, .lz-scene__media';
const KICKERS = '.lz-spaced, .lz-kicker, .lz-tag, .kd-chip, .ad-tag, .ie-kicker, .dc-hand--kicker';

/** Envuelve cada palabra de los nodos de texto en una máscara, respetando
 * <strong>, <em> y los spans del lockup. */
function splitWords(root: HTMLElement) {
  let index = 0;
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(part);
            return;
          }
          const mask = document.createElement('span');
          mask.className = 'm-w';
          const inner = document.createElement('span');
          inner.className = 'm-w__i';
          inner.style.setProperty('--wi', String(index++));
          inner.textContent = part;
          mask.append(inner);
          frag.append(mask);
        });
        child.replaceWith(frag);
      } else if (child instanceof HTMLElement && !child.matches('br, img, svg')) {
        walk(child);
      }
    });
  };
  walk(root);
}

function kindOf(el: HTMLElement): string {
  if (el.matches(FRAMES)) return 'frame';
  if (el.matches('img, figure, video, picture, .lz-wide, .lz-article-media, .lz-devo__post, .ad-collage')) return 'media';
  if (el.matches(GROUPS)) return 'group';
  if (el.querySelector(FRAMES)) return 'card';
  if (el.matches(KICKERS)) return 'wipe';
  const isHeading = el.matches('h1, h2, h3, .lz-lockup, .lz-lockup > span');
  if (isHeading && el.querySelector('img')) return 'stamp';
  if (isHeading && !el.querySelector('img, [data-rotator]')) return 'words';
  return 'rise';
}

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>(FRAMES).forEach((frame) => {
    if (!frame.closest('[data-r]')) frame.setAttribute('data-r', '');
  });
  const items = [...document.querySelectorAll<HTMLElement>('[data-r]')];

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  items.forEach((el) => {
    const kind = kindOf(el);
    el.dataset.m = kind;
    if (kind === 'words') splitWords(el);
    if (kind === 'group') [...el.children].forEach((child, i) => (child as HTMLElement).style.setProperty('--ci', String(i)));
  });
  document.documentElement.classList.add('m-ready');

  const show = (el: Element) => el.classList.add('is-in');

  // threshold 0: un bloque más alto que el viewport nunca llega a 0.12.
  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement);
      entering
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left)
        .forEach((el, i) => {
          el.style.setProperty('--d', `${Math.min(i, 6) * 0.09}s`);
          show(el);
          io.unobserve(el);
        });
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => io.observe(el));
  // Red de seguridad: nada queda invisible si el observer falla.
  setTimeout(() => items.forEach(show), 4000);

  initSmoothScroll();
}

/** Scroll con inercia en escritorio. En pantallas táctiles queda el nativo,
 * que ya es suave y es lo que la gente espera del teléfono. */
function initSmoothScroll() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: true });
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Con el menú abierto el fondo no se mueve.
  new MutationObserver(() => {
    if (document.body.classList.contains('lz-menu-open')) lenis.stop();
    else lenis.start();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
