import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, Easing} from 'remotion';
import {BEAT, C, FONT, H, W} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.83, 0, 0.17, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const ramp = (f: number, a: number, b: number, from = 0, to = 1, ease = easeOut) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: ease});

/** 1 on the beat, decaying to 0 before the next one. */
export const beatPulse = (frame: number, decay = 5) => Math.exp(-((frame % BEAT) / decay));

/* ------------------------------------------------------------------ */
/* Background                                                          */
/* ------------------------------------------------------------------ */
export const Backdrop: React.FC<{hue?: number; intensity?: number}> = ({hue = 0, intensity = 1}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const blob = (x: number, y: number, r: number, col: string, o: number) => (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${col} 0%, transparent 65%)`,
        opacity: o * intensity,
      }}
    />
  );
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden', filter: hue ? `hue-rotate(${hue}deg)` : undefined}}>
      {blob(W * 0.2 + Math.sin(t * 0.5) * 220, H * 0.3 + Math.cos(t * 0.4) * 120, 820, C.magenta, 0.38)}
      {blob(W * 0.85 + Math.cos(t * 0.35) * 180, H * 0.75 + Math.sin(t * 0.6) * 140, 900, C.purple, 0.45)}
      {blob(W * 0.6 + Math.sin(t * 0.7) * 260, H * 0.15 + Math.cos(t * 0.3) * 90, 520, C.pink, 0.18)}
      {blob(W * 0.05 + Math.cos(t * 0.45) * 120, H * 0.95, 520, C.green, 0.12)}
      <DotGrid />
    </AbsoluteFill>
  );
};

export const DotGrid: React.FC<{opacity?: number; size?: number}> = ({opacity = 0.16, size = 48}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${C.pink} 1.2px, transparent 1.6px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${(f * 0.6) % size}px ${(f * 0.3) % size}px`,
        opacity,
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
      }}
    />
  );
};

