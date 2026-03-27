// ============================
//  BLOCS & DÉFINITIONS
// ============================

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
  WATER: 10,
  LAVA: 11,
  COAL_ORE: 12,
  IRON_ORE: 13,
  COPPER_ORE: 14,
  GOLD_ORE: 15,
  DIAMOND_ORE: 16,
  GLOWSTONE: 17,
  CHEST: 18,
  DOOR_BOTTOM: 19,
  DOOR_TOP: 20,
  TORCH: 21
};

const BLOCK_DEFS = {
  [BLOCK.AIR]: { solid: false },
  [BLOCK.GRASS]: { solid: true, texture: BLOCK.GRASS },
  [BLOCK.DIRT]: { solid: true, texture: BLOCK.DIRT },
  [BLOCK.STONE]: { solid: true, texture: BLOCK.STONE },
  [BLOCK.SAND]: { solid: true, texture: BLOCK.SAND },
  [BLOCK.GRAVEL]: { solid: true, texture: BLOCK.GRAVEL },
  [BLOCK.LOG]: { solid: true, texture: BLOCK.LOG },
  [BLOCK.PLANKS]: { solid: true, texture: BLOCK.PLANKS },
  [BLOCK.LEAVES]: { solid: false, texture: BLOCK.LEAVES },
  [BLOCK.GLASS]: { solid: false, texture: BLOCK.GLASS },
  [BLOCK.WATER]: { solid: false, texture: BLOCK.WATER },
  [BLOCK.LAVA]: { solid: false, texture: BLOCK.LAVA },
  [BLOCK.COAL_ORE]: { solid: true, texture: BLOCK.COAL_ORE },
  [BLOCK.IRON_ORE]: { solid: true, texture: BLOCK.IRON_ORE },
  [BLOCK.COPPER_ORE]: { solid: true, texture: BLOCK.COPPER_ORE },
  [BLOCK.GOLD_ORE]: { solid: true, texture: BLOCK.GOLD_ORE },
  [BLOCK.DIAMOND_ORE]: { solid: true, texture: BLOCK.DIAMOND_ORE },
  [BLOCK.GLOWSTONE]: { solid: true, texture: BLOCK.GLOWSTONE },
  [BLOCK.CHEST]: { solid: true, texture: BLOCK.CHEST },
  [BLOCK.DOOR_BOTTOM]: { solid: true, texture: BLOCK.DOOR_BOTTOM },
  [BLOCK.DOOR_TOP]: { solid: true, texture: BLOCK.DOOR_TOP },
  [BLOCK.TORCH]: { solid: false, texture: BLOCK.TORCH }
};
