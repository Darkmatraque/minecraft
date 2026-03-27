/* ============================
   PALETTE GLOBALE
   ============================ */

const TEX_COLORS = {
  G1:"#7ecf4f", G2:"#6ab842", G3:"#4f8f2f",
  D1:"#6b4a2f", D2:"#4f341f",
  S1:"#8a8a8a", S2:"#6f6f6f", S3:"#5a5a5a",
  SA1:"#e7d39a", SA2:"#d1c08a",
  GR1:"#9a9a9a", GR2:"#7f7f7f",
  W1:"#8b5a2b", W2:"#5a3a1a",
  P1:"#c89a5a", P2:"#a87a3a",
  L1:"#5fa83a", L2:"#3f7a24",
  GL1:"#b0e0ff", GL2:"#80c0ff",
  C1:"#2b2b2b",
  IR1:"#d8c8a8",
  CU1:"#c47c3c",
  AU1:"#f2d14a",
  DI1:"#4fe3e8",
  WA1:"#3a6fd8", WA2:"#2a4fa8",
  LA1:"#ff5a1a", LA2:"#d83a0f",
  GLO1:"#ffcc55", GLO2:"#e0aa33"
};

/* ============================
   PATTERNS ASCII 8x8 UNIQUES
   ============================ */

const BLOCK_PATTERNS = {
  [BLOCK.GRASS]: [
    "G1G1G1G1G1G1G1G1",
    "G1G1G2G1G2G1G1G1",
    "G2G1G2G1G2G2G1G1",
    "G2G2G1G2G1G2G2G1",
    "D1D1D1D1D1D1D1D1",
    "D1D2D1D2D1D2D1D2",
    "D2D1D2D1D2D1D2D1",
    "D1D1D1D1D1D1D1D1"
  ],

  [BLOCK.DIRT]: [
    "D1D1D1D1D1D1D1D1",
    "D1D2D1D1D2D1D2D1",
    "D1D1D1D2D1D1D1D2",
    "D2D1D1D1D2D1D1D1",
    "D1D1D2D1D1D2D1D1",
    "D1D2D1D1D2D1D1D2",
    "D1D1D1D2D1D1D1D1",
    "D1D1D1D1D1D1D1D1"
  ],

  [BLOCK.STONE]: [
    "S1S1S1S1S1S1S1S1",
    "S1S2S1S1S2S1S1S1",
    "S1S1S3S1S1S3S1S1",
    "S1S1S1S2S1S1S2S1",
    "S2S1S1S1S2S1S1S1",
    "S1S3S1S1S1S3S1S1",
    "S1S1S1S2S1S1S1S2",
    "S1S1S1S1S1S1S1S1"
  ],

  [BLOCK.SAND]: [
    "SA1SA1SA1SA1SA1SA1SA1SA1",
    "SA1SA2SA1SA1SA2SA1SA1SA2",
    "SA1SA1SA1SA2SA1SA1SA2SA1",
    "SA2SA1SA1SA1SA2SA1SA1SA1",
    "SA1SA1SA2SA1SA1SA2SA1SA1",
    "SA1SA2SA1SA1SA2SA1SA1SA2",
    "SA1SA1SA1SA2SA1SA1SA2SA1",
    "SA1SA1SA1SA1SA1SA1SA1SA1"
  ],

  [BLOCK.LEAVES]: [
    "L1L1L1L1L1L1L1L1",
    "L1L2L1L1L2L1L1L2",
    "L1L1L2L1L1L2L1L1",
    "L2L1L1L2L1L1L2L1",
    "L1L1L2L1L1L2L1L1",
    "L1L2L1L1L2L1L1L2",
    "L1L1L1L2L1L1L2L1",
    "L1L1L1L1L1L1L1L1"
  ],

  [BLOCK.WOOD]: [
    "W2W2W2W2W2W2W2W2",
    "W2W1W1W1W1W1W1W2",
    "W2W1W2W1W2W1W1W2",
    "W2W1W1W1W1W1W1W2",
    "W2W1W2W1W2W1W1W2",
    "W2W1W1W1W1W1W1W2",
    "W2W1W1W2W1W1W1W2",
    "W2W2W2W2W2W2W2W2"
  ],

  [BLOCK.PLANKS]: [
    "P1P1P1P1P1P1P1P1",
    "P1P2P1P1P2P1P1P2",
    "P1P1P1P2P1P1P2P1",
    "P2P1P1P1P2P1P1P1",
    "P1P1P2P1P1P2P1P1",
    "P1P2P1P1P2P1P1P2",
    "P1P1P1P2P1P1P2P1",
    "P1P1P1P1P1P1P1P1"
  ],

  [BLOCK.GLASS]: [
    "GL1GL1GL1GL1GL1GL1GL1GL1",
    "GL1GL2GL1GL1GL2GL1GL1GL2",
    "GL1GL1GL1GL2GL1GL1GL2GL1",
    "GL2GL1GL1GL1GL2GL1GL1GL1",
    "GL1GL1GL2GL1GL1GL2GL1GL1",
    "GL1GL2GL1GL1GL2GL1GL1GL2",
    "GL1GL1GL1GL2GL1GL1GL2GL1",
    "GL1GL1GL1GL1GL1GL1GL1GL1"
  ]
};

/* ============================
   GENERATEUR DE TEXTURE
   ============================ */

const textureCache = new Map();

function generateBlockTextureCanvas(blockId, size = 16) {
  if (textureCache.has(blockId)) return textureCache.get(blockId);

  const pattern = BLOCK_PATTERNS[blockId];
  if (!pattern) return null;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);

  const h = pattern.length;
  const w = pattern[0].length / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = Math.floor(x * w / size);
      const py = Math.floor(y * h / size);

      const code = pattern[py].slice(px * 2, px * 2 + 2);
      const color = TEX_COLORS[code] || "#ff00ff";

      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const idx = (x + y * size) * 4;
      img.data[idx] = r;
      img.data[idx + 1] = g;
      img.data[idx + 2] = b;
      img.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  textureCache.set(blockId, canvas);
  return canvas;
}
