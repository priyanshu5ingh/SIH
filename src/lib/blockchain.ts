// Minimal blockchain anchoring adapter (mock)
// Replace anchorToChain with a real integration later.
import type { ChainProof, TraceEvent } from "./types";

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashEvent(ev: TraceEvent): Promise<string> {
  const canonical = JSON.stringify(ev, Object.keys(ev).sort());
  if (crypto && crypto.subtle) {
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(canonical));
    return "0x" + toHex(digest);
  }
  // Fallback (non-crypto): simple hash for dev only
  let h = 0;
  for (let i = 0; i < canonical.length; i++) {
    h = (h << 5) - h + canonical.charCodeAt(i);
    h |= 0;
  }
  return "0x" + (h >>> 0).toString(16).padStart(8, "0");
}

export async function anchorToChain(ev: TraceEvent): Promise<ChainProof> {
  // Simulate an on-chain anchor by deriving txHash from event hash
  const digest = await hashEvent(ev);
  const now = new Date();
  const rand = Math.floor(Math.random() * 1e6).toString(16).padStart(5, "0");
  return {
    txHash: `${digest.slice(0, 20)}${rand}`,
    blockNumber: 100000 + Math.floor(Math.random() * 5000),
    anchoredAt: now.toISOString(),
  };
}

export function shortHash(hash: string): string {
  if (!hash) return "";
  return hash.length > 10 ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : hash;
}
