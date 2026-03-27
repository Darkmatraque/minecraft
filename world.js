const WORLD = {
  WIDTH: 256,
  DEPTH: 256,
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

/* ---------- TERRAIN ---------- */

function generateTerrain() {
  // 1) hauteur brute
  const heights = new Array(WORLD.WIDTH * WORLD.DEPTH);

  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {
      const nx = x / 128;
      const nz = z / 128;

      const hBase = heightNoise.noise(nx * 1.2, nz * 1.2);      // grandes formes
      const hDetail = heightNoise.noise(nx * 4.0, nz * 4.0);    // détails
      const hMount = heightNoise.noise(nx * 0.4, nz * 0.4);     // montagnes

      let height =
        35 +
        hBase * 10 +
        hDetail * 4 +
        Math.max(0, hMount) * 18; // montagnes positives

      height = Math.floor(height);
      if (height < 20) height = 20;
      if (height > WORLD.HEIGHT - 8) height = WORLD.HEIGHT - 8;

      heights[x + z * WORLD.WIDTH] = height;
    }
  }

  // 2) lissage simple pour éviter les “trous”
  for (let x = 1; x < WORLD.WIDTH - 1; x++) {
    for (let z = 1; z < WORLD.DEPTH - 1; z++) {
      const i = x + z * WORLD.WIDTH;
      const h =
        heights[i] +
        heights[i - 1] +
        heights[i + 1] +
        heights[i - WORLD.WIDTH] +
        heights[i + WORLD.WIDTH];
      heights[i] = Math.round(h / 5);
    }
  }

  // 3) remplissage blocs + rivières + grottes
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {
      const nx = x / 128;
      const nz = z / 128;

      const idx2D = x + z * WORLD.WIDTH;
      let height = heights[idx2D];

      // bruit rivière : lignes où la valeur est proche de 0
      const riverVal = tempNoise.noise(nx * 0.6, nz * 0.6);
      const isRiver = Math.abs(riverVal) < 0.08;

      // niveau d’eau global
      const waterLevel = 32;

      for (let y = 0; y < WORLD.HEIGHT; y++) {
        let block = BLOCK.AIR;

        if (y > height) {
          // air ou eau
          if (isRiver && y <= waterLevel) {
            block = BLOCK.WATER;
          } else {
            block = BLOCK.AIR;
          }
        } else {
          // sous la surface
          if (y === height) {
            if (isRiver && y <= waterLevel + 1) {
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

      // grottes : on creuse dans la pierre sous un certain niveau
      for (let y = 10; y < height - 4; y++) {
        const caveVal = humidNoise.noise(nx * 2.5, (y / 40) * 2.5 + nz * 2.5);
        if (caveVal > 0.55) {
          if (getBlock(x, y, z) === BLOCK.STONE || getBlock(x, y, z) === BLOCK.DIRT) {
            setBlock(x, y, z, BLOCK.AIR);
          }
        }
      }
    }
  }
}

/* ---------- STRUCTURES : ARBRES + MAISONS / VILLAGES ---------- */

function placeTree(x, z) {
  const y = getSurfaceHeightAt(x, z);
  if (y <= 0 || y >= WORLD.HEIGHT - 6) return;

  const ground = getBlock(x, y, z);
  if (ground !== BLOCK.GRASS) return;

  // tronc
  const trunkHeight = 4 + Math.floor(Math.random() * 2);
  for (let i = 1; i <= trunkHeight; i++) {
    setBlock(x, y + i, z, BLOCK.WOOD);
  }
  const topY = y + trunkHeight;

  // feuillage
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 4) continue;

        const bx = x + dx;
        const by = topY + dy;
        const bz = z + dz;

        if (!inBounds(bx, by, bz)) continue;

        // ne jamais creuser le sol
        if (by <= y) continue;

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

  // vérifie que la zone est à peu près plate
  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < d; dz++) {
      const yy = getSurfaceHeightAt(x + dx, z + dz);
      if (Math.abs(yy - baseY) > 1) return;
    }
  }

  // sol en planches
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

        // porte
        if (dz === Math.floor(d / 2) && dx === 0 && (dy === 1 || dy === 2)) {
          setBlock(bx, yy, bz, BLOCK.AIR);
        } else {
          setBlock(bx, yy, bz, BLOCK.PLANKS);
        }
      }
    }
  }

  // toit simple
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
  // arbres
  for (let i = 0; i < 300; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    placeTree(x, z);
  }

  // villages : quelques maisons espacées
  for (let i = 0; i < 10; i++) {
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
