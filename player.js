// ============================
//  JOUEUR & PHYSIQUE (VERSION SIMPLE)
// ============================

const PLAYER = {
  speed: 6,
  jumpSpeed: 8,
  gravity: -25,
  eyeHeight: 1.6
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

function isSolidAtXYZ(x, y, z) {
  const bx = Math.floor(x);
  const by = Math.floor(y);
  const bz = Math.floor(z);
  const id = getBlock(bx, by, bz);
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

  // --- collision Y (sol / plafond) ---
  player.onGround = false;

  // on regarde le bloc sous les pieds
  if (player.vy <= 0) {
    const nextFeetY = ny;
    if (isSolidAtXYZ(nx, nextFeetY - 0.1, nz)) {
      // on pose le joueur juste au-dessus du bloc
      ny = Math.floor(nextFeetY) + 0.001;
      player.vy = 0;
      player.onGround = true;
    }
  } else {
    // vers le haut : bloc au-dessus de la tête
    if (isSolidAtXYZ(nx, ny + 1.7, nz)) {
      player.vy = 0;
    }
  }

  // --- collision X ---
  const testX = nx;
  if (isSolidAtXYZ(testX, ny, nz) || isSolidAtXYZ(testX, ny + 0.9, nz)) {
    nx = player.x;
    player.vx = 0;
  }

  // --- collision Z ---
  const testZ = nz;
  if (isSolidAtXYZ(nx, ny, testZ) || isSolidAtXYZ(nx, ny + 0.9, testZ)) {
    nz = player.z;
    player.vz = 0;
  }

  player.x = nx;
  player.y = ny;
  player.z = nz;
}

