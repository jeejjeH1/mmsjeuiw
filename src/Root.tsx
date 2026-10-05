import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import '@fontsource/unbounded/400.css';
import '@fontsource/unbounded/700.css';
import '@fontsource/unbounded/900.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/vazirmatn/700.css';
import {Showreel} from './Showreel';
import {FPS, H, T, W} from './theme';

const fontHandle = delayRender('fonts');
Promise.all(
  ['400 40px Unbounded', '700 40px Unbounded', '900 40px Unbounded', '400 20px "Space Mono"', '700 20px "Space Mono"'].map((f) =>
    document.fonts.load(f),
  ),
)
  .then(() => document.fonts.load('700 40px Vazirmatn', 'ممنون'))
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

export const Root: React.FC = () => (
  <Composition id="Showreel" component={Showreel} durationInFrames={T.end} fps={FPS} width={W} height={H} />
);
