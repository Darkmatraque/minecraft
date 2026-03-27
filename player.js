// ============================
//  PLAYER (VERSION ULTRA SIMPLE)
// ============================

let player = {
  x: 0,
  y: 70,
  z: 0,
  vy: 0,
  onGround: false
};

const PLAYER = {
  eyeHeight: 1.6,
  speed: 6,
  jumpSpeed: 8,
  gravity: -25
};

function spawnPlayer() {
  const sx = Math.floor(WORLD.WIDTH / 2);
  const sz = Math.floor(WORLD.DEPTH / 2);
  const sy = getSurfaceHeightAt(sx, sz) + 2;

  player.x = sx + 0.5;
  player.z = sz + 0.5;
  player.y = sy;
  player.vy = 0;
  player.onGround = false;
}

function isSolid(x, y, z) {
  const id = getBlock(Math.floor(x), Math.floor(y), Math.floor(z));
  const def = BLOCK_DEFS[id];
  return def && def.solid;
}

function movePlayer(delta, dir) {
  // mouvement horizontal
  let dx = 0;
  let dz = 0;

  if (dir.move) {
    dx = dir.forward.x * PLAYER.speed * delta + dir.right.x * PLAYER.speed * delta;
    dz = dir.forward.z * PLAYER.speed * delta + dir.right.z * PLAYER.speed * delta;
  }

  // tentative X
  let nx = player.x + dx;
  if (!isSolid(nx, player.y, player.z)) {
    player.x = nx;
  }

  // tentative Z
  let nz = player.z + dz;
  if (!isSolid(player.x, player.y, nz)) {
    player.z = nz;
  }

  // gravité
  player.vy += PLAYER.gravity * delta;

  // tentative Y
  let ny = player.y + player.vy * delta;

  if (player.vy <= 0) {
    // collision sol
    if (isSolid(player.x, ny - 0.1, player.z)) {
      player.y = Math.floor(ny) + 0.001;
      player.vy = 0;
      player.onGround = true;
    } else {
      player.y = ny;
      player.onGround = false;
    }
  } else {
    // collision plafond
    if (isSolid(player.x, ny + 1.7, player.z)) {
      player.vy = 0;
    } else {
      player.y = ny;
    }
  }

  // saut
  if (dir.jump && player.onGround) {
    player.vy = PLAYER.jumpSpeed;
    player.onGround = false;
  }
}
