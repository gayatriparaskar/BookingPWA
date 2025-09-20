import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG icon generator for PWA icons
const generateIcon = (size) => {
  const iconSize = size;
  const center = iconSize / 2;
  const radius = iconSize * 0.4;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#gradient)" />
  
  <!-- Sparkle icon -->
  <g transform="translate(${center}, ${center})">
    <!-- Main sparkle -->
    <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="3" fill="white"/>
    
    <!-- Small sparkles -->
    <circle cx="-12" cy="-12" r="1.5" fill="white" opacity="0.8"/>
    <circle cx="12" cy="-12" r="1.5" fill="white" opacity="0.8"/>
    <circle cx="-12" cy="12" r="1.5" fill="white" opacity="0.8"/>
    <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.8"/>
  </g>
</svg>`;
};

// Icon sizes needed for PWA
const iconSizes = [
  16, 32, 57, 60, 70, 72, 76, 96, 114, 120, 128, 144, 150, 152, 180, 192, 310, 384, 512
];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
iconSizes.forEach(size => {
  const svgContent = generateIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated ${filename}`);
});

// Generate shortcut icons
const shortcutIcons = [
  { name: 'shortcut-book', icon: '📅' },
  { name: 'shortcut-calendar', icon: '📆' },
  { name: 'shortcut-gallery', icon: '🖼️' }
];

shortcutIcons.forEach(({ name, icon }) => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="48" cy="48" r="40" fill="url(#gradient)" />
  <text x="48" y="60" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="white">${icon}</text>
</svg>`;
  
  const filepath = path.join(iconsDir, `${name}.svg`);
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated ${name}.svg`);
});

// Generate action icons
const actionIcons = [
  { name: 'action-view', icon: '👁️' },
  { name: 'action-close', icon: '✕' }
];

actionIcons.forEach(({ name, icon }) => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="#f43f5e" />
  <text x="12" y="16" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">${icon}</text>
</svg>`;
  
  const filepath = path.join(iconsDir, `${name}.svg`);
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated ${name}.svg`);
});

console.log('\n✅ All PWA icons generated successfully!');
console.log('📝 Note: For production, consider converting SVG icons to PNG format for better compatibility.');
console.log('🔧 You can use tools like ImageMagick or online converters to convert SVG to PNG.');
