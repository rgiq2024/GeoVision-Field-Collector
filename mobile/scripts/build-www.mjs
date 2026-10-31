// Builds mobile/www from the web app in the repo root, with every library and font bundled
// so the installed app works with no internet.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const www = join(mobile, 'www');
const nm = join(mobile, 'node_modules');
rmSync(www, { recursive: true, force: true });
mkdirSync(join(www, 'vendor'), { recursive: true });
mkdirSync(join(www, 'fonts'), { recursive: true });

const vendor = {
  'leaflet.js': 'leaflet/dist/leaflet.js',
  'lz-string.min.js': 'lz-string/libs/lz-string.min.js',
  'jsQR.js': 'jsqr/dist/jsQR.js'
};
for (const [out, src] of Object.entries(vendor)) copyFileSync(join(nm, src), join(www, 'vendor', out));

const fonts = [
  ['Barlow Condensed', 'barlow-condensed', [500, 600, 700]],
  ['IBM Plex Sans', 'ibm-plex-sans', [400, 500, 600]],
  ['IBM Plex Mono', 'ibm-plex-mono', [400, 500, 600]]
];
let css = '';
for (const [family, pkg, weights] of fonts) {
  for (const w of weights) {
    const file = `${pkg}-latin-${w}-normal.woff2`;
    copyFileSync(join(nm, '@fontsource', pkg, 'files', file), join(www, 'fonts', file));
    css += `@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:swap;src:url(fonts/${file}) format('woff2')}\n`;
  }
}
writeFileSync(join(www, 'fonts.css'), css);

let html = readFileSync(join(mobile, '..', 'index.html'), 'utf8');
const swap = (from, to) => { if (!html.includes(from)) throw new Error('Not found in index.html: ' + from); html = html.replace(from, to); };
swap('<link rel="manifest" href="manifest.json">\n', '');
swap('<link rel="preconnect" href="https://fonts.googleapis.com">\n', '');
html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/, '<link rel="stylesheet" href="fonts.css">');
swap('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js', 'vendor/leaflet.js');
swap('https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js', 'vendor/lz-string.min.js');
swap('<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>\n', '');
swap('https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js', 'vendor/jsQR.js');
html = html.replace('<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">');
writeFileSync(join(www, 'index.html'), html);
copyFileSync(join(mobile, '..', 'icon-512.png'), join(www, 'icon-512.png'));
console.log('www built:', readdirSync(www).join(', '));
