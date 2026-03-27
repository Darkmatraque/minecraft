const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  WOOD: 5,
  LEAVES: 6,
  PLANKS: 7,
  GLASS: 8
};

const BLOCK_DEFS = {
  [BLOCK.AIR]:   { id: BLOCK.AIR,   name: "Air",    color: 0x000000, solid: false },
  [BLOCK.GRASS]: { id: BLOCK.GRASS, name: "Herbe",  color: 0x3ba53b, solid: true  },
  [BLOCK.DIRT]:  { id: BLOCK.DIRT,  name: "Terre",  color: 0x8b5a2b, solid: true  },
  [BLOCK.STONE]: { id: BLOCK.STONE, name: "Pierre", color: 0x777777, solid: true  },
  [BLOCK.SAND]:  { id: BLOCK.SAND,  name: "Sable",  color: 0xd9d29a, solid: true  },
  [BLOCK.WOOD]:  { id: BLOCK.WOOD,  name: "Bois",   color: 0x8b5a2b, solid: true  },
  [BLOCK.LEAVES]:{ id: BLOCK.LEAVES,name: "Feuilles",color: 0x2f8f2f, solid: true },
  [BLOCK.PLANKS]:{ id: BLOCK.PLANKS,name: "Planches",color: 0xc8a46b, solid: true },
  [BLOCK.GLASS]: { id: BLOCK.GLASS, name: "Verre",  color: 0x99c9ff, solid: false }
};
