// QR generation helpers (no extra deps)
// Uses a public QR image service for demo purposes. Swap with a local generator later if needed.

export function createTraceLink(productId: string, batchId?: string): string {
  const url = new URL('/trace', window.location.origin);
  url.searchParams.set('pid', productId);
  if (batchId) url.searchParams.set('batch', batchId);
  return url.toString();
}

export function createQrImageUrl(data: string, size = 220): string {
  const s = Math.max(120, Math.min(size, 1000));
  const encoded = encodeURIComponent(data);
  // Public demo QR service (no key required). Replace with local generator for production.
  return `https://api.qrserver.com/v1/create-qr-code/?size=${s}x${s}&data=${encoded}`;
}
