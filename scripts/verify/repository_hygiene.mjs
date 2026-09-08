import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

const root = process.cwd();
const trackedAndVisible = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { cwd: root }
).toString('utf8').split('\0').filter(Boolean);

const textExtensions = new Set([
  '.cff', '.css', '.html', '.js', '.json', '.md', '.mjs', '.py', '.svg',
  '.toml', '.ts', '.tsx', '.txt', '.yaml', '.yml',
]);
const textNames = new Set([
  '.gitattributes', '.gitignore', 'LICENSE',
]);
const decoder = new TextDecoder('utf-8', { fatal: true });
const problems = [];
let textCount = 0;
let jsonCount = 0;
let markdownCount = 0;

function textFor(path) {
  if (!textExtensions.has(extname(path).toLowerCase()) &&
      !textNames.has(path.split('/').at(-1))) {
    return null;
  }
  const data = readFileSync(resolve(root, path));
  if (data.includes(0)) return null;
  try {
    return decoder.decode(data);
  } catch {
    return null;
  }
}

function lineFor(text, index) {
  return text.slice(0, index).split('\n').length;
}

function checkMarkdownLinks(path, source) {
  const expression = /!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of source.matchAll(expression)) {
    let target = match[1];
    if (target.startsWith('<') && target.endsWith('>')) {
      target = target.slice(1, -1);
    }
    if (/^(?:https?:|mailto:|data:|#)/i.test(target)) continue;

    target = target.split('#', 1)[0].split('?', 1)[0];
    if (!target) continue;

    try {
      target = decodeURIComponent(target);
    } catch {
      problems.push(`${path}:${lineFor(source, match.index)} invalid link encoding: ${target}`);
      continue;
    }

    const absolute = resolve(root, dirname(path), target);
    if (!existsSync(absolute)) {
      problems.push(`${path}:${lineFor(source, match.index)} missing local link: ${match[1]}`);
    }
  }
}

for (const path of trackedAndVisible) {
  const source = textFor(path);
  if (source === null) continue;
  textCount += 1;

  const forbidden = /[\u2010-\u2015\u2212]/gu;
  for (const match of source.matchAll(forbidden)) {
    const codePoint = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    problems.push(`${path}:${lineFor(source, match.index)} prohibited Unicode U+${codePoint}`);
  }

  if (extname(path).toLowerCase() === '.json') {
    jsonCount += 1;
    try {
      JSON.parse(source);
    } catch (error) {
      problems.push(`${path} invalid JSON: ${error.message}`);
    }
  }

  if (extname(path).toLowerCase() === '.md') {
    markdownCount += 1;
    checkMarkdownLinks(path, source);
  }
}

if (problems.length > 0) {
  console.error('Repository hygiene check failed:\n');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(
  `Repository hygiene passed: ${textCount} text files, ${jsonCount} JSON files, ` +
  `${markdownCount} Markdown files.`
);
