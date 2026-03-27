/* ============================
   PALETTE GLOBALE
   ============================ */

const TEX_COLORS = {
  // verts
  G1: "#7ecf4f",
  G2: "#6ab842",
  G3: "#4f8f2f",

  // terre
  D1: "#6b4a2f",
  D2: "#4f341f",

  // pierre
  S1: "#8a8a8a",
  S2: "#6f6f6f",
  S3: "#5a5a5a",

  // sable / gravier
  SA1: "#e7d39a",
  SA2: "#d1c08a",
  GR1: "#9a9a9a",
  GR2: "#7f7f7f",

  // bois
  W1: "#8b5a2b",
  W2: "#5a3a1a",
  P1: "#c89a5a",
  P2: "#a87a3a",

  // feuilles
  L1: "#5fa83a",
  L2: "#3f7a24",

  // verre
  GL1: "#b0e0ff",
  GL2: "#80c0ff",

  // minerais
  C1: "#2b2b2b",   // charbon
  IR1: "#d8c8a8",  // fer
  CU1: "#c47c3c",  // cuivre
  AU1: "#f2d14a",  // or
  DI1: "#4fe3e8",  // diamant

  // lumiÃ¨re
  T1: "#ffdd66",   // torche
  T2: "#ffbb33",
  GLO1: "#ffcc55",
  GLO2: "#e0aa33",

  // eau / lave
  WA1: "#3a6fd8",
  WA2: "#2a4fa8",
  LA1: "#ff5a1a",
  LA2: "#d83a0f",

  // coffre / porte
  CH1: "#8b5a2b",
  CH2: "#5a3a1a",
  CH3: "#c89a5a",
  DO1: "#b87a3a",
  DO2: "#8a5a2a"
};

/* ============================
   PATTERNS ASCII 8x8
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
... (259lignes restantes)
