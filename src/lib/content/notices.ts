/**
 * Novedades de los ministerios.
 *
 * Cada ministerio tiene una lista (`notices`). Cada novedad elige dónde se ve
 * —en "Qué está pasando" del inicio, en la página del ministerio, o en los
 * dos— y puede tener "Mostrar hasta": pasado ese día deja de verse sola.
 *
 * Hasta octubre de 2026 había una sola novedad por ministerio en campos
 * sueltos (`noticeTitle`, `noticeText`, `noticeImage`, `noticeEndDate`).
 * `noticesOf` la lee como la primera de la lista (visible en los dos lados,
 * como se veía), y el primer guardado la pasa al formato nuevo.
 */
import crypto from 'node:crypto';
import type { Ministry, MinistryNotice } from '../../data/ministries';
import { isActive } from './expiry';

export const LEGACY_ID = 'aviso';

export const noticesOf = (ministry: Ministry): MinistryNotice[] => {
  if (Array.isArray(ministry.notices)) return ministry.notices;
  const title = ministry.noticeTitle?.trim();
  if (!title) return [];
  return [
    {
      id: LEGACY_ID,
      title,
      text: ministry.noticeText?.trim() || undefined,
      image: ministry.noticeImage,
      endDate: ministry.noticeEndDate,
      showHome: true,
      showPage: true,
    },
  ];
};

/** Las que se ven ahora en un lugar: con título, marcadas para ahí y sin vencer. */
export const visibleNotices = (ministry: Ministry, where: 'home' | 'page') =>
  noticesOf(ministry).filter(
    (notice) => notice.title.trim() && (where === 'home' ? notice.showHome : notice.showPage) && isActive(notice.endDate),
  );

/** Visible en algún lado (para los contadores del panel). */
export const isNoticeLive = (notice: MinistryNotice) => (notice.showHome || notice.showPage) && isActive(notice.endDate);

export const newNoticeId = () => crypto.randomUUID().slice(0, 8);

/** Devuelve el ministerio con la lista nueva y sin los campos del formato viejo. */
export const withNotices = (ministry: Ministry, notices: MinistryNotice[]): Ministry => ({
  ...ministry,
  notices,
  noticeTitle: undefined,
  noticeText: undefined,
  noticeImage: undefined,
  noticeEndDate: undefined,
});
