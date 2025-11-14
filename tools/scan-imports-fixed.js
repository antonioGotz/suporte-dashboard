const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend', 'src');
const codeExts = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const assetExts = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'];

function listFiles(dir) {
  let res = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) res = res.concat(listFiles(full));
    else if (/\.(js|jsx|ts|tsx)$/.test(name)) res.push(full);
  }
  return res;
}

function checkImport(sourceFile, imp) {
  if (!imp.startsWith('.')) return null; // only relative
  const ext = path.extname(imp).toLowerCase();
  // ignore explicit asset imports
  if (assetExts.includes(ext)) return null;
  // if import has explicit code ext, check directly
  const base = path.dirname(sourceFile);
  let candidate = path.resolve(base, imp);
  if (codeExts.includes(ext)) {
    return fs.existsSync(candidate) ? null : imp;
  }
  // if import has no ext: try code extensions and index files
  for (const e of codeExts) {
    if (fs.existsSync(candidate + e)) return null;
  }
  for (const e of codeExts) {
    if (fs.existsSync(path.join(candidate, 'index' + e))) return null;
  }
  return imp;
}

const files = listFiles(root);
const broken = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /import\s+[^'\"]+['\"]([^'\"]+)['\"]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const imp = m[1];
    const res = checkImport(f, imp);
    if (res) broken.push({ file: path.relative(root, f), import: imp });
  }
}

if (broken.length === 0) {
  console.log('No broken relative code imports found');
  process.exit(0);
}
console.log('Broken imports:');
for (const b of broken) console.log(`${b.file} -> ${b.import}`);
process.exit(1);
