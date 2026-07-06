import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ redirect }) => redirect('/brand/favico.png', 308);
