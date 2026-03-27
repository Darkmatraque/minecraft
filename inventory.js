/* ============================
   INVENTAIRE + HOTBAR (COMPATIBLE MAIN.JS)
   ============================ */

const INVENTORY = {
  open: false,
  slots: [] // 36 slots (0-8 = hotbar)
};

function initInventory() {
  INVENTORY.slots = [];

  for (let i = 0; i < 36; i++) {
    INVENTORY.slots.push({
      id: BLOCK.AIR,
      count: 0
    });
  }
}

/* ============================
   AJOUT / RETRAIT D’ITEMS
   ============================ */

function addItem(id, count = 1) {
  // stack sur slot existant
  for (let slot of INVENTORY.slots) {
    if (slot.id === id && slot.count < 64) {
      const space = 64 - slot.count;
      const add = Math.min(space, count);
      slot.count += add;
      count -= add;
      if (count <= 0) return true;
    }
  }

  // sinon, nouveau slot
  for (let slot of INVENTORY.slots) {
    if (slot.id === BLOCK.AIR) {
      slot.id = id;
      slot.count = Math.min(64, count);
      count -= slot.count;
      if (count <= 0) return true;
    }
  }

  return false;
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

function getHotbarBlock(index) {
  return INVENTORY.slots[index].id;
}

/* ============================
   INVENTAIRE UI
   ============================ */

function toggleInventory() {
  INVENTORY.open = !INVENTORY.open;
  document.getElementById("inventory").style.display =
    INVENTORY.open ? "block" : "none";
}

function refreshInventoryUI() {
  const grid = document.getElementById("inventory-grid");
  grid.innerHTML = "";

  for (let i = 0; i < INVENTORY.slots.length; i++) {
    const slot = INVENTORY.slots[i];
    const def = BLOCK_DEFS[slot.id];

    const el = document.createElement("div");
    el.className = "inv-slot";

    if (slot.id !== BLOCK.AIR) {
      el.textContent = def.name[0];

      if (slot.count > 1) {
        const count = document.createElement("span");
        count.className = "slot-count";
        count.textContent = slot.count;
        el.appendChild(count);
      }
    }

    grid.appendChild(el);
  }
}
