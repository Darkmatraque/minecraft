let inventoryGridEl;
let dragItem = null;
let dragIndex = -1;

function initInventoryUI() {
  inventoryGridEl = document.getElementById("inventory-grid");
  buildInventoryGrid();
  setupInventoryEvents();
}

function buildInventoryGrid() {
  inventoryGridEl.innerHTML = "";
  for (let i = 0; i < INVENTORY.slots.length; i++) {
    const slotEl = document.createElement("div");
    slotEl.className = "inv-slot";
    slotEl.dataset.index = i;
    inventoryGridEl.appendChild(slotEl);
  }
  refreshInventoryUI();
}

function refreshInventoryUI() {
  const children = inventoryGridEl.children;
  for (let i = 0; i < INVENTORY.slots.length; i++) {
    const slot = INVENTORY.slots[i];
    const el = children[i];
    el.innerHTML = "";
    if (slot.id !== BLOCK.AIR && slot.count > 0) {
      const def = BLOCK_DEFS[slot.id];
      el.textContent = def.name[0];
      if (slot.count > 1) {
        const countEl = document.createElement("span");
        countEl.className = "slot-count";
        countEl.textContent = slot.count;
        el.appendChild(countEl);
      }
    }
  }
}

function setupInventoryEvents() {
  inventoryGridEl.addEventListener("mousedown", (e) => {
    const slotEl = e.target.closest(".inv-slot");
    if (!slotEl) return;
    const index = Number(slotEl.dataset.index);
    const slot = INVENTORY.slots[index];
    if (!slot || slot.id === BLOCK.AIR || slot.count <= 0) return;

    dragIndex = index;
    dragItem = {
      id: slot.id,
      count: slot.count
    };
    slot.id = BLOCK.AIR;
    slot.count = 0;
    refreshInventoryUI();
    createDragVisual(e.clientX, e.clientY, dragItem);
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragItem) return;
    const dragEl = document.querySelector(".drag-item");
    if (!dragEl) return;
    dragEl.style.left = e.clientX - 20 + "px";
    dragEl.style.top = e.clientY - 20 + "px";
  });

  document.addEventListener("mouseup", (e) => {
    if (!dragItem) return;
    const dragEl = document.querySelector(".drag-item");
    if (dragEl) dragEl.remove();

    const slotEl = e.target.closest(".inv-slot");
    if (!slotEl) {
      // drop perdu → remettre dans l'ancien slot
      if (dragIndex >= 0) {
        INVENTORY.slots[dragIndex].id = dragItem.id;
        INVENTORY.slots[dragIndex].count = dragItem.count;
      }
      dragItem = null;
      dragIndex = -1;
      refreshInventoryUI();
      return;
    }

    const index = Number(slotEl.dataset.index);
    const target = INVENTORY.slots[index];

    if (target.id === BLOCK.AIR) {
      target.id = dragItem.id;
      target.count = dragItem.count;
    } else if (target.id === dragItem.id && target.count < 64) {
      const space = 64 - target.count;
      const add = Math.min(space, dragItem.count);
      target.count += add;
      dragItem.count -= add;
      if (dragItem.count > 0 && dragIndex >= 0) {
        INVENTORY.slots[dragIndex].id = dragItem.id;
        INVENTORY.slots[dragIndex].count = dragItem.count;
      }
    } else {
      // swap
      const tmp = { id: target.id, count: target.count };
      target.id = dragItem.id;
      target.count = dragItem.count;
      if (dragIndex >= 0) {
        INVENTORY.slots[dragIndex].id = tmp.id;
        INVENTORY.slots[dragIndex].count = tmp.count;
      }
    }

    dragItem = null;
    dragIndex = -1;
    refreshInventoryUI();
  });
}

function createDragVisual(x, y, item) {
  const def = BLOCK_DEFS[item.id];
  const el = document.createElement("div");
  el.className = "drag-item";
  el.textContent = def.name[0];
  const countEl = document.createElement("span");
  countEl.className = "slot-count";
  countEl.textContent = item.count;
  el.appendChild(countEl);
  el.style.left = x - 20 + "px";
  el.style.top = y - 20 + "px";
  document.body.appendChild(el);
}

