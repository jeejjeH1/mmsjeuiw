export const FPS = 30;
export const W = 1920;
export const H = 1080;

// 120 BPM -> 1 beat = 15 frames, 1 bar = 60 frames
export const BEAT = 15;
export const BAR = 60;

export const C = {
  bg: '#07020d',
  bg2: '#12041f',
  pink: '#ff87ff',
  magenta: '#dc00ff',
  purple: '#7b2cff',
  deep: '#2a0a4a',
  green: '#3dffa2',
  white: '#fff4ff',
};

export const GRAD = `linear-gradient(100deg, ${C.pink} 0%, ${C.magenta} 45%, ${C.purple} 100%)`;

export const FONT = {
  display: 'Unbounded, sans-serif',
  mono: '"Space Mono", monospace',
  fa: 'Vazirmatn, sans-serif',
};

export type Work = {
  src: string;
  trim: number; // first source frame shown in the 4s chapter
  title: string;
  subtitle: string;
  tags: string[];
};

export const WORKS: Work[] = [
  {src: 'w1', trim: 0, title: 'GenVM', subtitle: 'Beyond the boolean', tags: ['Kinetic Type', 'UI Motion', 'Glitch FX']},
  {src: 'w2', trim: 40, title: 'Optimistic Democracy', subtitle: 'Decentralizing AI decisions', tags: ['Typography', 'Brand Motion']},
  {src: 'w3', trim: 0, title: 'Reality Isn’t Clean', subtitle: 'Validators & consensus', tags: ['Explainer', 'Glitch FX', 'UI']},
  {src: 'w4', trim: 50, title: 'Smart Contracts', subtitle: 'Non-deterministic & smarter', tags: ['2D Animation', 'Character']},
  {src: 'w5', trim: 0, title: 'AI Agents', subtitle: 'They talk to each other', tags: ['Minimal', 'Line Motion']},
  {src: 'w6', trim: 45, title: 'The Wrong Decision', subtitle: 'How validators fix it', tags: ['UI Motion', 'Typewriter']},
  {src: 'w7', trim: 50, title: 'Multi‑Layer Security', subtitle: 'GenLayer explained', tags: ['Character', 'Infographic']},
  {src: 'w8', trim: 40, title: 'Different Answers', subtitle: 'One consensus', tags: ['Brand Motion', 'Pastel']},
];

export const NAME = 'MASTER';

// Timeline (frames) — every boundary sits on a beat of the soundtrack
export const T = {
  hook: 0,
  kinetic: 60,
  title: 120,
  rally: 240,
  read: 360,
  discord: 480,
  create: 660,
  art: 720,
  works: 900,
  workLen: 120,
  lesson: 1860,
  finale: 2040,
  cta: 2280,
  end: 2580,
};

export const pad2 = (n: number) => String(n).padStart(2, '0');
