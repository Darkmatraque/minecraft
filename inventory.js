// inventory.js — Inventaire Minecraft complet

const INVENTORY = {
  cols: 9,
  rows: 3,
  slots: [], // 27 slots
  open: false
};

// Structure d’un slot : { id: BLOCK.xxx, count: number }

function initInventory() {
  const total = INVENTORY.cols * INVENTORY.rows;
  INVENTORY.slots = [];

  for (let i = 0; i < total; i++) {
    INVENTORY.slots.push({ id: BLOCK.AIR, count: 0 });
  }

  // Items de départ (à retirer si tu veux)
  addItem(BLOCK.STONE, 64);
  addItem(BLOCK.DIRT, 64);
  addItem(BLOCK.GRASS, 32);
}

function addItem(blockId, amount) {
  // 1) Stack sur slots existants
  for (let slot of INVENTORY.slots) {
    if (slot.id === blockId && slot.count < 64) {
      const space = 64 - slot.count;
      const add = Math.min(space, amount);
      slot.count += add;
      amount -= add;
      if (amount <= 0) return true;
    }
  }

  // 2) Remplir slots vides
  for (let slot of INVENTORY.slots) {
    if (slot.id === BLOCK.AIR) {
      const add = Math.min(64, amount);
      slot.id = blockId;
      slot.count = add;
      amount -= add;
      if (amount <= 0) return true;
    }
  }

  return amount <= 0;
}

function getHotbarBlock(index) {
  const slot = INVENTORY.slots[index];
  if (!slot || slot.id === BLOCK.AIR || slot.count <= 0) return BLOCK.AIR;
  return slot.id;
}

function consumeHotbar(index) {
  const slot = INVENTORY.slots[index];
  if (!slot || slot.id === BLOCK.AIR || slot.count <= 0) return false;

  slot.count--;
  if (slot.count <= 0) {
    slot.id = BLOCK.AIR;
    slot.count = 0;
  }
  return true;
}
