export function getBorderPoint(
  x: number, y: number, width: number, height: number,
  targetX: number, targetY: number
) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const dx = targetX - cx;
  const dy = targetY - cy;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let scale = 0.5;
  if (absDx * height > absDy * width) {
    scale = (width / 2) / absDx;
  } else {
    scale = (height / 2) / absDy;
  }

  return {
    x: cx + dx * scale,
    y: cy + dy * scale
  };
}