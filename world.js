const WORLD = {
  WIDTH: 1024,
  DEPTH: 1024,
  HEIGHT: 80,
  CHUNK_SIZE: 16
};

let worldBlocks = new Uint8Array(WORLD.WIDTH * WORLD.HEIGHT * WORLD.DEPTH);

function indexFromXYZ(x, y, z) {
  return x + z * WORLD.WIDTH + y * WORLD.WIDTH * WORLD.DEPTH;
}

function inBounds(x, y, z) {
  return x >= 0 && x < WORLD.WIDTH &&
         z >= 0 && z < WORLD.DEPTH &&
         y >= 0 && y < WORLD.HEIGHT;
}

function getBlock(x, y, z) {
  if (!inBounds(x, y, z)) return BLOCK.AIR;
  return worldBlocks[indexFromXYZ(x, y, z)];
}

function setBlock(x, y, z, id) {
  if (!inBounds(x, y, z)) return;
  worldBlocks[indexFromXYZ(x, y, z)] = id;
}

function getSurfaceHeightAt(x, z) {
  for (let y = WORLD.HEIGHT - 1; y >= 0; y--) {
    if (getBlock(x, y, z) !== BLOCK.AIR) return y;
  }
  return 0;
}

/* ---------- TERRAIN : GRAND, LISSE, AVEC BIOMES ---------- */

function generateTerrain() {
  const heights = new Array(WORLD.WIDTH * WORLD.DEPTH);

  // 1) hauteur brute (style Minecraft : continents + collines + montagnes)
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {
      const nx = x / 256;
      const nz = z / 256;

      const hContinent = heightNoise.noise(nx * 0.3, nz * 0.3);   // grandes masses
      const hBase      = heightNoise.noise(nx * 0.8, nz * 0.8);   // collines
      const hDetail    = heightNoise.noise(nx * 3.0, nz * 3.0);   // petits détails
      const hMount     = heightNoise.noise(nx * 0.2, nz * 0.2);   // montagnes

      let base = 40 + hContinent * 12;
      let height =
        base +
        hBase * 8 +
        hDetail * 3 +
        Math.max(0, hMount) * 18; // montagnes positives

      height = Math.floor(height);
      if (height < 20) height = 20;
      if (height > WORLD.HEIGHT - 8) height = WORLD.HEIGHT - 8;

      heights[x + z * WORLD.WIDTH] = height;
    }
  }

// --- LISSAGE 5x5 POUR TERRAIN STYLE MINECRAFT ---
const tmp = new Array(WORLD.WIDTH * WORLD.DEPTH);

for (let pass = 0; pass < 3; pass++) {
  for (let x = 2; x < WORLD.WIDTH - 2; x++) {
    for (let z = 2; z < WORLD.DEPTH - 2; z++) {

      let sum = 0;
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          sum += heights[(x + dx) + (z + dz) * WORLD.WIDTH];
        }
      }

      tmp[x + z * WORLD.WIDTH] = Math.round(sum / 25);
    }
  }

  // copie vers heights
  for (let i = 0; i < heights.length; i++) {
    if (tmp[i] !== undefined) heights[i] = tmp[i];
  }
}


  const waterLevel = 38;

  // 3) remplissage blocs + biomes + rivières + grottes
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {
      const nx = x / 256;
      const nz = z / 256;

      const idx2D = x + z * WORLD.WIDTH;
      let height = heights[idx2D];

      // bruit température / humidité pour les biomes
      const temp  = tempNoise.noise(nx * 0.6, nz * 0.6);
      const humid = humidNoise.noise(nx * 0.6, nz * 0.6);
      const heightNorm = (height - 20) / (WORLD.HEIGHT - 24);
      const biome = getBiomeAt(temp, humid, heightNorm);

      // rivières : lignes où la valeur est proche de 0
      const riverVal = tempNoise.noise(nx * 1.2, nz * 1.2);
      const isRiver = Math.abs(riverVal) < 0.04;

      if (isRiver && height > waterLevel - 1) {
        height = waterLevel - 1;
        heights[idx2D] = height;
      }

      for (let y = 0; y < WORLD.HEIGHT; y++) {
        let block = BLOCK.AIR;

        if (y > height) {
          if (isRiver && y <= waterLevel) {
            block = BLOCK.WATER;
          } else {
            block = BLOCK.AIR;
          }
        } else {
          if (y === height) {
            // bloc de surface selon biome
            if (biome === BIOME.DESERT || biome === BIOME.BEACH) {
              block = BLOCK.SAND;
            } else if (biome === BIOME.SNOW) {
              block = BLOCK.SNOW; // ou GRASS + SNOW si tu as les deux
            } else if (biome === BIOME.RIVER && y <= waterLevel + 1) {
              block = BLOCK.SAND;
            } else {
              block = BLOCK.GRASS;
            }
          } else if (y >= height - 3) {
            block = BLOCK.DIRT;
          } else {
            block = BLOCK.STONE;
          }
        }

        setBlock(x, y, z, block);
      }

      // grottes : on creuse dans la pierre / terre sous un certain niveau
      for (let y = 10; y < height - 4; y++) {
        const caveVal = humidNoise.noise(nx * 2.2, (y / 32) * 2.2 + nz * 2.2);
        if (caveVal > 0.65) {
          const b = getBlock(x, y, z);
          if (b === BLOCK.STONE || b === BLOCK.DIRT) {
            setBlock(x, y, z, BLOCK.AIR);
          }
        }
      }
    }
  }
}

