// ============================
//  CONFIG MONDE
// ============================

const WORLD = {
  WIDTH: 256,
  DEPTH: 256,
  HEIGHT: 80,
  CHUNK_SIZE: 16
};

let worldBlocks = new Uint8Array(WORLD.WIDTH * WORLD.HEIGHT * WORLD.DEPTH);

// ============================
//  ACCÈS BLOCS
// ============================

function indexFromXYZ(x, y, z) {
  return x + z * WORLD.WIDTH + y * WORLD.WIDTH * WORLD.DEPTH;
}

function inBounds(x, y, z) {
  return (
    x >= 0 && x < WORLD.WIDTH &&
    z >= 0 && z < WORLD.DEPTH &&
    y >= 0 && y < WORLD.HEIGHT
  );
}

function getBlock(x, y, z) {
  if (!inBounds(x, y, z)) return BLOCK.AIR;
  return worldBlocks[indexFromXYZ(x, y, z)];
}

function setBlock(x, y, z, id) {
  if (!inBounds(x, y, z)) return;
  worldBlocks[indexFromXYZ(x, y, z)] = id;
}

// ============================
//  HAUTEUR SURFACE
// ============================

function getSurfaceHeightAt(x, z) {
  if (x < 0 || x >= WORLD.WIDTH || z < 0 || z >= WORLD.DEPTH) {
    return 0;
  }

  for (let y = WORLD.HEIGHT - 1; y >= 0; y--) {
    const b = getBlock(x, y, z);
    if (b !== BLOCK.AIR && BLOCK_DEFS[b] && BLOCK_DEFS[b].solid) {
      return y;
    }
  }

  return 0;
}

// ============================
//  TERRAIN
// ============================

function generateTerrain() {
  const heights = new Array(WORLD.WIDTH * WORLD.DEPTH);

  // --- hauteur brute ---
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {

      const nx = x / 256;
      const nz = z / 256;

      const hContinent = heightNoise.noise(nx * 0.3, nz * 0.3);
      const hBase      = heightNoise.noise(nx * 0.8, nz * 0.8);
      const hDetail    = heightNoise.noise(nx * 3.0, nz * 3.0);
      const hMount     = heightNoise.noise(nx * 0.2, nz * 0.2);

      let base = 40 + hContinent * 12;

      let height =
        base +
        hBase * 8 +
        hDetail * 3 +
        Math.max(0, hMount) * 18;

      height = Math.floor(height);

      if (height < 20) height = 20;
      if (height > WORLD.HEIGHT - 8) height = WORLD.HEIGHT - 8;

      heights[x + z * WORLD.WIDTH] = height;
    }
  }

  // --- lissage ---
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

    for (let i = 0; i < heights.length; i++) {
      if (tmp[i] !== undefined) heights[i] = tmp[i];
    }
  }

  const waterLevel = 38;

  // --- blocs ---
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {

      const nx = x / 256;
      const nz = z / 256;

      const idx2D = x + z * WORLD.WIDTH;
      let height = heights[idx2D];

      const temp  = tempNoise.noise(nx * 0.6, nz * 0.6);
      const humid = humidNoise.noise(nx * 0.6, nz * 0.6);
      const heightNorm = (height - 20) / (WORLD.HEIGHT - 24);

      const biome = getBiomeAt(temp, humid, heightNorm);

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
          }

        } else {

          if (y === height) {

            if (biome === BIOME.DESERT || biome === BIOME.BEACH) {
              block = BLOCK.SAND;
            } else if (biome === BIOME.SNOW) {
              block = BLOCK.SNOW;
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

      // --- grottes ---
      for (let y = 10; y < height - 8; y++) {

        const caveVal =
          humidNoise.noise(nx * 2.2, (y / 32) * 2.2 + nz * 2.2);

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

// ============================
//  INIT MONDE
// ============================

function initWorld() {
  worldBlocks = new Uint8Array(WORLD.WIDTH * WORLD.HEIGHT * WORLD.DEPTH);
  generateTerrain();
  generateOres();
  generateStructures();
}
