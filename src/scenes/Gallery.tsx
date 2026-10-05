import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, Easing} from 'remotion';
import {C, FONT, H, pad2, W, WORKS} from '../theme';
import {Backdrop, clamp, Flash, Mono, ramp, RGBSplit, RiseText} from '../fx';
import {gradAt} from './Intro';

const clip = (name: string) => staticFile(`clips/${name}.mp4`);

/* ---------- 3D wall of works (90 frames) ---------- */
export const Wall: React.FC = () => {
  const f = useCurrentFrame();
  const rows = 3;
  const per = 5;
  const tw = 560;
  const th = 315;
  const gap = 34;
  const pull = ramp(f, 0, 90, 0, 1, Easing.out(Easing.quad));
  const textIn = ramp(f, 10, 26);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop intensity={0.9} />
      <AbsoluteFill style={{perspective: 1600}}>
        <AbsoluteFill
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(${interpolate(pull, [0, 1], [500, -150])}px) rotateX(${interpolate(pull, [0, 1], [38, 22])}deg) rotateZ(${interpolate(
              pull,
              [0, 1],
              [-22, -12],
            )}deg)`,
          }}
        >
          {new Array(rows).fill(0).map((_, r) => {
            const dir = r % 2 ? 1 : -1;
            const x0 = W / 2 - (per * (tw + gap)) / 2 + dir * (f * 7) - dir * 200;
            return (
              <div key={r} style={{position: 'absolute', top: H / 2 - (rows * (th + gap)) / 2 + r * (th + gap), left: x0, display: 'flex', gap}}>
                {new Array(per).fill(0).map((__, c) => {
                  const k = (r * per + c * 3 + r) % WORKS.length;
                  const appear = ramp(f, (r + c) * 2, (r + c) * 2 + 14);
                  return (
                    <div
                      key={c}
                      style={{
                        width: tw,
                        height: th,
                        borderRadius: 18,
                        overflow: 'hidden',
                        border: `3px solid ${[C.pink, C.magenta, C.green][(r + c) % 3]}`,
                        boxShadow: `0 0 40px ${C.magenta}88`,
                        opacity: appear,
                        transform: `scale(${0.7 + appear * 0.3})`,
                        background: C.bg2,
                      }}
                    >
                      <OffthreadVideo
                        muted
                        src={clip(WORKS[k].src)}
                        trimBefore={(r * 37 + c * 23) % 60}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, ${C.bg}ee 0%, ${C.bg}aa 38%, transparent 68%)`, opacity: textIn}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <RiseText
          text="8 PROJECTS"
          start={10}
          stagger={2}
          style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 170, lineHeight: 1}}
          letterStyle={(i) => ({color: gradAt(i / 9), textShadow: `0 0 40px ${C.magenta}`})}
        />
        <div style={{opacity: ramp(f, 24, 34), marginTop: 18}}>
          <Mono size={26} color={C.green}>
            one collection · one vision
          </Mono>
        </div>
      </AbsoluteFill>
      <Flash at={0} len={10} color={C.magenta} max={0.8} />
    </AbsoluteFill>
  );
};

/* ---------- flash-cut teaser (90 frames) ---------- */
const CUTS = [0, 8, 15, 23, 30, 38, 45, 53, 60, 68, 75, 83, 90];
const PICKS = [
  {src: 'x1', at: 0},
  {src: 'w3', at: 20},
  {src: 'w4', at: 120},
  {src: 'w5', at: 60},
  {src: 'w1', at: 0},
  {src: 'w2', at: 140},
  {src: 'w6', at: 150},
  {src: 'w7', at: 160},
  {src: 'w8', at: 150},
  {src: 'x2', at: 30},
  {src: 'w3', at: 100},
  {src: 'w1', at: 120},
];
const TINTS = [C.pink, C.green, C.magenta, C.purple];

export const FlashCuts: React.FC = () => {
  const f = useCurrentFrame();
  const k = CUTS.findIndex((c, i) => f >= c && f < CUTS[i + 1]);
  const idx = Math.max(0, k);
  const start = CUTS[idx];
  const lf = f - start;
  const pick = PICKS[idx];
  const zoom = interpolate(lf, [0, 8], [1.22, 1.04], {...clamp, easing: Easing.out(Easing.cubic)});
  const tint = TINTS[idx % TINTS.length];
  const workNo = pick.src.startsWith('w') ? Number(pick.src.slice(1)) : 1 + (idx % 8);
  const finalHit = ramp(f, 75, 90);
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Sequence from={start} durationInFrames={CUTS[idx + 1] - start} layout="none">
        <RGBSplit amount={interpolate(lf, [0, 3], [22 * (idx % 2 ? -1 : 1), 0], clamp)}>
          <AbsoluteFill style={{transform: `scale(${zoom}) rotate(${(idx % 2 ? 1 : -1) * (1 - Math.min(1, lf / 6)) * 2}deg)`}}>
            <OffthreadVideo muted src={clip(pick.src)} trimBefore={pick.at} style={{width: '100%', height: '100%'}} />
          </AbsoluteFill>
        </RGBSplit>
      </Sequence>
      <AbsoluteFill style={{background: tint, mixBlendMode: 'color', opacity: interpolate(lf, [0, 5], [0.55, 0], clamp)}} />
      <AbsoluteFill style={{background: tint, opacity: interpolate(lf, [0, 2], [0.5, 0], clamp)}} />
      {/* big outline index */}
      <div
        style={{
          position: 'absolute',
          left: idx % 2 ? undefined : 70,
          right: idx % 2 ? 70 : undefined,
          bottom: 40,
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: 260,
          lineHeight: 1,
          color: 'rgba(7,2,13,0.45)',
          WebkitTextStroke: `4px ${C.white}`,
          opacity: 0.85,
          filter: `drop-shadow(0 0 20px ${tint})`,
        }}
      >
        {pad2(workNo)}
      </div>
      <Mono size={22} color={C.white} style={{position: 'absolute', top: 70, left: 90, background: `${C.bg}aa`, padding: '6px 14px'}}>
        {`rec ● cut ${pad2(idx + 1)} / 12`}
      </Mono>
      {/* closing kinetic slam */}
      {finalHit > 0 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: `rgba(220,0,255,${finalHit * 0.85})`}}>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 900,
              fontSize: 170,
              color: C.bg,
              letterSpacing: `${interpolate(finalHit, [0, 1], [0.22, 0.04])}em`,
              transform: `scale(${interpolate(finalHit, [0, 0.4, 1], [1.25, 1, 1.04])})`,
              opacity: Math.min(1, finalHit * 3),
            }}
          >
            THE WORKS
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
