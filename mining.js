/* ============================================================
   MINAGE — OUTILS + DURETÉ + VITESSE
   ============================================================ */

// Temps minimal pour casser un bloc (en secondes)
const BASE_MINE_SPEED = 1.0;

/* ============================================================
   TABLE DES OUTILS
   ============================================================ */

const TOOL_SPEED = {
  none: 0.3,       // main nue
  wood: 1.0,
  stone: 1.5,
  iron: 2.0,
  diamond: 3.0
};

const TOOL_LEVEL = {
  none: 0,
  wood: 1,
  stone: 2,
  iron: 3,
  diamond: 4
};

/* ============================================================
   QUEL OUTIL LE JOUEUR TIENT ?
   ============================================================ */

function getHeldTool() {
  const slot = getHotbarItem();
  if (!slot) return { class: "none", level: 0, speed: TOOL_SPEED.none };

  const def = ITEM_DEFS[slot.id];
  if (!def || def.type !== ITEM_TYPE.TOOL) {
    return { class: "none", level: 0, speed: TOOL_SPEED.none };
  }

  const level = def.level;
  const className = def.toolClass;

  let speed = TOOL_SPEED.none;

  if (className === "pickaxe") {
    if (level === 1) speed = TOOL_SPEED.wood;
    if (level === 2) speed = TOOL_SPEED.stone;
    if (level === 3) speed = TOOL_SPEED.iron;
    if (level === 4) speed = TOOL_SPEED.diamond;
  }

  return {
    class: className,
    level: level,
    speed: speed
  };
}

/* ============================================================
   PEUT-ON CASSER CE BLOC ?
   ============================================================ */

function canBreakBlock(blockId, tool) {
  const def = BLOCK_DEFS[blockId];
  if (!def) return false;

  // blocs incassables (ex: bedrock plus tard)
  if (def.hardness <= 0) return false;

  // si c'est de la stone ou un minerai → pioche obligatoire
  const needsPickaxe =
    blockId === BLOCK.STONE ||
    blockId === BLOCK.COBBLESTONE ||
    blockId === BLOCK.COAL_ORE ||
    blockId === BLOCK.IRON_ORE ||
    blockId === BLOCK.COPPER_ORE ||
    blockId === BLOCK.GOLD_ORE ||
    blockId === BLOCK.DIAMOND_ORE;

  if (needsPickaxe && tool.class !== "pickaxe") return false;

  // niveau minimum
  if (needsPickaxe) {
    if (blockId === BLOCK.IRON_ORE && tool.level < 2) return false;
    if (blockId === BLOCK.GOLD_ORE && tool.level < 2) return false;
    if (blockId === BLOCK.DIAMOND_ORE && tool.level < 3) return false;
  }

  return true;
}

/* ============================================================
   TEMPS DE MINAGE
   ============================================================ */

function getMineTime(blockId, tool) {
  const def = BLOCK_DEFS[blockId];
  if (!def) return 999;

  const hardness = def.hardness;
  const speed = tool.speed;

  return BASE_MINE_SPEED * hardness / speed;
}

/* ============================================================
   ACTION DE MINER
   ============================================================ */

let miningProgress = 0;
let miningBlock = null;

function startMining(x, y, z) {
  const blockId = getBlock(x, y, z);
  if (blockId === BLOCK.AIR) return;

  const tool = getHeldTool();
  if (!canBreakBlock(blockId, tool)) return;

  miningBlock = { x, y, z, blockId };
  miningProgress = 0;
}

function updateMining(delta) {
  if (!miningBlock) return;

  const { x, y, z, blockId } = miningBlock;
  const tool = getHeldTool();

  if (!canBreakBlock(blockId, tool)) {
    miningBlock = null;
    return;
  }

  miningProgress += delta;

  const needed = getMineTime(blockId, tool);

  if (miningProgress >= needed) {
    // casse le bloc
    onBlockBroken(x, y, z, blockId);
    miningBlock = null;
  }
}

function stopMining() {
  miningBlock = null;
}
