/* ============================================================
   FLUIDES — eau + lave
   ============================================================ */

let fluidQueue = [];

function scheduleFluidUpdate(x, y, z) {
  fluidQueue.push([x, y, z]);
}

function updateFluids() {
  const next = [];

  for (const [x, y, z] of fluidQueue) {
    const block = getBlock(x, y, z);

    if (block !== BLOCK.WATER && block !== BLOCK.LAVA) continue;

    // coule vers le bas
    if (getBlock(x, y - 1, z) === BLOCK.AIR) {
      setBlock(x, y - 1, z, block);
      next.push([x, y - 1, z]);
      continue;
    }

    // sinon s'étale
    const dirs = [
      [1,0], [-1,0], [0,1], [0,-1]
    ];

    for (const [dx, dz] of dirs) {
      const nx = x + dx, nz = z + dz;
      if (getBlock(nx, y, nz) === BLOCK.AIR) {
        setBlock(nx, y, nz, block);
        next.push([nx, y, nz]);
      }
    }
  }

  fluidQueue = next;
}
