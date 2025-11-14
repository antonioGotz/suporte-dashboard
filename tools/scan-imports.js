const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend', 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.json'];

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
  // handle only relative imports
  if (!imp.startsWith('.') ) return null;
  const base = path.dirname(sourceFile);
  let candidate = path.resolve(base, imp);
  // if it already points to a file with ext, check directly
  if (exts.includes(path.extname(candidate))) {
    return fs.existsSync(candidate) ? null : imp;
  }
  // try adding extensions
  for (const e of exts) {
    if (fs.existsSync(candidate + e)) return null;
  }
  // try index files
  for (const e of exts) {
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
  console.log('No broken relative imports found');
  process.exit(0);
}
console.log('Broken imports:');
for (const b of broken) console.log(`${b.file} -> ${b.import}`);
process.exit(1);
