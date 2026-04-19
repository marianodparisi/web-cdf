export interface Mission {
  slug: string;
  place: string;
  country: string;
  stage: 'Proxima' | 'Realizada';
  startDate: string;
  image: string;
  video?: string;
  summary: string;
  focus: string;
}

export const missions: Mission[] = [
  {
    slug: 'mozambique',
    place: 'Mozambique',
    country: 'Africa',
    stage: 'Proxima',
    startDate: '2025-10-01',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGvlfxoZ2T0HVvzaJK4f6loCzk_BzLERbiD7SFld9M1VhIEDpk0XOmNtwpc52ne1l43m_NLjZa7xQ2DeGu77uNcdw70hFpyi02TsvaRA4pwHsGD1bVRbSRoa8mpvK0QN6UFkt37htyl9ZsJ4pZ74yVv3QEQ0V0kpaUvQ1AvtrNN11axWFfEy3Eqfb2RIi3mAV_hdrcbhiv9sV22LcNnJp2YcGOl4VpRWvG7F6jtwOEdH8lDpAlhLk9lhHMlmZbPx8S5KcJWm4J9fY',
    video: '/missions/mozambique-compressed.mp4',
    summary:
      'Salida misionera para compartir el evangelio, servir a comunidades locales y fortalecer el trabajo pastoral junto a iglesias que ya estan sembrando fe, esperanza y acompanamiento en la region.',
    focus: 'Evangelismo y acompanamiento pastoral',
  },
  {
    slug: 'salta',
    place: 'Salta',
    country: 'Argentina',
    stage: 'Realizada',
    startDate: '2025-10-15',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeBRG3ZZOh247H-gEOZFvzjIHB4Lw5aCuXHgEA0N-6qAJ5PRGNQ7b852erovJwkMMLFTJQ1s4QZFGiRpsyop_fzpXLMobVSw5oYv2W6UU1OfPh8sIBusDjfyQjzpSwteKc65fb8OeFkcl30S3LCrMQBGmcNvd57kBzbwTfAaoHZwYxfi3bcZF0f57kUhfmKRCResG6crO7M0tP5LHSKEI_Aul3yIc3mjPEerL9YkX72F-szmtElrRwnaSZlmAjZ97l0-q0NHwm9Pg',
    summary: 'Jornadas de predicacion, discipulado y trabajo en equipo con congregaciones de la region.',
    focus: 'Discipulado y alcance regional',
  },
];
