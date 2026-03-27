/* ============================================================
   STRUCTURES AVANCÉES — villages + donjons
   ============================================================ */

function isAreaFlat(x, z, w, d, maxDiff = 1) {
  const base = getSurfaceHeightAt(x, z);
  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < d; dz++) {
      const h = getSurfaceHeightAt(x + dx, z + dz);
      if (Math.abs(h - base) > maxDiff) return false;
    }
  }
  return true;
}

/* ------------------------------
   MAISON SIMPLE (village)
------------------------------ */

function placeVillageHouse(x, z) {
  if (!isAreaFlat(x, z, 7, 7)) return;

  placeHouse(x, z); // ta fonction existante
}

/* ------------------------------
   DONJON SIMPLE
------------------------------ */

function placeDungeon(x, z) {
  if (!isAreaFlat(x, z, 9, 9)) return;

  const baseY = getSurfaceHeightAt(x, z);

  // murs
  for (let dx = 0; dx < 9; dx++) {
    for (let dz = 0; dz < 9; dz++) {
      const edge = dx === 0 || dx === 8 || dz === 0 || dz === 8;
      for (let dy = 0; dy < 5; dy++) {
        setBlock(x + dx, baseY + dy, z + dz, edge ? BLOCK.COBBLESTONE : BLOCK.AIR);
      }
    }
  }

  // spawner (plus tard)
  // coffre (plus tard)
}

/* ------------------------------
   GÉNÉRATION
------------------------------ */

function generateAdvancedStructures() {
  // villages
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    placeVillageHouse(x, z);
  }

  // donjons
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    placeDungeon(x, z);
  }
}
