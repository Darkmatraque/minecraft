const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  GRAVEL: 5,
  LOG: 6,
  PLANKS: 7,
  LEAVES: 8,
  GLASS: 9,

  COAL_ORE: 10,
  IRON_ORE: 11,
  COPPER_ORE: 12,
  GOLD_ORE: 13,
  DIAMOND_ORE: 14
};

const BLOCK_DEFS = {
  [BLOCK.AIR]:   { solid: false },
  [BLOCK.GRASS]: { solid: true },
  [BLOCK.DIRT]:  { solid: true },
  [BLOCK.STONE]: { solid: true },
  [BLOCK.SAND]:  { solid: true },
  [BLOCK.GRAVEL]:{ solid: true },
  [BLOCK.LOG]:   { solid: true },
  [BLOCK.PLANKS]:{ solid: true },
  [BLOCK.LEAVES]:{ solid: true },
  [BLOCK.GLASS]: { solid: true },

  [BLOCK.COAL_ORE]:    { solid: true },
  [BLOCK.IRON_ORE]:    { solid: true },
  [BLOCK.COPPER_ORE]:  { solid: true },
  [BLOCK.GOLD_ORE]:    { solid: true },
  [BLOCK.DIAMOND_ORE]: { solid: true }
};
