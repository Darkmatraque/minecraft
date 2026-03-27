/* ============================
   CRAFTING 2x2
   ============================ */

// Grille 2x2 : indices 0 1
//                      2 3
let craftingGrid = [null, null, null, null];

// Résultat courant
let craftingResult = null;

// Recettes : pattern 2x2 -> itemId
// null = case vide
const RECIPES = [
  // Exemple : 1 log -> 4 planks (n'importe où dans la grille)
  {
    name: "Log -> Planks",
    pattern: [
      [ITEM.LOG, null],
      [null, null]
    ],
    result: { id: ITEM.PLANKS, count: 4 },
    flexible: true // peu importe la position
  },

  // Exemple : 2 planks vertical -> sticks x4
  {
    name: "Planks -> Sticks",
    pattern: [
      [ITEM.PLANKS, null],
      [ITEM.PLANKS, null]
    ],
    result: { id: ITEM.STONE, count: 4 }, // remplace par ITEM.STICK quand tu l'auras
    flexible: false
  }
];

/* ============================
   GESTION DE LA GRILLE
   ============================ */

function setCraftSlot(index, itemId) {
  if (index < 0 || index >= 4) return;
  craftingGrid[index] = itemId;
  updateCraftingResult();
}

function clearCraftGrid() {
  for (let i = 0; i < 4; i++) craftingGrid[i] = null;
  craftingResult = null;
}

/* ============================
   MATCHING DES RECETTES
   ============================ */

function updateCraftingResult() {
  craftingResult = null;

  for (const recipe of RECIPES) {
    if (matchRecipe(recipe)) {
      craftingResult = { ...recipe.result };
      return;
    }
  }
}

function matchRecipe(recipe) {
  const p = recipe.pattern;

  // grille actuelle sous forme 2x2
  const g = [
    [craftingGrid[0], craftingGrid[1]],
    [craftingGrid[2], craftingGrid[3]]
  ];

  if (recipe.flexible) {
    // on teste toutes les positions possibles
    return matchFlexible(p, g);
  } else {
    // match strict
    return matchExact(p, g);
  }
}

function matchExact(pattern, grid) {
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      const need = pattern[y][x];
      const have = grid[y][x];
      if (need === null) {
        if (have !== null) return false;
      } else {
        if (have !== need) return false;
      }
    }
  }
  return true;
}

function matchFlexible(pattern, grid) {
  // On essaie de "caler" le pattern sur la grille
  // en ignorant les null autour
  const variants = generatePatternVariants(pattern);
  for (const v of variants) {
    if (matchExact(v, grid)) return true;
  }
  return false;
}

function generatePatternVariants(pattern) {
  // Pour 2x2, on génère juste les décalages possibles
  const variants = [];

  // pattern original
  variants.push(pattern);

  // pattern décalé à droite
  variants.push([
    [null, pattern[0][0]],
    [null, pattern[1][0]]
  ]);

  // pattern décalé en bas
  variants.push([
    [null, null],
    [pattern[0][0], null]
  ]);

  // pattern décalé bas-droite
  variants.push([
    [null, null],
    [null, pattern[0][0]]
  ]);

  return variants;
}

/* ============================
   APPLIQUER LE CRAFT
   ============================ */

function tryCraft() {
  if (!craftingResult) return false;

  // Vérifier qu'on peut ajouter le résultat dans l'inventaire
  const ok = giveItem(craftingResult.id, craftingResult.count);
  if (!ok) return false;

  // Consommer les items de la grille
  for (let i = 0; i < 4; i++) {
    if (craftingGrid[i] !== null) {
      removeItem(craftingGrid[i], 1);
      craftingGrid[i] = null;
    }
  }

  craftingResult = null;
  updateCraftingResult();
  return true;
}
