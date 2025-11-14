// path is required below

async function loadJimp(){
  try{
    const j = require('jimp');
    // some builds export default
    return j.default || j;
  }catch(e){
    // try dynamic import
    const mod = await import('jimp');
    return mod.default || mod;
  }
}
// duplicate removed

function toHex(r,g,b){
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

async function extract(imgPath){
  const Jimp = await loadJimp();
  const img = await Jimp.read(imgPath);
  // resize small for faster processing
  img.resize(40, Jimp.AUTO);
  const counts = {};
  const {bitmap} = img;
  for(let y=0;y<bitmap.height;y++){
    for(let x=0;x<bitmap.width;x++){
      const idx = (bitmap.width * y + x) << 2;
      const r = bitmap.data[idx];
      const g = bitmap.data[idx+1];
      const b = bitmap.data[idx+2];
      // quantize to reduce variations
      const rq = Math.round(r/8)*8;
      const gq = Math.round(g/8)*8;
      const bq = Math.round(b/8)*8;
      const hex = toHex(rq,gq,bq);
      counts[hex] = (counts[hex]||0)+1;
    }
  }
  const arr = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  console.log('Top colors (hex -> count):');
  arr.slice(0,10).forEach(([h,c])=> console.log(h, c));
  return arr.map(([h])=>h);
}

(async ()=>{
  const arg = process.argv[2];
  if(!arg){
    console.error('Usage: node extract-colors.js <imagePath>');
    process.exit(2);
  }
  try{
    const colors = await extract(path.resolve(arg));
    console.log('\nExtracted colors:', colors.slice(0,6).join(', '));
  }catch(e){
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
