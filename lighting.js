/* ============================================================
   LUMIÈRE — propagation simple
   ============================================================ */

let lightMap = new Uint8Array(WORLD.WIDTH * WORLD.HEIGHT * WORLD.DEPTH);

function getLight(x, y, z) {
  if (!inBounds(x, y, z)) return 0;
  return lightMap[indexFromXYZ(x, y, z)];
}

function setLight(x, y, z, v) {
  if (!inBounds(x, y, z)) return;
  lightMap[indexFromXYZ(x, y, z)] = v;
}

function rebuildLighting() {
  lightMap.fill(0);

  const queue = [];

  // sources de lumière
  for (let x = 0; x < WORLD.WIDTH; x++) {
    for (let z = 0; z < WORLD.DEPTH; z++) {
      for (let y = 0; y < WORLD.HEIGHT; y++) {
        const block = getBlock(x, y, z);
        const def = BLOCK_DEFS[block];
        if (def.light > 0) {
          setLight(x, y, z, def.light);
          queue.push([x, y, z]);
        }
      }
    }
  }

  // propagation BFS
  while (queue.length > 0) {
    const [x, y, z] = queue.shift();
    const lv = getLight(x, y, z);

    if (lv <= 1) continue;

    const dirs = [
      [1,0,0], [-1,0,0],
      [0,1,0], [0,-1,0],
      [0,0,1], [0,0,-1]
    ];

    for (const [dx, dy, dz] of dirs) {
      const nx = x + dx, ny = y + dy, nz = z + dz;
      if (!inBounds(nx, ny, nz)) continue;

      const block = getBlock(nx, ny, nz);
      if (BLOCK_DEFS[block].solid) continue;

      if (getLight(nx, ny, nz) + 1 < lv) {
        setLight(nx, ny, nz, lv - 1);
        queue.push([nx, ny, nz]);
      }
    }
  }
}
