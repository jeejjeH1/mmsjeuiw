import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, H, W} from '../theme';
import {clamp, easeInOut, Mono} from '../fx';

export type WipeKind = 'bars' | 'iris' | 'blinds' | 'slices';

/**
 * Transition overlay centred on frame `at` (relative to the parent sequence):
 * covers the screen over [at-cover, at] and uncovers over [at, at+reveal].
 */
export const Wipe: React.FC<{at: number; kind: WipeKind; label?: string; cover?: number; reveal?: number}> = ({
  at,
  kind,
  label,
  cover = 10,
  reveal = 12,
}) => {
  const f = useCurrentFrame();
  if (f < at - cover - 6 || f > at + reveal + 8) return null;
  const pin = interpolate(f, [at - cover, at], [0, 1], {...clamp, easing: easeInOut});
  const pout = interpolate(f, [at, at + reveal], [0, 1], {...clamp, easing: easeInOut});
  const cols = [C.pink, C.magenta, C.purple, C.green, C.deep];

  if (kind === 'bars') {
    return (
      <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
        {cols.map((col, i) => {
          const d = i * 0.12;
          const a = interpolate(pin, [d, Math.min(1, d + 0.6)], [0, 1], clamp);
          const b = interpolate(pout, [d * 0.8, Math.min(1, d * 0.8 + 0.6)], [0, 1], clamp);
          const x = -W * 1.4 + a * W * 1.4 + b * W * 1.6;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: -200,
                left: x - i * 40,
                width: W * 1.3,
                height: H + 400,
                background: col,
                transform: 'skewX(-18deg)',
                boxShadow: `0 0 60px ${col}`,
              }}
            />
          );
        })}
        <Label label={label} o={pin * (1 - pout)} />
      </AbsoluteFill>
    );
  }

  if (kind === 'iris') {
    const R = Math.hypot(W, H) / 2 + 40;
    const r = pin * R;
    const hole = pout * R;
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at center, transparent ${hole}px, ${C.magenta} ${hole + 1}px, ${C.magenta} ${r}px, transparent ${r + 1}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: W / 2 - Math.max(r, hole) - 10,
            top: H / 2 - Math.max(r, hole) - 10,
            width: (Math.max(r, hole) + 10) * 2,
            height: (Math.max(r, hole) + 10) * 2,
            borderRadius: '50%',
            border: `14px solid ${pout > 0 ? C.green : C.pink}`,
            opacity: pout > 0.98 ? 0 : 1,
          }}
        />
        <Label label={label} o={pin * (1 - pout)} />
      </AbsoluteFill>
    );
  }

  if (kind === 'blinds') {
    const n = 12;
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {new Array(n).fill(0).map((_, i) => {
          const d = (i / n) * 0.5;
          const a = interpolate(pin, [d, d + 0.5], [0, 1], clamp);
          const b = interpolate(pout, [d, d + 0.5], [0, 1], clamp);
          const s = b > 0 ? 1 - b : a;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: (i * W) / n,
                width: W / n + 2,
                top: 0,
                height: H,
                background: i % 2 ? C.magenta : C.pink,
                transform: `scaleY(${s})`,
                transformOrigin: b > 0 ? 'bottom' : 'top',
              }}
            />
          );
        })}
        <Label label={label} o={pin * (1 - pout)} dark />
      </AbsoluteFill>
    );
  }

  // slices
  const n = 8;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {new Array(n).fill(0).map((_, i) => {
        const dir = i % 2 ? 1 : -1;
        const d = ((i * 3) % n) / n * 0.4;
        const a = interpolate(pin, [d, d + 0.6], [0, 1], clamp);
        const b = interpolate(pout, [d, d + 0.6], [0, 1], clamp);
        const x = dir * (1 - a) * W + -dir * b * W;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: (i * H) / n,
              height: H / n + 2,
              left: x,
              width: W,
              background: [C.purple, C.magenta, C.pink, C.deep][i % 4],
              borderTop: i % 3 === 0 ? `3px solid ${C.green}` : undefined,
            }}
          />
        );
      })}
      <Label label={label} o={pin * (1 - pout)} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{label?: string; o: number; dark?: boolean}> = ({label, o, dark}) =>
  label ? (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <Mono size={34} color={dark ? C.bg : C.white} style={{fontWeight: 700}}>
        {label}
      </Mono>
    </AbsoluteFill>
  ) : null;
