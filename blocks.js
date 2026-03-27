/* ============================================================
   BLOCS AVANCÉS — STYLE MINECRAFT
   ============================================================ */

const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  COBBLESTONE: 4,

  SAND: 5,
  GRAVEL: 6,

  LOG: 7,
  PLANKS: 8,
  LEAVES: 9,

  GLASS: 10,
  TORCH: 11,

  CHEST: 12,
  DOOR_BOTTOM: 13,
  DOOR_TOP: 14,

  WATER: 15,
  LAVA: 16,

  COAL_ORE: 17,
  IRON_ORE: 18,
  COPPER_ORE: 19,
  GOLD_ORE: 20,
  DIAMOND_ORE: 21,

  GLOWSTONE: 22
};

/* ============================================================
   PROPRIÉTÉS DES BLOCS
   ============================================================ */

const BLOCK_DEFS = {

  /* ----- AIR ----- */
  [BLOCK.AIR]: {
    solid: false,
    transparent: true,
    drops: BLOCK.AIR,
    hardness: 0,
    gravity: false,
    light: 0,
    interact: null
  },

  /* ----- BLOCS DE BASE ----- */
  [BLOCK.GRASS]: {
    solid: true,
    transparent: false,
    drops: BLOCK.DIRT,
    hardness: 0.6,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.DIRT]: {
    solid: true,
    transparent: false,
    drops: BLOCK.DIRT,
    hardness: 0.5,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.STONE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.COBBLESTONE,
    hardness: 1.5,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.COBBLESTONE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.COBBLESTONE,
    hardness: 1.5,
    gravity: false,
    light: 0,
    interact: null
  },

  /* ----- BLOCS GRAVITATIONNELS ----- */
  [BLOCK.SAND]: {
    solid: true,
    transparent: false,
    drops: BLOCK.SAND,
    hardness: 0.5,
    gravity: true,
    light: 0,
    interact: null
  },

  [BLOCK.GRAVEL]: {
    solid: true,
    transparent: false,
    drops: BLOCK.GRAVEL,
    hardness: 0.6,
    gravity: true,
    light: 0,
    interact: null
  },

  /* ----- BOIS ----- */
  [BLOCK.LOG]: {
    solid: true,
    transparent: false,
    drops: BLOCK.LOG,
    hardness: 1.0,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.PLANKS]: {
    solid: true,
    transparent: false,
    drops: BLOCK.PLANKS,
    hardness: 0.8,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.LEAVES]: {
    solid: true,
    transparent: true,
    drops: BLOCK.AIR,
    hardness: 0.2,
    gravity: false,
    light: 0,
    interact: null
  },

  /* ----- VERRE ----- */
  [BLOCK.GLASS]: {
    solid: true,
    transparent: true,
    drops: BLOCK.AIR,
    hardness: 0.3,
    gravity: false,
    light: 0,
    interact: null
  },

  /* ----- TORCHE (LUMIÈRE) ----- */
  [BLOCK.TORCH]: {
    solid: false,
    transparent: true,
    drops: BLOCK.TORCH,
    hardness: 0,
    gravity: false,
    light: 14,
    interact: null
  },

  /* ----- COFFRE (INTERACTIF) ----- */
  [BLOCK.CHEST]: {
    solid: true,
    transparent: false,
    drops: BLOCK.CHEST,
    hardness: 2.5,
    gravity: false,
    light: 0,
    interact: "openChest" // fonction que tu ajouteras plus tard
  },

  /* ----- PORTE (2 BLOCS) ----- */
  [BLOCK.DOOR_BOTTOM]: {
    solid: true,
    transparent: true,
    drops: BLOCK.DOOR_BOTTOM,
    hardness: 1.5,
    gravity: false,
    light: 0,
    interact: "toggleDoor"
  },

  [BLOCK.DOOR_TOP]: {
    solid: true,
    transparent: true,
    drops: BLOCK.DOOR_BOTTOM,
    hardness: 1.5,
    gravity: false,
    light: 0,
    interact: "toggleDoor"
  },

  /* ----- FLUIDES ----- */
  [BLOCK.WATER]: {
    solid: false,
    transparent: true,
    drops: BLOCK.AIR,
    hardness: 0,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.LAVA]: {
    solid: false,
    transparent: true,
    drops: BLOCK.AIR,
    hardness: 0,
    gravity: false,
    light: 15,
    interact: null
  },

  /* ----- MINERAIS ----- */
  [BLOCK.COAL_ORE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.COAL_ORE,
    hardness: 1.0,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.IRON_ORE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.IRON_ORE,
    hardness: 1.2,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.COPPER_ORE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.COPPER_ORE,
    hardness: 1.1,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.GOLD_ORE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.GOLD_ORE,
    hardness: 1.3,
    gravity: false,
    light: 0,
    interact: null
  },

  [BLOCK.DIAMOND_ORE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.DIAMOND_ORE,
    hardness: 1.5,
    gravity: false,
    light: 0,
    interact: null
  },

  /* ----- GLOWSTONE (LUMIÈRE FORTE) ----- */
  [BLOCK.GLOWSTONE]: {
    solid: true,
    transparent: false,
    drops: BLOCK.GLOWSTONE,
    hardness: 0.4,
    gravity: false,
    light: 15,
    interact: null
  }
};
