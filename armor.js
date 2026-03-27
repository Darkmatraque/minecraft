/* ============================================================
   ARMURES — casque / plastron / jambières / bottes
   ============================================================ */

const ARMOR_SLOT = {
  HELMET: 0,
  CHEST: 1,
  LEGS: 2,
  BOOTS: 3
};

let armorSlots = [null, null, null, null]; // 4 pièces

// Valeurs d’armure façon Minecraft
const ARMOR_STATS = {
  LEATHER: 1,
  IRON: 2,
  DIAMOND: 3
};

function equipArmor(slot, itemId) {
  armorSlots[slot] = itemId;
}

function unequipArmor(slot) {
  armorSlots[slot] = null;
}

function getTotalArmor() {
  let total = 0;

  for (const item of armorSlots) {
    if (!item) continue;

    const def = ITEM_DEFS[item];
    if (!def || !def.armor) continue;

    total += def.armor;
  }

  return total;
}

/* ============================================================
   RÉDUCTION DES DÉGÂTS
   ============================================================ */

function applyArmorReduction(damage) {
  const armor = getTotalArmor();

  // réduction simple : 4 points d’armure = -20%
  const reduction = armor * 0.05;

  return damage * (1 - reduction);
}
