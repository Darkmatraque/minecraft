// ============================
//  BLOCS & DÉFINITIONS
// ============================

const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  SNOW: 5,
  WATER: 6,
  WOOD: 7,
  LEAVES: 8,
  PLANKS: 9,
  GLASS: 10,
  COAL_ORE: 11,
  IRON_ORE: 12,
  COPPER_ORE: 13,
  GOLD_ORE: 14,
  DIAMOND_ORE: 15
};

const BLOCK_DEFS = {
  [BLOCK.AIR]: {
    id: BLOCK.AIR,
    name: "Air",
    solid: false
  },
  [BLOCK.GRASS]: {
    id: BLOCK.GRASS,
    name: "Grass",
    solid: true,
    texture: "grass"
  },
  [BLOCK.DIRT]: {
    id: BLOCK.DIRT,
    name: "Dirt",
    solid: true,
    texture: "dirt"
  },
  [BLOCK.STONE]: {
    id: BLOCK.STONE,
    name: "Stone",
    solid: true,
    texture: "stone"
  },
  [BLOCK.SAND]: {
    id: BLOCK.SAND,
    name: "Sand",
    solid: true,
    texture: "sand"
  },
  [BLOCK.SNOW]: {
    id: BLOCK.SNOW,
    name: "Snow",
    solid: true,
    texture: "snow"
  },
  [BLOCK.WATER]: {
    id: BLOCK.WATER,
    name: "Water",
    solid: false,
    texture: "water"
  },
  [BLOCK.WOOD]: {
    id: BLOCK.WOOD,
    name: "Wood",
    solid: true,
    texture: "wood"
  },
  [BLOCK.LEAVES]: {
    id: BLOCK.LEAVES,
    name: "Leaves",
    solid: false,
    texture: "leaves"
  },
  [BLOCK.PLANKS]: {
    id: BLOCK.PLANKS,
    name: "Planks",
    solid: true,
    texture: "planks"
  },
  [BLOCK.GLASS]: {
    id: BLOCK.GLASS,
    name: "Glass",
    solid: false,
    texture: "glass"
  },
  [BLOCK.COAL_ORE]: {
    id: BLOCK.COAL_ORE,
    name: "Coal Ore",
    solid: true,
    texture: "coal_ore"
  },
  [BLOCK.IRON_ORE]: {
    id: BLOCK.IRON_ORE,
    name: "Iron Ore",
    solid: true,
    texture: "iron_ore"
  },
  [BLOCK.COPPER_ORE]: {
    id: BLOCK.COPPER_ORE,
    name: "Copper Ore",
    solid: true,
    texture: "copper_ore"
  },
  [BLOCK.GOLD_ORE]: {
    id: BLOCK.GOLD_ORE,
    name: "Gold Ore",
    solid: true,
    texture: "gold_ore"
  },
  [BLOCK.DIAMOND_ORE]: {
    id: BLOCK.DIAMOND_ORE,
    name: "Diamond Ore",
    solid: true,
    texture: "diamond_ore"
  }
};
