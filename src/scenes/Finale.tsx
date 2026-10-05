import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, Easing} from 'remotion';
import {C, FONT, H, pad2, W, WORKS} from '../theme';
import {Backdrop, beatPulse, clamp, easeIn, Flash, GridFloor, Mono, Particles, ramp, RGBSplit, RiseText} from '../fx';
import {gradAt} from './Intro';

/* ---------- 240 frames: every work at once ---------- */
export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 4;
  const tw = 400;
  const th = 225;
  const gap = 28;
  const gw = cols * tw + (cols - 1) * gap;
  const gh = 2 * th + gap;
  const gx = (W - gw) / 2;
  const gy = 430;

  const land = ramp(f, 0, 56, 0, 1, Easing.out(Easing.cubic));
  const push = ramp(f, 56, 200, 0, 1, Easing.inOut(Easing.quad));
  const beat = Math.floor(f / 15);
  const pulse = beatPulse(f, 5);
  const titleOut = ramp(f, 196, 210);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop intensity={1} />
      <GridFloor opacity={0.35} speed={3} color={C.purple} />
      <Particles count={80} seed="fin" speed={1.4} />

      <AbsoluteFill style={{perspective: 1800}}>
        <AbsoluteFill
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: `${W / 2}px ${gy + gh / 2}px`,
            transform: `rotateX(${interpolate(land, [0, 1], [58, 0])}deg) rotateZ(${interpolate(land, [0, 1], [-24, 0])}deg) scale(${
              interpolate(land, [0, 1], [2.1, 1]) * (1 + push * 0.06)
            })`,
          }}
        >
          {WORKS.map((wk, k) => {
            const r = Math.floor(k / cols);
            const c = k % cols;
            const flip = ramp(f, 6 + k * 4, 26 + k * 4, 0, 1, Easing.out(Easing.back(1.4)));
            const hot = f > 60 && f < 200 && beat % WORKS.length === k;
            const fly = ramp(f, 200 + ((k * 3) % 8) * 2, 230 + ((k * 3) % 8) * 2, 0, 1, easeIn);
            const dx = (c - 1.5) * 900 * fly;
            const dy = (r - 0.5) * 900 * fly;
            return (
              <div
                key={wk.src}
                style={{
                  position: 'absolute',
                  left: gx + c * (tw + gap),
                  top: gy + r * (th + gap),
                  width: tw,
                  height: th,
                  borderRadius: 16,
                  padding: 3,
                  background: hot ? C.green : `linear-gradient(135deg, ${C.pink}, ${C.magenta}, ${C.purple})`,
                  boxShadow: hot ? `0 0 ${30 + pulse * 40}px ${C.green}` : `0 0 30px ${C.magenta}66`,
                  transform: `translate3d(${dx}px, ${dy}px, ${fly * 1400}px) rotateY(${(1 - flip) * 90}deg) rotateZ(${fly * (random(`fz${k}`) - 0.5) * 60}deg) scale(${
                    hot ? 1 + pulse * 0.05 : 1
                  })`,
                  opacity: Math.min(1, flip * 1.5) * (1 - ramp(f, 222, 236)),
                }}
              >
                <div style={{width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: '#000'}}>
                  <OffthreadVideo muted src={staticFile(`clips/${wk.src}.mp4`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 10,
                      bottom: 10,
                      fontFamily: FONT.mono,
                      fontSize: 14,
                      color: C.white,
                      background: 'rgba(7,2,13,0.7)',
                      padding: '3px 8px',
                      borderRadius: 4,
                      letterSpacing: 2,
                    }}
                  >
                    {pad2(k + 1)}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* headline */}
      <RGBSplit amount={f >= 120 && f < 123 ? 12 : 0}>
        <div style={{position: 'absolute', top: 120, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - titleOut}}>
          <Mono size={22} color={C.green} style={{opacity: ramp(f, 30, 40)}}>
            {'— the collection —'}
          </Mono>
          <div style={{display: 'flex', gap: 40, marginTop: 14}}>
            <RiseText
              text="ONE"
              start={36}
              stagger={3}
              style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 140, lineHeight: 1}}
              letterStyle={() => ({color: C.white, textShadow: `0 0 30px ${C.pink}`})}
            />
            <RiseText
              text="VISION"
              start={44}
              stagger={3}
              style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 140, lineHeight: 1}}
              letterStyle={(i) => ({color: gradAt(i / 5), textShadow: `0 0 40px ${C.magenta}`})}
            />
          </div>
        </div>
      </RGBSplit>
      <Mono size={18} color={C.white} style={{position: 'absolute', bottom: 120, width: W, textAlign: 'center', opacity: ramp(f, 70, 84) * (1 - titleOut) * 0.85}}>
        {`8 projects · kinetic type · ui motion · character · explainers`}
      </Mono>
      <Flash at={0} len={12} color={C.white} max={0.9} />
      <Flash at={226} len={14} color={C.white} />
    </AbsoluteFill>
  );
};
