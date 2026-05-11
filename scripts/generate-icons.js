const fs = require('fs');
const path = require('path');

const icons = {
  home: { normal: '#999999', active: '#1E88E5' },
  phone: { normal: '#999999', active: '#1E88E5' },
  pay: { normal: '#999999', active: '#1E88E5' },
  invoice: { normal: '#999999', active: '#1E88E5' },
  mine: { normal: '#999999', active: '#1E88E5' }
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function createPNG(width, height, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  function crc32(data) {
    let crc = 0xFFFFFFFF;
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    for (let i = 0; i < data.length; i++) {
      crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData));
    return Buffer.concat([length, typeBuffer, data, crc]);
  }
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b);
    }
  }
  
  const { deflateSync } = require('zlib');
  const compressed = deflateSync(Buffer.from(rawData));
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const tabDir = path.join(__dirname, '../src/static/tab');
if (!fs.existsSync(tabDir)) {
  fs.mkdirSync(tabDir, { recursive: true });
}

Object.entries(icons).forEach(([name, colors]) => {
  const normalRgb = hexToRgb(colors.normal);
  const activeRgb = hexToRgb(colors.active);
  
  const normalPng = createPNG(48, 48, normalRgb.r, normalRgb.g, normalRgb.b);
  const activePng = createPNG(48, 48, activeRgb.r, activeRgb.g, activeRgb.b);
  
  fs.writeFileSync(path.join(tabDir, `${name}.png`), normalPng);
  fs.writeFileSync(path.join(tabDir, `${name}-active.png`), activePng);
  
  console.log(`Created ${name}.png and ${name}-active.png`);
});

console.log('All icons generated successfully!');