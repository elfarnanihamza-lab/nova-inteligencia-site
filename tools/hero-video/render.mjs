// Rendu de la vidéo du hero : node tools/hero-video/render.mjs <sortie> [largeur hauteur kbps mime]
// Ouvre scene.html dans Edge/Chrome sans fenêtre, enregistre une boucle complète via MediaRecorder, écrit le fichier.
// Aucune dépendance : seulement Node 22+ et Edge ou Chrome. Avec « poster », écrit aussi une image PNG de la scène.
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [out, w = '1280', h = '720', kbps = '1800', mime = 'video/webm;codecs=vp9'] = process.argv.slice(2);
if (!out) { console.error('usage : render.mjs <sortie> [w h kbps mime]'); process.exit(1); }
const browser = process.env.BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(browser, ['--headless=new', `--remote-debugging-port=${port}`, '--user-data-dir=' + (process.env.TEMP || '/tmp') + '/hero-video-' + port, '--autoplay-policy=no-user-gesture-required', 'about:blank'], { stdio: 'ignore' });
await wait(2500);
const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const p = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && p.has(d.id)) { p.get(d.id)(d); p.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => { const d = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (d.result?.exceptionDetails) throw new Error(d.result.exceptionDetails.exception?.description); return d.result?.result?.value; };

const scene = pathToFileURL(resolve(dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), 'scene.html')).href + `?w=${w}&h=${h}&${process.env.SCENE_QUERY || ""}`;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: scene });
await wait(1500);
mkdirSync(dirname(resolve(out)), { recursive: true });
if (mime === 'poster') {
  const png = await ev('window.renderAt(0)');
  writeFileSync(out, Buffer.from(png.split(',')[1], 'base64'));
  console.log('poster', out);
} else {
  const info = await ev(`window.record({ mime: ${JSON.stringify(mime)}, bitrate: ${+kbps * 1000} })`);
  const parts = [];
  for (let off = 0; off < info.size; off += 700000) parts.push(Buffer.from(await ev(`window.readChunk(${off}, 700000)`), 'base64'));
  writeFileSync(out, Buffer.concat(parts));
  console.log(out, Math.round(info.size / 1024) + ' Ko', info.type);
}
ws.close(); proc.kill();
