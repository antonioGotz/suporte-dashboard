// Lightweight runtime PDF export without bundling deps.
// Dynamically loads html2canvas and jsPDF from CDN and exports a DOM node as a single-page PDF.

const ensureScript = (id, src) => new Promise((resolve, reject) => {
  if (document.getElementById(id)) return resolve();
  const s = document.createElement('script');
  s.id = id; s.src = src; s.async = true; s.onload = () => resolve(); s.onerror = reject;
  document.head.appendChild(s);
});

async function ensureLibs() {
  // Use stable CDN urls; allow existing globals
  if (!window.html2canvas) {
    await ensureScript('html2canvas-cdn', 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
  }
  if (!window.jspdf && !window.jsPDF) {
    await ensureScript('jspdf-cdn', 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
  }
}

export async function exportElementToPdf(node, filename = 'etiqueta.pdf') {
  if (!node) throw new Error('Elemento não encontrado para exportar');
  await ensureLibs();
  const html2canvas = window.html2canvas;
  const { jsPDF } = window.jspdf || window.jsPDF || {};
  if (!html2canvas || !jsPDF) throw new Error('Bibliotecas de PDF não disponíveis');

  const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // Converte px para mm assumindo 96 DPI
  const pxToMm = (px) => px * 0.264583; // 1px ≈ 0.264583mm
  const wMm = pxToMm(canvas.width);
  const hMm = pxToMm(canvas.height);

  const pdf = new jsPDF({ orientation: wMm > hMm ? 'l' : 'p', unit: 'mm', format: [wMm, hMm] });
  pdf.addImage(imgData, 'JPEG', 0, 0, wMm, hMm);
  pdf.save(filename);
}

