"use strict";

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 80;
const DIST = path.join(__dirname, "dist");

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https://cdn.discordapp.com; " +
    "connect-src 'self' https://ton618bot.xyz https://*.ton618bot.xyz; " +
    "font-src 'self'; " +
    "frame-ancestors 'none'; " +
    "object-src 'none';"
  );
  // Prevent browsers from caching the SPA shell
  if (req.path === "/" || req.path.endsWith(".html")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  }
  next();
});

// Static assets with long cache
app.use("/assets", express.static(path.join(DIST, "assets"), {
  maxAge: "1y",
  immutable: true,
}));

// Everything else — serve index.html (SPA)
app.use(express.static(DIST));
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[status] Listening on port ${PORT}`);
});
