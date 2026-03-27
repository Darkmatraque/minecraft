const PLAYER = {
  height: 1.9,
  radius: 0.30,
  eyeHeight: 1.62,
  speed: 4.3,
  jumpSpeed: 8,
  gravity: 20
};

let player = {
  x: WORLD.WIDTH / 2,
  y: 60, // position des pieds
  z: WORLD.DEPTH / 2,
  vx: 0,
  vy: 0,
  vz: 0,
  onGround: false
};

function spawnPlayer() {
  const sx = Math.floor(WORLD.WIDTH / 2);
  const sz = Math.floor(WORLD.DEPTH / 2);
  const sy = getSurfaceHeightAt(sx, sz);

  player.x = sx + 0.5;
  player.z = sz + 0.5;

  // IMPORTANT : y = pieds
  player.y = sy + 1.01;

  player.vx = 0;
  player.vy = 0;
  player.vz = 0;
  player.onGround = false;
}

function movePlayer(delta, controlsDir) {
  const accel = PLAYER.speed;

  const forward = controlsDir.forward;
  const right = controlsDir.right;

  player.vx = (forward.x + right.x) * accel * controlsDir.move;
  player.vz = (forward.z + right.z) * accel * controlsDir.move;

  if (!player.onGround) {
    player.vy -= PLAYER.gravity * delta;
  }

  if (controlsDir.jump && player.onGround) {
    player.vy = PLAYER.jumpSpeed;
    player.onGround = false;
  }

  integratePlayer(delta);
}

function integratePlayer(delta) {
  let nx = player.x + player.vx * delta;
  let ny = player.y + player.vy * delta;
  let nz = player.z + player.vz * delta;

  const radius = PLAYER.radius;
  const height = PLAYER.height;

  function isSolidAt(px, py, pz) {
    const bx = Math.floor(px);
    const by = Math.floor(py);
    const bz = Math.floor(pz);
    const id = getBlock(bx, by, bz);
    const def = BLOCK_DEFS[id];
    return def && def.solid;
  }

  // === Hauteurs de test du joueur ===
  const foot = ny + 0.05;
  const knee = ny + height * 0.5;
  const head = ny + height - 0.05;

  // ===== COLLISION X =====
  if (
    isSolidAt(nx + radius, foot, player.z) ||
    isSolidAt(nx + radius, knee, player.z) ||
    isSolidAt(nx + radius, head, player.z) ||
    isSolidAt(nx - radius, foot, player.z) ||
    isSolidAt(nx - radius, knee, player.z) ||
    isSolidAt(nx - radius, head, player.z)
  ) {
    player.vx = 0;
    nx = player.x;
  }

  // ===== COLLISION Z =====
  if (
    isSolidAt(player.x, foot, nz + radius) ||
    isSolidAt(player.x, knee, nz + radius) ||
    isSolidAt(player.x, head, nz + radius) ||
    isSolidAt(player.x, foot, nz - radius) ||
    isSolidAt(player.x, knee, nz - radius) ||
    isSolidAt(player.x, head, nz - radius)
  ) {
    player.vz = 0;
    nz = player.z;
  }

  // ===== COLLISION Y =====
  player.onGround = false;

  // Collision plafond
  if (player.vy > 0) {
    if (
      isSolidAt(nx, ny + height, nz) ||
      isSolidAt(nx, ny + height - 0.1, nz)
    ) {
      player.vy = 0;
      ny = Math.floor(ny + height) - height - 0.001;
    }
  }

  // Collision sol
  else {
    if (isSolidAt(nx, ny - 0.05, nz)) {
      player.vy = 0;
      player.onGround = true;

      // pieds exactement au-dessus du bloc
      ny = Math.floor(ny) + 1.001;
    }
  }

  player.x = nx;
  player.y = ny;
  player.z = nz;

  // respawn si chute
  if (player.y < 0) {
    spawnPlayer();
  }
}
