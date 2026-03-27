// inventory_ui.js — UI de l’inventaire Minecraft

let inventoryEl;
let inventoryGridEl;
let hotbarElUI;
let draggedItem = null;
let draggedIndex = null;

function initInventoryUI() {
  inventoryEl = document.getElementById("inventory");
  inventoryGridEl = document.getElementById("inventory-grid");
  hotbarElUI = document.getElementById("hotbar");

  // Génération de la grille 27 slots
  inventoryGridEl.innerHTML = "";
  for (let i = 0; i < INVENTORY.slots.length; i++) {
    const slot = document.createElement("div");
    slot.className = "inv-slot";
    slot.dataset.index = i;

    slot.addEventListener("mousedown", onInventorySlotClick);
    inventoryGridEl.appendChild(slot);
  }

  updateInventoryUI();
  updateHotbarUI();
}

function toggleInventory() {
  INVENTORY.open = !INVENTORY.open;

  if (INVENTORY.open) {
    inventoryEl.style.display = "block";
    document.exitPointerLock();
  } else {
    inventoryEl.style.display = "none";
    const canvas = document.getElementById("game-canvas");
    canvas.requestPointerLock();
  }

  updateInventoryUI();
  updateHotbarUI();
}

function onInventorySlotClick(e) {
  const index = Number(e.currentTarget.dataset.index);
  const slot = INVENTORY.slots[index];

  // Si rien en main → prendre le slot
  if (!draggedItem) {
    if (slot.id !== BLOCK.AIR) {
      draggedItem = { ...slot };
      draggedIndex = index;
      slot.id = BLOCK.AIR;
      slot.count = 0;
    }
  } else {
    // Si même item → stack
    if (slot.id === draggedItem.id || slot.id === BLOCK.AIR) {
      const space = 64 - slot.count;
      const add = Math.min(space, draggedItem.count);

      if (slot.id === BLOCK.AIR) slot.id = draggedItem.id;
      slot.count += add;
      draggedItem.count -= add;

      if (draggedItem.count <= 0) {
        draggedItem = null;
        draggedIndex = null;
      }
    } else {
      // Swap
      const temp = { ...slot };
      slot.id = draggedItem.id;
      slot.count = draggedItem.count;

      draggedItem = temp;
      draggedIndex = index;
    }
  }

  updateInventoryUI();
  updateHotbarUI();
}

function updateInventoryUI() {
  const slots = inventoryGridEl.children;

  for (let i = 0; i < INVENTORY.slots.length; i++) {
    const slotEl = slots[i];
    const slot = INVENTORY.slots[i];
    const def = BLOCK_DEFS[slot.id];

    slotEl.innerHTML = "";

    if (slot.id !== BLOCK.AIR) {
      const icon = document.createElement("div");
      icon.className = "inv-icon";
      icon.textContent = def.name[0];
      slotEl.appendChild(icon);

      if (slot.count > 1) {
        const count = document.createElement("span");
        count.className = "inv-count";
        count.textContent = slot.count;
        slotEl.appendChild(count);
      }
    }
  }
}

function updateHotbarUI() {
  hotbarElUI.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const slot = INVENTORY.slots[i];
    const def = BLOCK_DEFS[slot.id];

    const slotEl = document.createElement("div");
    slotEl.className = "hotbar-slot";
    if (i === selectedHotbarIndex) slotEl.classList.add("selected");

    if (slot.id !== BLOCK.AIR) {
      slotEl.textContent = def.name[0];

      if (slot.count > 1) {
        const count = document.createElement("span");
        count.className = "slot-count";
        count.textContent = slot.count;
        slotEl.appendChild(count);
      }
    } else {
      slotEl.textContent = "?";
    }

    hotbarElUI.appendChild(slotEl);
  }
}
