/**
 * Draw a small, subtle bottom-right watermark on a canvas.
 * Used for all free downloads across the project.
 */
export function addWatermark(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const fontSize = Math.max(12, Math.round(w * 0.022));
  const paddingX = Math.round(fontSize * 0.8);
  const paddingY = Math.round(fontSize * 0.5);

  ctx.save();
  ctx.font = `600 ${fontSize}px Arial, sans-serif`;
  const text = 'creativethinkerdesignhub.com';
  const metrics = ctx.measureText(text);
  const textW = metrics.width;

  // Semi-transparent dark pill background
  const bgW = textW + paddingX * 2;
  const bgH = fontSize + paddingY * 2;
  const x = w - bgW - Math.round(w * 0.02);
  const y = h - bgH - Math.round(h * 0.02);
  const radius = bgH / 2;

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + bgW - radius, y);
  ctx.quadraticCurveTo(x + bgW, y, x + bgW, y + radius);
  ctx.lineTo(x + bgW, y + bgH - radius);
  ctx.quadraticCurveTo(x + bgW, y + bgH, x + bgW - radius, y + bgH);
  ctx.lineTo(x + radius, y + bgH);
  ctx.quadraticCurveTo(x, y + bgH, x, y + bgH - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  // White text
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX, y + bgH / 2);
  ctx.restore();
}

/**
 * Draw a small watermark on each video frame (bottom-right).
 * Call this after drawing each frame's content onto the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W - canvas width
 * @param {number} H - canvas height
 */
export function addVideoFrameWatermark(ctx, W, H) {
  const fontSize = Math.max(10, Math.round(W * 0.018));
  const paddingX = Math.round(fontSize * 0.6);
  const paddingY = Math.round(fontSize * 0.35);

  ctx.save();
  ctx.font = `600 ${fontSize}px Arial, sans-serif`;
  const text = 'creativethinkerdesignhub.com';
  const metrics = ctx.measureText(text);
  const textW = metrics.width;

  const bgW = textW + paddingX * 2;
  const bgH = fontSize + paddingY * 2;
  const x = W - bgW - Math.round(W * 0.015);
  const y = H - bgH - Math.round(H * 0.015);
  const radius = bgH / 2;

  ctx.globalAlpha = 0.45;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + bgW - radius, y);
  ctx.quadraticCurveTo(x + bgW, y, x + bgW, y + radius);
  ctx.lineTo(x + bgW, y + bgH - radius);
  ctx.quadraticCurveTo(x + bgW, y + bgH, x + bgW - radius, y + bgH);
  ctx.lineTo(x + radius, y + bgH);
  ctx.quadraticCurveTo(x, y + bgH, x, y + bgH - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX, y + bgH / 2);
  ctx.restore();
}
