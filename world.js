const WORLD = {
  WIDTH: 128,
  DEPTH: 128,
  HEIGHT: 64,
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

function generateTerrain() {
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {
      const nx = x / 64;
      const nz = z / 64;

      const hBase = heightNoise.noise(nx * 1.5, nz * 1.5);
      const hDetail = heightNoise.noise(nx * 4.0, nz * 4.0) * 0.25;
      let height = Math.floor(20 + (hBase * 0.7 + hDetail * 0.3) * 12);
      if (height < 4) height = 4;

      const temp = tempNoise.noise(nx * 0.8, nz * 0.8);
      const humid = humidNoise.noise(nx * 0.8, nz * 0.8);
      const heightNorm = (height - 4) / 32;
      const biome = getBiomeAt(temp, humid, heightNorm);

      for (let y = 0; y < WORLD.HEIGHT; y++) {
        if (y > height) {
          setBlock(x, y, z, BLOCK.AIR);
        } else if (y === height) {
          if (biome === BIOME.DESERT) setBlock(x, y, z, BLOCK.SAND);
          else setBlock(x, y, z, BLOCK.GRASS);
        } else if (y > height - 3) {
          setBlock(x, y, z, BLOCK.DIRT);
        } else {
          setBlock(x, y, z, BLOCK.STONE);
        }
      }
    }
  }
}

/* Structures : arbres + petites maisons */

function placeTree(x, z) {
  const y = getSurfaceHeightAt(x, z);
  if (y <= 0 || y >= WORLD.HEIGHT - 6) return;

  // tronc
  for (let i = 1; i <= 4; i++) {
    setBlock(x, y + i, z, BLOCK.WOOD);
  }
  const topY = y + 4;

  // feuillage simple cube 3x3x3
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -1; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 4) continue;
        const bx = x + dx;
        const by = topY + dy;
        const bz = z + dz;
        if (!inBounds(bx, by, bz)) continue;
        if (getBlock(bx, by, bz) === BLOCK.AIR) {
          setBlock(bx, by, bz, BLOCK.LEAVES);
        }
      }
    }
  }
}

function placeHouse(x, z) {
  const baseY = getSurfaceHeightAt(x, z);
  const w = 5, d = 5, h = 4;

  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < d; dz++) {
      const bx = x + dx;
      const bz = z + dz;
      const by = baseY + 1;
      if (!inBounds(bx, by, bz)) continue;

      // sol
      setBlock(bx, baseY, bz, BLOCK.PLANKS);

      // murs
      const isEdge = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
      if (isEdge) {
        for (let dy = 1; dy <= h; dy++) {
          const yy = baseY + dy;
          // porte
          if (dz === Math.floor(d / 2) && dx === 0 && (dy === 1 || dy === 2)) {
            setBlock(bx, yy, bz, BLOCK.AIR);
          } else {
            setBlock(bx, yy, bz, BLOCK.PLANKS);
          }
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

  // fenêtres
  const wy = baseY + 2;
  if (inBounds(x + Math.floor(w / 2), wy, z)) {
    setBlock(x + Math.floor(w / 2), wy, z, BLOCK.GLASS);
  }
}

function generateStructures() {
  // arbres
  for (let i = 0; i < 80; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    const y = getSurfaceHeightAt(x, z);
    const id = getBlock(x, y, z);
    if (id === BLOCK.GRASS) {
      placeTree(x, z);
    }
  }

  // petites maisons
  for (let i = 0; i < 8; i++) {
    const x = 10 + Math.floor(Math.random() * (WORLD.WIDTH - 20));
    const z = 10 + Math.floor(Math.random() * (WORLD.DEPTH - 20));
    placeHouse(x, z);
  }
}

function initWorld() {
  worldBlocks = new Uint8Array(WORLD.WIDTH * WORLD.HEIGHT * WORLD.DEPTH);
  generateTerrain();
  generateStructures();
}

/* Rebuild chunk */

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
