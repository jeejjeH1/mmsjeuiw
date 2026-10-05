import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, Easing} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {
  Backdrop,
  beatPulse,
  Brackets,
  clamp,
  Decode,
  easeIn,
  Flash,
  GridFloor,
  Mono,
  Particles,
  ramp,
  RGBSplit,
  RiseText,
} from '../fx';

/* ---------- 0-60: boot line ---------- */
const Boot: React.FC = () => {
  const f = useCurrentFrame();
  const lineW = ramp(f, 4, 40, 0, 1500);
  const open = ramp(f, 52, 60, 2, H, Easing.in(Easing.cubic));
  const pct = Math.round(ramp(f, 4, 52, 0, 100, Easing.inOut(Easing.quad)));
  const flick = f > 44 && f < 52 && f % 3 === 0 ? 0.3 : 1;
  const logs = ['sys.boot ........ ok', 'render.engine ... ok', 'palette #ff87ff / #dc00ff', 'collection ready_'];
  return (
    <AbsoluteFill>
      <Backdrop intensity={ramp(f, 0, 50, 0, 0.6)} />
      <Particles count={40} speed={0.4} opacity={ramp(f, 0, 30)} />
      <div style={{position: 'absolute', left: 90, top: 80}}>
        {logs.map((l, i) =>
          f >= i * 15 ? (
            <Decode
              key={i}
              text={`> ${l}`}
              start={i * 15}
              dur={10}
              style={{fontFamily: FONT.mono, fontSize: 20, color: i === 3 ? C.green : C.pink, opacity: 0.85, marginBottom: 8, letterSpacing: 2}}
            />
          ) : null,
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: W / 2 - lineW / 2,
          top: H / 2 - open / 2,
          width: f >= 52 ? W : lineW,
          height: open,
          ...(f >= 52 ? {left: 0} : {}),
          background: f >= 52 ? C.magenta : `linear-gradient(90deg, transparent, ${C.pink}, ${C.magenta}, ${C.green}, transparent)`,
          boxShadow: `0 0 30px ${C.magenta}, 0 0 80px ${C.pink}`,
          opacity: flick,
        }}
      />
      <Mono
        size={22}
        color={C.white}
        style={{position: 'absolute', width: W, textAlign: 'center', top: H / 2 + 40, opacity: ramp(f, 6, 16) * (1 - ramp(f, 50, 54))}}
      >
        loading the collection — {String(pct).padStart(3, '0')}%
      </Mono>
      <Brackets x={W / 2 - 820} y={H / 2 - 120} w={1640} h={240} opacity={ramp(f, 10, 24) * (1 - ramp(f, 50, 54))} color={C.pink} />
    </AbsoluteFill>
  );
};

/* ---------- 60-120: kinetic words ---------- */
const WORDS = [
  {t: 'MOTION', bg: C.bg, fg: C.pink, mode: 'glow'},
  {t: 'DESIGN', bg: C.magenta, fg: C.bg, mode: 'fill'},
  {t: 'STORY', bg: C.bg, fg: C.green, mode: 'stroke'},
  {t: 'IMPACT', bg: C.pink, fg: C.deep, mode: 'fill'},
] as const;

const Kinetic: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(3, Math.floor(f / 15));
  const lf = f - i * 15;
  const w = WORDS[i];
  const s = interpolate(lf, [0, 6, 15], [1.35, 1, 1.06], {...clamp, easing: Easing.out(Easing.cubic)});
  const ls = interpolate(lf, [0, 7], [0.35, 0.02], {...clamp, easing: Easing.out(Easing.cubic)});
  const echoCol = w.mode === 'fill' ? w.fg : w.fg;
  const big: React.CSSProperties = {
    fontFamily: FONT.display,
    fontWeight: 900,
    fontSize: 300,
    letterSpacing: `${ls}em`,
    lineHeight: 1,
    color: w.mode === 'stroke' ? 'transparent' : w.fg,
    WebkitTextStroke: w.mode === 'stroke' ? `6px ${w.fg}` : undefined,
    textShadow: w.mode === 'glow' ? `0 0 40px ${C.magenta}, 0 0 90px ${C.magenta}` : w.mode === 'stroke' ? `0 0 30px ${C.green}` : 'none',
    whiteSpace: 'nowrap',
  };
  return (
    <AbsoluteFill style={{background: w.bg, overflow: 'hidden'}}>
      {/* echo rows */}
      {[-2, -1, 1, 2].map((r) => (
        <div
          key={r}
          style={{
            position: 'absolute',
            top: H / 2 + r * 250 - 125,
            left: -400 + (r % 2 === 0 ? -1 : 1) * lf * 14 + r * 120,
            fontFamily: FONT.display,
            fontWeight: 900,
            fontSize: 230,
            color: 'transparent',
            WebkitTextStroke: `2px ${echoCol}`,
            opacity: 0.28,
            whiteSpace: 'nowrap',
          }}
        >
          {`${w.t} ${w.t} ${w.t} ${w.t}`}
        </div>
      ))}
      <RGBSplit amount={interpolate(lf, [0, 4], [18, 0], clamp)}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{...big, transform: `scale(${s})`}}>{w.t}</div>
        </AbsoluteFill>
      </RGBSplit>
      <Mono size={20} color={w.bg === C.bg ? C.pink : C.bg} style={{position: 'absolute', left: 90, bottom: 80}}>
        {`0${i + 1} / 04`}
      </Mono>
      <Mono size={20} color={w.bg === C.bg ? C.pink : C.bg} style={{position: 'absolute', right: 90, bottom: 80}}>
        motion collection
      </Mono>
    </AbsoluteFill>
  );
};

