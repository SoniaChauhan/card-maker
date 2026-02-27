/**
 * Payload obfuscation — encodes API request bodies so sensitive data
 * (emails, OTPs, passwords) is NOT visible as plaintext in the browser
 * Network tab.
 *
 * Client: encodePayload(obj) → base64-encoded string sent as { _p: "..." }
 * Server: decodePayload(req)  → original object
 */

const KEY = 'cM$2026!xK';  // simple XOR key (obfuscation, not military-grade)

function xor(str, key) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return out;
}

/* ---- Client-side ---- */

export function encodePayload(obj) {
  const json = JSON.stringify(obj);
  // XOR then Base64
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(xor(json, KEY))));
  }
  return Buffer.from(xor(json, KEY), 'binary').toString('base64');
}

/* ---- Server-side ---- */

export function decodePayload(encoded) {
  let binary;
  if (typeof window !== 'undefined') {
    binary = decodeURIComponent(escape(atob(encoded)));
  } else {
    binary = Buffer.from(encoded, 'base64').toString('binary');
  }
  return JSON.parse(xor(binary, KEY));
}

/**
 * Express / Next.js helper: reads the request body and decodes it.
 * Expects { _p: "<encoded>" } in the JSON body.
 */
export async function decodeRequest(req) {
  const raw = await req.json();
  if (raw._p) return decodePayload(raw._p);
  return raw;  // fallback: accept plain JSON for backward compat
}
