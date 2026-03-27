// ============================
//  JOUEUR & PHYSIQUE
// ============================

const PLAYER = {
  radius: 0.4,
  height: 1.8,
  eyeHeight: 1.6,
  speed: 6,
  jumpSpeed: 8,
  gravity: -25
};

let player = {
  x: 0,
  y: 70,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  onGround: false
};

function spawnPlayer() {
  const sx = Math.floor(WORLD.WIDTH / 2);
  const sz = Math.floor(WORLD.DEPTH / 2);
  const sy = getSurfaceHeightAt(sx, sz) + 2;

  player.x = sx + 0.5;
  player.z = sz + 0.5;
  player.y = sy;

  player.vx = 0;
  player.vy = 0;
  player.vz = 0;
  player.onGround = false;
}

function isSolidBlockAt(x, y, z) {
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
    player.vx = moveDir.x * PLAYER.speed;
    player.vz = moveDir.z * PLAYER.speed;
  } else {
    player.vx = 0;
    player.vz = 0;
  }

  // gravité
  player.vy += PLAYER.gravity * delta;

  // saut
  if (dirVec.jump && player.onGround) {
    player.vy = PLAYER.jumpSpeed;
    player.onGround = false;
  }

  let nx = player.x + player.vx * delta;
  let ny = player.y + player.vy * delta;
  let nz = player.z + player.vz * delta;

  const r = PLAYER.radius;
  const h = PLAYER.height;

  // --- collision X ---
  if (
    isSolidBlockAt(nx + r, player.y, player.z) ||
    isSolidBlockAt(nx - r, player.y, player.z) ||
    isSolidBlockAt(nx + r, player.y + h * 0.5, player.z) ||
    isSolidBlockAt(nx - r, player.y + h * 0.5, player.z)
  ) {
    nx = player.x;
    player.vx = 0;
  }

  // --- collision Z ---
  if (
    isSolidBlockAt(player.x, player.y, nz + r) ||
    isSolidBlockAt(player.x, player.y, nz - r) ||
    isSolidBlockAt(player.x, player.y + h * 0.5, nz + r) ||
    isSolidBlockAt(player.x, player.y + h * 0.5, nz - r)
  ) {
    nz = player.z;
    player.vz = 0;
  }

  // --- collision Y ---
  player.onGround = false;

  if (player.vy > 0) {
    // monte → plafond
    if (
      isSolidBlockAt(nx, ny + h, nz) ||
      isSolidBlockAt(nx, ny + h * 0.9, nz)
    ) {
      ny = Math.floor(ny + h) - h;
      player.vy = 0;
    }
  } else {
    // descend → sol
    if (
      isSolidBlockAt(nx, ny, nz) ||
      isSolidBlockAt(nx, ny + 0.05, nz)
    ) {
      ny = Math.floor(ny) + 0.001;
      player.vy = 0;
      player.onGround = true;
    }
  }

  player.x = nx;
  player.y = ny;
  player.z = nz;
}
