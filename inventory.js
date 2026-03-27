const INVENTORY = {
  slots: [],
  open: false
};

function initInventory() {
  // 9 slots hotbar + 27 slots inventaire = 36
  INVENTORY.slots = [];
  for (let i = 0; i < 36; i++) {
    INVENTORY.slots.push({ id: BLOCK.AIR, count: 0 });
  }

  // donner quelques blocs pour tester
  INVENTORY.slots[0] = { id: BLOCK.STONE, count: 64 };
  INVENTORY.slots[1] = { id: BLOCK.WOOD, count: 32 };
  INVENTORY.slots[2] = { id: BLOCK.PLANKS, count: 32 };
}

function addItem(id, count) {
  // stacker d'abord
  for (let slot of INVENTORY.slots) {
    if (slot.id === id && slot.count < 64) {
      const space = 64 - slot.count;
      const add = Math.min(space, count);
      slot.count += add;
      count -= add;
      if (count <= 0) return;
    }
  }
  // slots vides
  for (let slot of INVENTORY.slots) {
    if (slot.id === BLOCK.AIR) {
      const add = Math.min(64, count);
      slot.id = id;
      slot.count = add;
      count -= add;
      if (count <= 0) return;
    }
  }
}

function getHotbarBlock(index) {
  const slot = INVENTORY.slots[index];
  if (!slot || slot.id === BLOCK.AIR || slot.count <= 0) return BLOCK.AIR;
  return slot.id;
}

function consumeHotbar(index) {
  const slot = INVENTORY.slots[index];
  if (!slot || slot.id === BLOCK.AIR) return;
  slot.count--;
  if (slot.count <= 0) {
    slot.id = BLOCK.AIR;
    slot.count = 0;
  }
}

function toggleInventory() {
  INVENTORY.open = !INVENTORY.open;
  const invEl = document.getElementById("inventory");
  invEl.style.display = INVENTORY.open ? "flex" : "none";
}
