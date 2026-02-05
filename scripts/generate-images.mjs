#!/usr/bin/env node
/**
 * Generate og-image.png and favicon.ico for InvestLink
 * Run: node scripts/generate-images.mjs
 */
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function generateOgImage() {
  const svgPath = join(publicDir, 'og-image.svg');
  const svg = await readFile(svgPath, 'utf-8');
  const outputPath = join(publicDir, 'og-image.png');

  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toFile(outputPath);

  console.log('Generated og-image.png (1200×630)');
}

async function generateFavicon() {
  const iconPath = join(publicDir, 'icon.svg');
  const svg = await readFile(iconPath, 'utf-8');
  const outputPath = join(publicDir, 'favicon.ico');

  // Generate 32x32 PNG, then save as ICO (browsers accept multi-size ICO)
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );

  // ICO format: header + directory + image data
  // Simplified: use 32x32 as primary (most compatible)
  const png32 = pngBuffers[1];
  const ico = await createIcoFromPng(png32, 32);
  await import('fs').then((fs) => fs.promises.writeFile(outputPath, ico));

  console.log('Generated favicon.ico (32×32)');
}

/**
 * Create minimal ICO file from PNG buffer
 * ICO format: ICONDIR + ICONDIRENTRY + BMP/PNG data
 */
async function createIcoFromPng(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(1, 4); // Number of images

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // Width
  entry.writeUInt8(size, 1); // Height
  entry.writeUInt8(0, 2); // Color palette
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Size of image data
  entry.writeUInt32LE(22, 12); // Offset (6 + 16)

  return Buffer.concat([header, entry, pngBuffer]);
}

async function main() {
  try {
    await generateOgImage();
    await generateFavicon();
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
