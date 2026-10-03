#!/usr/bin/env node
/* Build della libreria: tsc (JS + .d.ts) e un unico foglio di stile dist/edugamer.css con font. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });

const tsc = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
execFileSync(process.execPath, [tsc, '-p', path.join(root, 'tsconfig.json')], { stdio: 'inherit' });

const css = ['fonts.css', 'theme.css', 'components.css']
  .map(f => fs.readFileSync(path.join(root, 'src', 'styles', f), 'utf8'))
  .join('\n');
fs.writeFileSync(path.join(dist, 'edugamer.css'), css);
fs.cpSync(path.join(root, 'fonts'), path.join(dist, 'fonts'), { recursive: true });
console.log('✅ design-system/dist pronto');
