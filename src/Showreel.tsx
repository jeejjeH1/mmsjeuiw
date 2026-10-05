import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {T, WORKS} from './theme';
import {Grain, Scanlines, Vignette} from './fx';
import {Intro} from './scenes/Intro';
import {FlashCuts, Wall} from './scenes/Gallery';
import {Chapter} from './scenes/Chapter';
import {Finale} from './scenes/Finale';
import {Outro} from './scenes/Outro';
import {Wipe, WipeKind} from './scenes/Wipe';
import {Hud} from './Hud';

const KINDS: WipeKind[] = ['bars', 'slices', 'iris', 'blinds'];

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Sequence durationInFrames={T.wall} name="Intro">
      <Intro />
    </Sequence>
    <Sequence from={T.wall} durationInFrames={T.flash - T.wall} name="Wall">
      <Wall />
    </Sequence>
    <Sequence from={T.flash} durationInFrames={T.chapters - T.flash} name="Flash cuts">
      <FlashCuts />
    </Sequence>
    {WORKS.map((w, i) => (
      <Sequence key={w.src} from={T.chapters + i * T.chapterLen} durationInFrames={T.chapterLen} name={`Work ${i + 1}`}>
        <Chapter i={i} work={w} />
      </Sequence>
    ))}
    <Sequence from={T.finale} durationInFrames={T.outro - T.finale} name="Finale">
      <Finale />
    </Sequence>
    <Sequence from={T.outro} durationInFrames={T.end - T.outro} name="Outro">
      <Outro />
    </Sequence>

    {/* transitions on every chapter boundary + into the finale */}
    {WORKS.map((_, i) =>
      i === 0 ? null : (
        <Wipe key={i} at={T.chapters + i * T.chapterLen} kind={KINDS[i % KINDS.length]} label={`work ${String(i + 1).padStart(2, '0')}`} />
      ),
    )}
    <Wipe at={T.chapters} kind="bars" cover={8} reveal={12} />
    <Wipe at={T.finale} kind="iris" label="all together" />

    <Hud />
    <Scanlines opacity={0.06} />
    <Vignette strength={0.55} />
    <Grain opacity={0.08} />
    <Audio src={staticFile('music.wav')} />
  </AbsoluteFill>
);
