/* ============================================================
   MOBS — BASE SYSTEM (passifs + hostiles)
   ============================================================ */

const MOB_TYPE = {
  COW: "cow",
  ZOMBIE: "zombie"
};

class Mob {
  constructor(type, x, y, z) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.z = z;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.hp = (type === MOB_TYPE.ZOMBIE) ? 20 : 10;
    this.speed = (type === MOB_TYPE.ZOMBIE) ? 2.0 : 1.2;

    this.onGround = false;
  }
}

let mobs = [];

/* ============================================================
   SPAWN DES MOBS
   ============================================================ */

function spawnMob(type, x, z) {
  const y = getSurfaceHeightAt(x, z) + 1;
  mobs.push(new Mob(type, x + 0.5, y, z + 0.5));
}

function spawnInitialMobs() {
  // vaches
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    spawnMob(MOB_TYPE.COW, x, z);
  }

  // zombies
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * WORLD.WIDTH);
    const z = Math.floor(Math.random() * WORLD.DEPTH);
    spawnMob(MOB_TYPE.ZOMBIE, x, z);
  }
}

/* ============================================================
   IA DES MOBS
   ============================================================ */

function updateMobAI(mob, delta) {
  const dx = player.x - mob.x;
  const dz = player.z - mob.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (mob.type === MOB_TYPE.COW) {
    // vache = marche aléatoire
    if (Math.random() < 0.01) {
      mob.vx = (Math.random() - 0.5) * mob.speed;
      mob.vz = (Math.random() - 0.5) * mob.speed;
    }
  }

  if (mob.type === MOB_TYPE.ZOMBIE) {
    // zombie = suit le joueur
    if (dist < 20) {
      mob.vx = (dx / dist) * mob.speed;
      mob.vz = (dz / dist) * mob.speed;
    } else {
      // marche aléatoire
      if (Math.random() < 0.01) {
        mob.vx = (Math.random() - 0.5) * mob.speed;
        mob.vz = (Math.random() - 0.5) * mob.speed;
      }
    }
  }
}

/* ============================================================
   PHYSIQUE DES MOBS
   ============================================================ */

function updateMobPhysics(mob, delta) {
  mob.vy -= PLAYER.gravity * delta;

  let nx = mob.x + mob.vx * delta;
  let ny = mob.y + mob.vy * delta;
  let nz = mob.z + mob.vz * delta;

  const r = 0.3;
  const h = 1.8;

  function solid(px, py, pz) {
    return BLOCK_DEFS[getBlock(Math.floor(px), Math.floor(py), Math.floor(pz))].solid;
  }

  // X
  if (solid(nx + r, ny, mob.z) || solid(nx - r, ny, mob.z)) {
    mob.vx = 0;
    nx = mob.x;
  }

  // Z
  if (solid(mob.x, ny, nz + r) || solid(mob.x, ny, nz - r)) {
    mob.vz = 0;
    nz = mob.z;
  }

  // Y
  mob.onGround = false;
  if (solid(nx, ny - 0.1, nz)) {
    mob.vy = 0;
    mob.onGround = true;
    ny = Math.floor(ny) + 0.05;
  }

  mob.x = nx;
  mob.y = ny;
  mob.z = nz;
}

/* ============================================================
   UPDATE GLOBAL
   ============================================================ */

function updateMobs(delta) {
  for (const mob of mobs) {
    updateMobAI(mob, delta);
    updateMobPhysics(mob, delta);
  }
}