/* ---------- 120-240: title ---------- */
const lerpColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((k) => parseInt(a.slice(k, k + 2), 16));
  const pb = [1, 3, 5].map((k) => parseInt(b.slice(k, k + 2), 16));
  return `rgb(${pa.map((v, k) => Math.round(v + (pb[k] - v) * t)).join(',')})`;
};
export const gradAt = (t: number) => (t < 0.5 ? lerpColor(C.pink, C.magenta, t * 2) : lerpColor(C.magenta, C.purple, (t - 0.5) * 2));

const Title: React.FC = () => {
  const f = useCurrentFrame(); // 0..120
  const push = ramp(f, 96, 120, 0, 1, easeIn);
  const glitch =
    (f >= 30 && f < 34) || (f >= 60 && f < 63) || (f >= 90 && f < 92) ? 14 * (f % 2 === 0 ? 1 : -0.7) : 0;
  const pulse = beatPulse(f, 6);
  const rings = [0, 6, 12];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop intensity={0.8} />
      <GridFloor opacity={ramp(f, 0, 20) * 0.8} speed={5} />
      <Particles count={70} seed="t" speed={1.2} />
      {rings.map((d, i) => {
        const p = ramp(f, d, d + 45, 0, 1, Easing.out(Easing.quad));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: W / 2 - 300,
              top: H / 2 - 300,
              width: 600,
              height: 600,
              borderRadius: '50%',
              border: `${6 - i * 1.5}px solid ${[C.pink, C.magenta, C.green][i]}`,
              transform: `scale(${0.1 + p * 3})`,
              opacity: (1 - p) * 0.9,
              boxShadow: `0 0 40px ${[C.pink, C.magenta, C.green][i]}`,
            }}
          />
        );
      })}
      <RGBSplit amount={glitch}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${(1 + pulse * 0.012) * (1 + push * 7)})`,
            filter: push > 0 ? `blur(${push * 18}px)` : undefined,
            opacity: 1 - ramp(f, 112, 120),
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -40}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26, opacity: ramp(f, 40, 50)}}>
              <div
                style={{
                  padding: '10px 26px',
                  borderRadius: 100,
                  border: `2px solid ${C.green}`,
                  fontFamily: FONT.mono,
                  fontSize: 20,
                  letterSpacing: 4,
                  color: C.green,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: `0 0 20px ${C.green}55`,
                }}
              >
                <span style={{width: 10, height: 10, borderRadius: 10, background: C.green, display: 'inline-block', boxShadow: `0 0 10px ${C.green}`}} />
                SHOWREEL 2026
              </div>
            </div>
            <RiseText
              text="MOTION"
              start={4}
              stagger={3}
              style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 230, lineHeight: 1, letterSpacing: '0.02em'}}
              letterStyle={(i) => ({
                color: gradAt(i / 5),
                textShadow: `0 0 50px ${C.magenta}99`,
              })}
            />
            <RiseText
              text="COLLECTION"
              start={18}
              stagger={2}
              style={{
                fontFamily: FONT.display,
                fontWeight: 700,
                fontSize: 104,
                lineHeight: 1.05,
                letterSpacing: '0.12em',
                marginTop: 6,
              }}
              letterStyle={() => ({color: 'transparent', WebkitTextStroke: `2.5px ${C.pink}`, filter: `drop-shadow(0 0 12px ${C.magenta})`})}
            />
            <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34, opacity: ramp(f, 50, 62)}}>
              <div style={{width: ramp(f, 50, 70, 0, 160), height: 2, background: C.pink}} />
              <Mono size={22} color={C.white}>
                selected works · 01 — 08
              </Mono>
              <div style={{width: ramp(f, 50, 70, 0, 160), height: 2, background: C.pink}} />
            </div>
          </div>
        </AbsoluteFill>
      </RGBSplit>
      <Flash at={0} len={14} color={C.white} />
      <Flash at={112} len={8} color={C.magenta} max={0.9} />
    </AbsoluteFill>
  );
};

export const Intro: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={60}>
      <Boot />
    </Sequence>
    <Sequence from={60} durationInFrames={60}>
      <Kinetic />
    </Sequence>
    <Sequence from={120} durationInFrames={120}>
      <Title />
    </Sequence>
  </AbsoluteFill>
);
