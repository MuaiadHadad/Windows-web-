const fs = require('fs');
const { createCanvas } = require('canvas');
const sizes = [192, 512];
for (const size of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `${Math.round(size * 0.55)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W', size / 2, size / 2);
  const outPath = `public/icons/icon-${size}.png`;
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('Wrote', outPath);
}

