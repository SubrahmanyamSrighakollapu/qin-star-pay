import React from 'react';

export function PaymentQr({ value, size = 176 }: { value: string; size?: number }) {
  const cells = 25;
  const seed = Array.from(value).reduce((a, c) => ((a * 31) + c.charCodeAt(0)) >>> 0, 2166136261);
  const finder = (x: number, y: number, ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7 && (x === ox || x === ox + 6 || y === oy || y === oy + 6 || (x >= ox + 2 && x <= ox + 4 && y >= oy + 2 && y <= oy + 4));
  const dark = (x: number, y: number) => finder(x, y, 1, 1) || finder(x, y, 17, 1) || finder(x, y, 1, 17) || (((seed ^ (x * 73856093) ^ (y * 19349663)) >>> ((x + y) % 16)) & 1) === 1;
  return <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} role="img" aria-label="Payment QR code" className="bg-white rounded-xl border border-slate-200 p-2"><rect width={cells} height={cells} fill="white" />{Array.from({ length: cells * cells }, (_, i) => { const x = i % cells; const y = Math.floor(i / cells); return dark(x, y) ? <rect key={i} x={x} y={y} width="1" height="1" fill="#0F172A" /> : null; })}</svg>;
}
