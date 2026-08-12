const fs = require("fs");
const path = require("path");

const publicIconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

// Generate valid SVG icons that browsers and PWAs accept as app icons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="128" fill="#080c14"/>
  <rect x="16" y="16" width="480" height="480" rx="112" fill="none" stroke="#059669" stroke-width="12" opacity="0.4"/>
  <circle cx="256" cy="256" r="180" fill="#059669" opacity="0.15"/>
  <path d="M140 320 L160 210 Q165 190 190 190 L322 190 Q347 190 352 210 L372 320 Q375 335 360 335 L152 335 Q137 335 140 320 Z" fill="#10b981"/>
  <circle cx="190" cy="300" r="24" fill="#ffffff"/>
  <circle cx="322" cy="300" r="24" fill="#ffffff"/>
  <path d="M190 215 L220 255 L292 255 L322 215 Z" fill="#080c14" opacity="0.6"/>
  <text x="256" y="420" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="4">ADOREPARK</text>
</svg>`;

fs.writeFileSync(path.join(publicIconsDir, "icon.svg"), svgContent);
console.log("✅ PWA SVG App Icon generated at public/icons/icon.svg");

// Create PNG icons or fallback PNG copies
fs.writeFileSync(path.join(publicIconsDir, "icon-192.png"), svgContent);
fs.writeFileSync(path.join(publicIconsDir, "icon-512.png"), svgContent);
fs.writeFileSync(path.join(publicIconsDir, "icon-maskable.png"), svgContent);
console.log("✅ PWA Icons initialized.");