/* ---------- STRUCTURES : ARBRES + MAISONS ---------- */

function placeTree(x, z) {
  const y = getSurfaceHeightAt(x, z);
  if (y <= 0 || y >= WORLD.HEIGHT - 6) return;

  const ground = getBlock(x, y, z);
  if (ground !== BLOCK.GRASS) return;

  const trunkHeight = 4 + Math.floor(Math.random() * 2);
  for (let i = 1; i <= trunkHeight; i++) {
    setBlock(x, y + i, z, BLOCK.WOOD);
  }
  const topY = y + trunkHeight;

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 4) continue;

        const bx = x + dx;
        const by = topY + dy;
        const bz = z + dz;

        if (!inBounds(bx, by, bz)) continue;
        if (by <= y) continue; // ne jamais creuser le sol

        if (getBlock(bx, by, bz) === BLOCK.AIR) {
          setBlock(bx, by, bz, BLOCK.LEAVES);
        }
      }
    }
  }
}

function placeHouse(x, z) {
  const baseY = getSurfaceHeightAt(x, z);
  const w = 7, d = 7, h = 4;

  // zone à peu près plate
  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < d; dz++) {
      const yy = getSurfaceHeightAt(x + dx, z + dz);
      if (Math.abs(yy - baseY) > 1) return;
    }
  }

  // sol
  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < d; dz++) {
      const bx = x + dx;
      const bz = z + dz;
      if (!inBounds(bx, baseY, bz)) continue;
      setBlock(bx, baseY, bz, BLOCK.PLANKS);
    }
  }

  // murs
  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < d; dz++) {
      const isEdge = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
      if (!isEdge) continue;

      for (let dy = 1; dy <= h; dy++) {
        const bx = x + dx;
        const bz = z + dz;
        const yy = baseY + dy;
        if (!inBounds(bx, yy, bz)) continue;

        if (dz === Math.floor(d / 2) && dx === 0 && (dy === 1 || dy === 2)) {
          setBlock(bx, yy, bz, BLOCK.AIR); // porte
        } else {
          setBlock(bx, yy, bz, BLOCK.PLANKS);
        }
      }
    }
  }

  // toit
  for (let dx = -1; dx <= w; dx++) {
    for (let dz = -1; dz <= d; dz++) {
      const bx = x + dx;
      const bz = z + dz;
      const yy = baseY + h + 1;
      if (!inBounds(bx, yy, bz)) continue;
      setBlock(bx, yy, bz, BLOCK.WOOD);
    }
  }

  // fenêtre
  const wy = baseY + 2;
  const wx = x + Math.floor(w / 2);
  const wz = z + d - 1;
  if (inBounds(wx, wy, wz)) {
    setBlock(wx, wy, wz, BLOCK.GLASS);
  }
}

function generateStructures() {
  // arbres (beaucoup, le monde est grand)
  for (let i = 0; i < 2000; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    placeTree(x, z);
  }

  // maisons / pseudo-villages
  for (let i = 0; i < 40; i++) {
    const x = 16 + Math.floor(Math.random() * (WORLD.WIDTH - 32));
    const z = 16 + Math.floor(Math.random() * (WORLD.DEPTH - 32));
    placeHouse(x, z);
  }
}

/* ---------- INIT MONDE ---------- */

function initWorld() {
  worldBlocks = new Uint8Array(WORLD.WIDTH * WORLD.HEIGHT * WORLD.DEPTH);
  generateTerrain();
  generateStructures();
}

/* ---------- REBUILD CHUNK ---------- */

function rebuildChunkAt(x, z) {
  const cx = Math.floor(x / WORLD.CHUNK_SIZE);
  const cz = Math.floor(z / WORLD.CHUNK_SIZE);
  const key = `${cx},${cz}`;
  const old = chunkMeshes.get(key);
  if (old) {
    scene.remove(old);
    chunkMeshes.delete(key);
  }
  ensureChunk(cx, cz);
}