/** Synthwave perspective grid floor */
export const GridFloor: React.FC<{opacity?: number; speed?: number; color?: string}> = ({
  opacity = 1,
  speed = 4,
  color = C.magenta,
}) => {
  const f = useCurrentFrame();
  const cell = 90;
  return (
    <AbsoluteFill style={{perspective: 700, overflow: 'hidden', opacity}}>
      <div
        style={{
          position: 'absolute',
          left: -W,
          width: W * 3,
          top: H * 0.55,
          height: H * 2,
          transformOrigin: 'top center',
          transform: 'rotateX(76deg)',
          backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: `0px ${(f * speed) % cell}px`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: H * 0.55 - 160,
          height: 320,
          background: `radial-gradient(ellipse at center, ${C.magenta}aa 0%, ${C.purple}44 35%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Particles                                                           */
/* ------------------------------------------------------------------ */
export const Particles: React.FC<{count?: number; seed?: string; speed?: number; opacity?: number}> = ({
  count = 60,
  seed = 'p',
  speed = 1,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const cols = [C.pink, C.magenta, C.green, C.white, C.purple];
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * W;
        const y0 = random(`${seed}y${i}`) * H;
        const vy = (0.3 + random(`${seed}v${i}`) * 1.4) * speed;
        const s = 1.5 + random(`${seed}s${i}`) * 4;
        const y = (((y0 - f * vy) % (H + 40)) + H + 40) % (H + 40) - 20;
        const x = x0 + Math.sin(f / 40 + i) * 20;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 12 + i * 1.7));
        const col = cols[i % cols.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: col,
              boxShadow: `0 0 ${s * 4}px ${col}`,
              opacity: tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  const ox = Math.floor(random(`gx${f}`) * 512);
  const oy = Math.floor(random(`gy${f}`) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('noise.png')})`,
        backgroundPosition: `${ox}px ${oy}px`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.75}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

export const Scanlines: React.FC<{opacity?: number}> = ({opacity = 0.08}) => (
  <AbsoluteFill
    style={{
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 2px, transparent 4px)',
      opacity,
      pointerEvents: 'none',
    }}
  />
);

export const Flash: React.FC<{at: number; len?: number; color?: string; max?: number}> = ({
  at,
  len = 10,
  color = '#fff',
  max = 1,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + len], [0, max, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

/* ------------------------------------------------------------------ */
/* RGB split (SVG filter)                                              */
/* ------------------------------------------------------------------ */
export const RGBSplit: React.FC<{amount: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  amount,
  children,
  style,
}) => {
  const id = 'rgb' + React.useId().replace(/:/g, '');
  const a = Math.round(amount * 10) / 10;
  if (Math.abs(a) < 0.5) return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={style}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r" />
          <feOffset in="r" dx={a} dy={0} result="ro" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b" />
          <feOffset in="b" dx={-a} dy={0} result="bo" />
          <feBlend in="ro" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bo" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: `url(#${id})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Horizontal slice displacement glitch. Renders children several times. */
export const GlitchSlices: React.FC<{amount: number; seed: number; children: React.ReactNode; slices?: number}> = ({
  amount,
  seed,
  children,
  slices = 7,
}) => {
  if (amount < 0.02) return <AbsoluteFill>{children}</AbsoluteFill>;
  const cuts: number[] = [0];
  for (let i = 0; i < slices - 1; i++) cuts.push(random(`c${seed}-${i}`) * 100);
  cuts.push(100);
  cuts.sort((a, b) => a - b);
  return (
    <AbsoluteFill>
      {cuts.slice(0, -1).map((top, i) => {
        const bottom = 100 - cuts[i + 1];
        const dx = (random(`d${seed}-${i}`) - 0.5) * 160 * amount;
        return (
          <AbsoluteFill
            key={i}
            style={{clipPath: `inset(${top}% 0 ${bottom}% 0)`, transform: `translateX(${dx}px)`}}
          >
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */
export const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size = 18,
  color = C.pink,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontSize: size,
      letterSpacing: size * 0.18,
      color,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Letter-by-letter rise reveal behind a mask */
export const RiseText: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  letterStyle?: (i: number) => React.CSSProperties;
}> = ({text, start, stagger = 2, dur = 16, style, letterStyle}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
      {text.split('').map((ch, i) => {
        const p = ramp(f, start + i * stagger, start + i * stagger + dur);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 8}deg)`,
              whiteSpace: 'pre',
              ...(letterStyle ? letterStyle(i) : {}),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Scramble/decode text effect */
export const Decode: React.FC<{text: string; start: number; dur?: number; style?: React.CSSProperties}> = ({
  text,
  start,
  dur = 18,
  style,
}) => {
  const f = useCurrentFrame();
  const glyphs = '01#%$&*@<>/\\|=+ABCDEFXYZ';
  const p = ramp(f, start, start + dur, 0, 1, Easing.linear);
  if (f < start) return <div style={{...style, opacity: 0}}>{text}</div>;
  const out = text
    .split('')
    .map((ch, i) => {
      if (ch === ' ') return ' ';
      const reveal = i / text.length;
      if (p >= reveal + 0.15 || p >= 1) return ch;
      return glyphs[Math.floor(random(`${text}${i}${f}`) * glyphs.length)];
    })
    .join('');
  return <div style={{whiteSpace: 'pre', ...style}}>{out}</div>;
};

/* ------------------------------------------------------------------ */
/* HUD corner brackets                                                 */
/* ------------------------------------------------------------------ */
export const Brackets: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  len?: number;
  color?: string;
  thick?: number;
  opacity?: number;
}> = ({x, y, w, h, len = 36, color = C.pink, thick = 3, opacity = 1}) => {
  const c = (l: number, t: number, rot: number) => (
    <div
      style={{
        position: 'absolute',
        left: l,
        top: t,
        width: len,
        height: len,
        borderLeft: `${thick}px solid ${color}`,
        borderTop: `${thick}px solid ${color}`,
        transform: `rotate(${rot}deg)`,
        transformOrigin: '0 0',
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
    />
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity}}>
      {c(x, y, 0)}
      {c(x + w, y, 90)}
      {c(x + w, y + h, 180)}
      {c(x, y + h, 270)}
    </div>
  );
};
