#!/usr/bin/env node
/*
 * Regénère courses/index.json à partir des fichiers id_<code>_<nom>.md du dossier courses/.
 * Facultatif : la vue apprenant sait aussi lister le dossier sans index (serveur local,
 * ou API GitHub sur GitHub Pages), mais l'index est plus rapide et plus fiable.
 *
 *   node tools/build-courses-index.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'courses');

function frontMatter(text) {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const out = {};
  if (!m) return out;
  m[1].split(/\r?\n/).forEach((line) => {
    const kv = /^([a-z]+):\s*(.*)$/i.exec(line);
    if (kv && kv[2] !== '') out[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  });
  return out;
}

const courses = fs.readdirSync(dir)
  .filter((f) => /^id_[^_]+_.+\.md$/i.test(f))
  .sort()
  .map((file) => {
    const fm = frontMatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    const entry = { id: /^id_([^_]+)_/i.exec(file)[1], file };
    if (fm.title) entry.title = fm.title;
    if (fm.lang) entry.lang = fm.lang;
    return entry;
  });

const ids = {};
courses.forEach((c) => {
  if (ids[c.id]) console.warn(`⚠ Code ${c.id} utilisé deux fois : ${ids[c.id]} et ${c.file}`);
  ids[c.id] = c.file;
});

fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify({ courses }, null, 2) + '\n');
console.log(`courses/index.json : ${courses.length} cours.`);
