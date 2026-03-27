// ============================
//  JOUEUR & PHYSIQUE
// ============================

const PLAYER = {
  x: 0,
  y: 70,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  radius: 0.4,
  height: 1.8,
  eyeHeight: 1.6,
  speed: 6,
  jumpSpeed: 8,
  gravity: -20,
  onGround: false
};

let player = {
  x: PLAYER.x,
  y: PLAYER.y,
  z: PLAYER.z
};

function spawnPlayer() {
  // spawn au centre du monde, sur le sol
  const sx = Math.floor(WORLD.WIDTH / 2);
  const sz = Math.floor(WORLD.DEPTH / 2);
  const sy = getSurfaceHeightAt(sx, sz) + 2;

  player.x = sx + 0.5;
  player.z = sz + 0.5;
  player.y = sy;

  PLAYER.vx = 0;
  PLAYER.vy = 0;
  PLAYER.vz = 0;
  PLAYER.onGround = false;
}

// collision AABB simple
function isSolidAt(x, y, z) {
  const id = getBlock(Math.floor(x), Math.floor(y), Math.floor(z));
  const def = BLOCK_DEFS[id];
  return def && def.solid;
}

function movePlayer(delta, dirVec) {
  // direction horizontale
  let moveDir = new THREE.Vector3();
  moveDir.add(dirVec.forward);
  moveDir.add(dirVec.right);

  if (dirVec.move > 0) {
    moveDir.normalize();
    PLAYER.vx = moveDir.x * PLAYER.speed;
    PLAYER.vz = moveDir.z * PLAYER.speed;
  } else {
    PLAYER.vx = 0;
    PLAYER.vz = 0;
  }

  // gravité
  PLAYER.vy += PLAYER.gravity * delta;

  // saut
  if (dirVec.jump && PLAYER.onGround) {
    PLAYER.vy = PLAYER.jumpSpeed;
    PLAYER.onGround = false;
  }

  // tentative de déplacement
  let nx = player.x + PLAYER.vx * delta;
  let ny = player.y + PLAYER.vy * delta;
  let nz = player.z + PLAYER.vz * delta;

  // collision horizontale (X/Z)
  const halfW = PLAYER.radius;
  const h = PLAYER.height;

  // X
  if (
    isSolidAt(nx + halfW, player.y, player.z) ||
    isSolidAt(nx - halfW, player.y, player.z) ||
    isSolidAt(nx + halfW, player.y + h * 0.5, player.z) ||
    isSolidAt(nx - halfW, player.y + h * 0.5, player.z)
  ) {
    nx = player.x;
    PLAYER.vx = 0;
  }

  // Z
  if (
    isSolidAt(player.x, player.y, nz + halfW) ||
    isSolidAt(player.x, player.y, nz - halfW) ||
    isSolidAt(player.x, player.y + h * 0.5, nz + halfW) ||
    isSolidAt(player.x, player.y + h * 0.5, nz - halfW)
  ) {
    nz = player.z;
    PLAYER.vz = 0;
  }

  // Y (sol / plafond)
  PLAYER.onGround = false;

  if (PLAYER.vy > 0) {
    // monte
    if (
      isSolidAt(nx, ny + h, nz) ||
      isSolidAt(nx, ny + h * 0.9, nz)
    ) {
      ny = Math.floor(ny + h) - h;
      PLAYER.vy = 0;
    }
  } else {
    // descend
    if (
      isSolidAt(nx, ny, nz) ||
      isSolidAt(nx, ny + 0.1, nz)
    ) {
      ny = Math.floor(ny) + 0.001;
      PLAYER.vy = 0;
      PLAYER.onGround = true;
    }
  }

  player.x = nx;
  player.y = ny;
  player.z = nz;
}

