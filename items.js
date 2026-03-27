/* ============================
   ITEMS (BLOCS + OBJETS)
   ============================ */

const ITEM_TYPE = {
  BLOCK: "block",
  TOOL: "tool",
  MISC: "misc"
};

const ITEM = {
  // blocs = même ID que BLOCK pour simplifier
  GRASS: BLOCK.GRASS,
  DIRT: BLOCK.DIRT,
  STONE: BLOCK.STONE,
  COBBLESTONE: BLOCK.COBBLESTONE,
  SAND: BLOCK.SAND,
  GRAVEL: BLOCK.GRAVEL,
  LOG: BLOCK.LOG,
  PLANKS: BLOCK.PLANKS,
  GLASS: BLOCK.GLASS,
  TORCH: BLOCK.TORCH,

  COAL_ORE: BLOCK.COAL_ORE,
  IRON_ORE: BLOCK.IRON_ORE,
  COPPER_ORE: BLOCK.COPPER_ORE,
  GOLD_ORE: BLOCK.GOLD_ORE,
  DIAMOND_ORE: BLOCK.DIAMOND_ORE,

  // outils
  WOOD_PICKAXE: 100,
  STONE_PICKAXE: 101,
  IRON_PICKAXE: 102,
  DIAMOND_PICKAXE: 103,

  // armures cuir
  LEATHER_HELMET: 200,
  LEATHER_CHEST: 201,
  LEATHER_LEGS: 202,
  LEATHER_BOOTS: 203,

  // armures fer
  IRON_HELMET: 210,
  IRON_CHEST: 211,
  IRON_LEGS: 212,
  IRON_BOOTS: 213,

  // armures diamant
  DIAMOND_HELMET: 220,
  DIAMOND_CHEST: 221,
  DIAMOND_LEGS: 222,
  DIAMOND_BOOTS: 223
};

/* ============================
   DEFINITIONS DES ITEMS
   ============================ */

const ITEM_DEFS = {
  // blocs
  [ITEM.GRASS]:       { type: ITEM_TYPE.BLOCK, blockId: BLOCK.GRASS },
  [ITEM.DIRT]:        { type: ITEM_TYPE.BLOCK, blockId: BLOCK.DIRT },
  [ITEM.STONE]:       { type: ITEM_TYPE.BLOCK, blockId: BLOCK.STONE },
  [ITEM.COBBLESTONE]: { type: ITEM_TYPE.BLOCK, blockId: BLOCK.COBBLESTONE },
  [ITEM.SAND]:        { type: ITEM_TYPE.BLOCK, blockId: BLOCK.SAND },
  [ITEM.GRAVEL]:      { type: ITEM_TYPE.BLOCK, blockId: BLOCK.GRAVEL },
  [ITEM.LOG]:         { type: ITEM_TYPE.BLOCK, blockId: BLOCK.LOG },
  [ITEM.PLANKS]:      { type: ITEM_TYPE.BLOCK, blockId: BLOCK.PLANKS },
  [ITEM.GLASS]:       { type: ITEM_TYPE.BLOCK, blockId: BLOCK.GLASS },
  [ITEM.TORCH]:       { type: ITEM_TYPE.BLOCK, blockId: BLOCK.TORCH },

  [ITEM.COAL_ORE]:    { type: ITEM_TYPE.BLOCK, blockId: BLOCK.COAL_ORE },
  [ITEM.IRON_ORE]:    { type: ITEM_TYPE.BLOCK, blockId: BLOCK.IRON_ORE },
  [ITEM.COPPER_ORE]:  { type: ITEM_TYPE.BLOCK, blockId: BLOCK.COPPER_ORE },
  [ITEM.GOLD_ORE]:    { type: ITEM_TYPE.BLOCK, blockId: BLOCK.GOLD_ORE },
  [ITEM.DIAMOND_ORE]: { type: ITEM_TYPE.BLOCK, blockId: BLOCK.DIAMOND_ORE },

  // armures cuir
  [ITEM.LEATHER_HELMET]: { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.LEATHER },
  [ITEM.LEATHER_CHEST]:  { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.LEATHER },
  [ITEM.LEATHER_LEGS]:   { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.LEATHER },
  [ITEM.LEATHER_BOOTS]:  { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.LEATHER },

  // armures fer
  [ITEM.IRON_HELMET]: { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.IRON },
  [ITEM.IRON_CHEST]:  { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.IRON },
  [ITEM.IRON_LEGS]:   { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.IRON },
  [ITEM.IRON_BOOTS]:  { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.IRON },

  // armures diamant
  [ITEM.DIAMOND_HELMET]: { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.DIAMOND },
  [ITEM.DIAMOND_CHEST]:  { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.DIAMOND },
  [ITEM.DIAMOND_LEGS]:   { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.DIAMOND },
  [ITEM.DIAMOND_BOOTS]:  { type: ITEM_TYPE.MISC, armor: ARMOR_STATS.DIAMOND },

  // outils
  [ITEM.WOOD_PICKAXE]: {
    type: ITEM_TYPE.TOOL,
    toolClass: "pickaxe",
    level: 1
  },
  [ITEM.STONE_PICKAXE]: {
    type: ITEM_TYPE.TOOL,
    toolClass: "pickaxe",
    level: 2
  },
  [ITEM.IRON_PICKAXE]: {
    type: ITEM_TYPE.TOOL,
    toolClass: "pickaxe",
    level: 3
  },
  [ITEM.DIAMOND_PICKAXE]: {
    type: ITEM_TYPE.TOOL,
    toolClass: "pickaxe",
    level: 4
  }
};
