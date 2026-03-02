import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://images.unsplash.com;
  connect-src 'self'${isDev ? " ws: wss:" : ""};
  frame-src 'none';
  object-src 'none';
  form-action 'self';
  base-uri 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  // ── Prevent clickjacking ────────────────────────────────────────────
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // ── Prevent MIME-type sniffing ───────────────────────────────────────
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // ── Control referrer information sent when navigating ───────────────
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // ── Disable browser features not used by this site ──────────────────
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // ── Force HTTPS (add after deploying to HTTPS host) ─────────────────
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // ── Disable DNS prefetch to avoid leaking visited origins ───────────
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  // ── Content Security Policy ─────────────────────────────────────────
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  // ── Security headers on every response ────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Image domain allowlist (only what we actually use) ────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // ── Prevent Next.js from exposing its version in the X-Powered-By header ──
  poweredByHeader: false,
};

export default nextConfig;
