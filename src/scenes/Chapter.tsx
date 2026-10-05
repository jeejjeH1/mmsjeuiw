import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, H, pad2, W, Work, WORKS} from '../theme';
import {beatPulse, Brackets, clamp, Decode, easeInOut, easeOut, Mono, Particles, ramp, RiseText, Backdrop} from '../fx';
import {gradAt} from './Intro';

const LEN = 180;

const WordRise: React.FC<{text: string; start: number; style?: React.CSSProperties}> = ({text, start, style}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', ...style}}>
      {text.split(' ').map((w, i) => {
        const p = ramp(f, start + i * 4, start + i * 4 + 16);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.06em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

export const Chapter: React.FC<{i: number; work: Work}> = ({i, work}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const left = i % 2 === 0; // card on the left
  const variant = i % 4;

  // ---- geometry ----
  const cw = 1180;
  const ch = 664;
  const dockX = left ? 100 : W - 100 - cw;
  const dockY = (H - ch) / 2 + 24;
  const full = ramp(f, 100, 122, 0, 1, easeInOut);
  const x = interpolate(full, [0, 1], [dockX, 0]);
  const y = interpolate(full, [0, 1], [dockY, 0]);
  const w = interpolate(full, [0, 1], [cw, W]);
  const h = interpolate(full, [0, 1], [ch, H]);
  const radius = interpolate(full, [0, 1], [26, 0]);
  const border = interpolate(full, [0, 1], [4, 0]);

  // ---- entry ----
  const e = spring({frame: f - 2, fps, config: {damping: 18, stiffness: 140, mass: 0.8}});
  const entry = (() => {
    const s = left ? 1 : -1;
    switch (variant) {
      case 0:
        return `translateY(${(1 - e) * 420}px) rotateX(${(1 - e) * 40}deg)`;
      case 1:
        return `translateX(${(1 - e) * -700 * s}px) rotateY(${(1 - e) * -50 * s}deg)`;
      case 2:
        return `scale(${0.45 + e * 0.55}) rotateZ(${(1 - e) * -8 * s}deg)`;
      default:
        return `translateY(${(1 - e) * -380}px) rotateX(${(1 - e) * -35}deg) scale(${0.8 + 0.2 * e})`;
    }
  })();
  const tilt = (1 - full) * (left ? 1 : -1) * interpolate(f, [0, 100], [9, 4], clamp);
  const pulse = beatPulse(f, 5);

  // ---- info panel ----
  const infoX = left ? dockX + cw + 60 : 100;
  const infoOut = ramp(f, 96, 112, 0, 1, Easing.in(Easing.cubic));
  const infoShift = (left ? 1 : -1) * infoOut * 120;
  const progress = f / LEN;

  const accent = [C.pink, C.green, C.magenta, C.purple][i % 4];

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop hue={(i % 3) * 14 - 14} intensity={0.85} />
      <Particles count={36} seed={`c${i}`} speed={0.6} opacity={0.7} />

      {/* giant background number */}
      <div
        style={{
          position: 'absolute',
          top: -90,
          [left ? 'right' : 'left']: -60 + f * 0.4,
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: 1000,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `3px ${C.pink}`,
          opacity: 0.09 * (1 - full),
        } as React.CSSProperties}
      >
        {pad2(i + 1)}
      </div>

      {/* vertical side ticker */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [left ? 'right' : 'left']: 34,
          width: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: (1 - full) * ramp(f, 10, 24),
        } as React.CSSProperties}
      >
        <Mono size={14} color={C.pink} style={{transform: 'rotate(-90deg)', opacity: 0.7}}>
          {`project ${pad2(i + 1)} — ${work.title} — motion collection 2026 —`}
        </Mono>
      </div>

      {/* ---------- card ---------- */}
      <AbsoluteFill style={{perspective: 2000}}>
        {/* offset shadow plates */}
        <div
          style={{
            position: 'absolute',
            left: x + (left ? 26 : -26),
            top: y + 26,
            width: w,
            height: h,
            borderRadius: radius,
            border: `2px solid ${accent}`,
            opacity: (1 - full) * ramp(f, 14, 26) * 0.8,
            transform: `${entry} rotateY(${tilt}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: w,
            height: h,
            transform: `${entry} rotateY(${tilt}deg)`,
            transformOrigin: left ? 'left center' : 'right center',
            borderRadius: radius,
            padding: border,
            background: `conic-gradient(from ${f * 4}deg, ${C.pink}, ${C.magenta}, ${C.purple}, ${C.green}, ${C.pink})`,
            boxShadow:
              full < 1
                ? `0 0 ${50 + pulse * 40}px ${C.magenta}${Math.round(0x66 + pulse * 0x50).toString(16)}, 0 40px 90px rgba(0,0,0,0.7)`
                : 'none',
          }}
        >
          <div style={{width: '100%', height: '100%', borderRadius: Math.max(0, radius - 3), overflow: 'hidden', position: 'relative', background: '#000'}}>
            <OffthreadVideo muted src={staticFile(`clips/${work.src}.mp4`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {/* shine sweep */}
            <div
              style={{
                position: 'absolute',
                top: -200,
                bottom: -200,
                width: 260,
                left: interpolate(f, [12, 42], [-400, w + 200], clamp),
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                transform: 'rotate(18deg)',
              }}
            />
            {/* chip */}
            <div
              style={{
                position: 'absolute',
                top: 22,
                left: 22,
                padding: '8px 16px',
                borderRadius: 40,
                background: 'rgba(7,2,13,0.72)',
                border: `1px solid ${C.pink}88`,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                opacity: ramp(f, 16, 24) * (1 - full),
              }}
            >
              <span style={{width: 9, height: 9, borderRadius: 9, background: C.green, boxShadow: `0 0 10px ${C.green}`, opacity: f % 30 < 18 ? 1 : 0.25}} />
              <Mono size={14} color={C.white}>{`playing · w—${pad2(i + 1)}`}</Mono>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ---------- info panel ---------- */}
      <div
        style={{
          position: 'absolute',
          left: infoX,
          top: dockY + 10,
          width: 500,
          transform: `translateX(${infoShift}px)`,
          opacity: 1 - infoOut,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: ramp(f, 8, 16)}}>
          <span style={{width: 10, height: 10, borderRadius: 10, background: C.green, boxShadow: `0 0 12px ${C.green}`}} />
          <Mono size={18} color={C.green}>project</Mono>
          <div style={{height: 2, background: `${C.green}88`, width: ramp(f, 10, 30, 0, 240)}} />
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 6}}>
          <RiseText
            text={pad2(i + 1)}
            start={8}
            stagger={4}
            style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 190, lineHeight: 1}}
            letterStyle={(k) => ({color: gradAt(0.2 + k * 0.5), textShadow: `0 0 ${30 + pulse * 25}px ${C.magenta}aa`})}
          />
          <Mono size={26} color={C.pink} style={{marginBottom: 30, opacity: ramp(f, 16, 24)}}>
            / {pad2(WORKS.length)}
          </Mono>
        </div>
        <WordRise
          text={work.title}
          start={18}
          style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 48, lineHeight: 1.14, color: C.white, marginTop: 8}}
        />
        <Decode
          text={`// ${work.subtitle}`}
          start={30}
          dur={16}
          style={{fontFamily: FONT.mono, fontSize: 21, color: C.pink, marginTop: 20, letterSpacing: 1}}
        />
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28}}>
          {work.tags.map((t, k) => {
            const s = spring({frame: f - 38 - k * 4, fps, config: {damping: 12, stiffness: 160}});
            return (
              <div
                key={t}
                style={{
                  transform: `scale(${s})`,
                  padding: '9px 18px',
                  borderRadius: 40,
                  fontFamily: FONT.mono,
                  fontSize: 16,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: k === 0 ? C.bg : C.pink,
                  background: k === 0 ? C.green : 'transparent',
                  border: `2px solid ${k === 0 ? C.green : C.pink}`,
                  boxShadow: k === 0 ? `0 0 20px ${C.green}66` : 'none',
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
        {/* progress */}
        <div style={{marginTop: 46, opacity: ramp(f, 44, 54)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
            <Mono size={14} color={C.white} style={{opacity: 0.7}}>
              runtime
            </Mono>
            <Mono size={14} color={C.white} style={{opacity: 0.7}}>
              {`00:0${Math.floor(f / 30)}:${pad2(f % 30)}`}
            </Mono>
          </div>
          <div style={{height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden'}}>
            <div style={{width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.green}, ${C.pink}, ${C.magenta})`, boxShadow: `0 0 12px ${C.pink}`}} />
          </div>
        </div>
      </div>

      {/* ---------- fullscreen overlay: lower third ---------- */}
      {full > 0 ? <LowerThird i={i} work={work} f={f} /> : null}
      <Brackets x={60} y={60} w={W - 120} h={H - 120} len={50} color={C.pink} opacity={ramp(f, 118, 128) * 0.9} />
    </AbsoluteFill>
  );
};

const LowerThird: React.FC<{i: number; work: Work; f: number}> = ({i, work, f}) => {
  const p = ramp(f, 118, 134, 0, 1, easeOut);
  return (
    <div style={{position: 'absolute', left: 90, bottom: 96, display: 'flex', alignItems: 'stretch', overflow: 'hidden'}}>
      <div
        style={{
          background: C.magenta,
          color: C.bg,
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: 44,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          transform: `translateY(${(1 - p) * 120}%)`,
        }}
      >
        {pad2(i + 1)}
      </div>
      <div
        style={{
          background: 'rgba(7,2,13,0.82)',
          borderTop: `3px solid ${C.green}`,
          padding: '12px 28px',
          clipPath: `inset(0 ${(1 - ramp(f, 122, 140, 0, 1, easeOut)) * 100}% 0 0)`,
        }}
      >
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 30, color: C.white, whiteSpace: 'nowrap'}}>{work.title}</div>
        <Mono size={15} color={C.pink} style={{marginTop: 4}}>
          {work.tags.join(' · ')}
        </Mono>
      </div>
    </div>
  );
};

