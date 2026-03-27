/* ============================
   INVENTAIRE + HOTBAR
   ============================ */

const INVENTORY_SIZE = 36; // 27 + 9 hotbar
const HOTBAR_SIZE = 9;

let inventory = new Array(INVENTORY_SIZE).fill(null);
let hotbarIndex = 0; // 0..8

function giveItem(itemId, count = 1) {
  // stack sur item existant
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = inventory[i];
    if (slot && slot.id === itemId && slot.count < 64) {
      const space = 64 - slot.count;
      const add = Math.min(space, count);
      slot.count += add;
      count -= add;
      if (count <= 0) return true;
    }
  }

  // sinon, nouveau slot
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    if (!inventory[i]) {
      inventory[i] = { id: itemId, count: Math.min(64, count) };
      count -= inventory[i].count;
      if (count <= 0) return true;
    }
  }

  return count <= 0;
}

function removeItem(itemId, count = 1) {
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = inventory[i];
    if (!slot || slot.id !== itemId) continue;

    const remove = Math.min(slot.count, count);
    slot.count -= remove;
    count -= remove;

    if (slot.count <= 0) inventory[i] = null;
    if (count <= 0) return true;
  }
  return false;
}

function getHotbarItem() {
  return inventory[hotbarIndex] || null;
}

function setHotbarIndex(index) {
  if (index < 0 || index >= HOTBAR_SIZE) return;
  hotbarIndex = index;
}

function cycleHotbar(delta) {
  hotbarIndex = (hotbarIndex + delta + HOTBAR_SIZE) % HOTBAR_SIZE;
}

/* ============================
   UTILISATION EN JEU
   ============================ */

// Quand tu casses un bloc :
function onBlockBroken(x, y, z, blockId) {
  const def = BLOCK_DEFS[blockId];
  if (!def) return;

  const dropId = def.drops ?? blockId;
  if (dropId !== BLOCK.AIR) {
    giveItem(dropId, 1);
  }

  setBlock(x, y, z, BLOCK.AIR);
}

// Quand tu places un bloc depuis la hotbar :
function placeBlockFromHotbar(x, y, z) {
  const slot = getHotbarItem();
  if (!slot) return;

  const itemDef = ITEM_DEFS[slot.id];
  if (!itemDef || itemDef.type !== ITEM_TYPE.BLOCK) return;

  const blockId = itemDef.blockId;
  if (!blockId && blockId !== 0) return;

  if (getBlock(x, y, z) !== BLOCK.AIR) return;

  setBlock(x, y, z, blockId);
  slot.count--;
  if (slot.count <= 0) {
    // vide le slot
    const index = hotbarIndex;
    inventory[index] = null;
  }
}
