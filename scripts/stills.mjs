// Usage: node scripts/stills.mjs outDir frame1 frame2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...frames] = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Showreel', browserExecutable});
for (const f of frames) {
  await renderStill({composition, serveUrl, frame: Number(f), output: path.join(outDir, `f${String(f).padStart(4, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.5});
  console.log('frame', f);
}
