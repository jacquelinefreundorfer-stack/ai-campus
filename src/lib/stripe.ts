import Stripe from "stripe";

// ── Bundle ID → Stripe Price ID mapping ─────────────────────────────────────

export const BUNDLE_PRICE_MAP: Record<number, string> = {
  1: "price_1TxjjwRUWggGyRGDxOeMrulq", // AI & Generative AI Practitioner ($79)
  2: "price_1TxjjwRUWggGyRGDeueo4YAO", // Digital Marketing & Growth ($69)
  3: "price_1TxjjwRUWggGyRGDIO69arPA", // Data Science & Business Analytics ($79)
};

// ── Lazy Stripe client ──────────────────────────────────────────────────────

let _stripe: Stripe | null = null;
let _stripeError: string | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  if (_stripeError) throw new Error(_stripeError);

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    _stripeError =
      "STRIPE_SECRET_KEY is not configured. Add it to the .env file to enable payments.";
    throw new Error(_stripeError);
  }

  _stripe = new Stripe(key, {
    apiVersion: "2025-06-30.acacia" as any,
  });
  return _stripe;
}

export function getStripePriceId(bundleId: number): string {
  const priceId = BUNDLE_PRICE_MAP[bundleId];
  if (!priceId) {
    throw new Error(`No Stripe price ID configured for bundle ${bundleId}`);
  }
  return priceId;
}

// ── Site base URL ───────────────────────────────────────────────────────────

export const SITE_URL =
  process.env.SITE_URL || "https://aicampus.ctonew.app";

// ── Checkout session cache key ──────────────────────────────────────────────
// Used to temporarily store checkout session data between checkout and success
// page. In production, Stripe webhooks handle this; this is a lightweight
// in-memory fallback for the success-page flow.

const sessionCache = new Map<
  string,
  { bundleId: number; userId: string; expiresAt: number }
>();

export function cacheCheckoutIntent(
  sessionId: string,
  bundleId: number,
  userId: string,
) {
  sessionCache.set(sessionId, {
    bundleId,
    userId,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
  });
}

export function getCheckoutIntent(sessionId: string) {
  const entry = sessionCache.get(sessionId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    sessionCache.delete(sessionId);
    return null;
  }
  sessionCache.delete(sessionId); // one-time use
  return { bundleId: entry.bundleId, userId: entry.userId };
}
