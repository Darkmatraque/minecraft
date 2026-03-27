function buildChunkMesh(cx, cz) {
  const size = CHUNK.SIZE;
  const startX = cx * size;
  const startZ = cz * size;

  const group = new THREE.Group();
  const cubeGeom = new THREE.BoxGeometry(1, 1, 1);

  for (let x = startX; x < startX + size; x++) {
    for (let z = startZ; z < startZ + size; z++) {
      for (let y = 0; y < WORLD.HEIGHT; y++) {

        const id = getBlock(x, y, z);
        if (id === BLOCK.AIR) continue;

        const def = BLOCK_DEFS[id];
        if (!def || !def.solid) continue;

        // Vérifie si un côté est visible
        let visible = false;
        const dirs = [
          [1,0,0], [-1,0,0],
          [0,1,0], [0,-1,0],
          [0,0,1], [0,0,-1]
        ];

        for (const [dx, dy, dz] of dirs) {
          const nx = x + dx;
          const ny = y + dy;
          const nz = z + dz;
          const nid = getBlock(nx, ny, nz);
          if (!BLOCK_DEFS[nid] || !BLOCK_DEFS[nid].solid) {
            visible = true;
            break;
          }
        }

        if (!visible) continue;

        const material = getMaterialForBlock(id);
        const cube = new THREE.Mesh(cubeGeom, material);
        cube.position.set(x, y, z);
        group.add(cube);
      }
    }
  }

  if (group.children.length === 0) return null;
  return group;
}

