/* ============================================================
   VIE + DÉGÂTS + COMBAT
   ============================================================ */

let playerHealth = 20;        // 20 = 10 cœurs
let playerInvincible = 0;     // frames d'invincibilité après un coup
const PLAYER_HIT_COOLDOWN = 0.6; // secondes

let attackCooldown = 0;       // cooldown attaque joueur

/* ============================================================
   APPLIQUER DES DÉGÂTS AU JOUEUR
   ============================================================ */

function damagePlayer(amount) {
  if (playerInvincible > 0) return;

  playerHealth -= amount;
  if (playerHealth < 0) playerHealth = 0;

  playerInvincible = PLAYER_HIT_COOLDOWN;

  if (playerHealth <= 0) {
    respawnPlayer();
  }
}

/* ============================================================
   RESPWAN
   ============================================================ */

function respawnPlayer() {
  playerHealth = 20;
  spawnPlayer();
}

/* ============================================================
   ATTAQUE DU JOUEUR
   ============================================================ */

function playerAttack() {
  if (attackCooldown > 0) return;

  const reach = 3.0;

  for (const mob of mobs) {
    const dx = mob.x - player.x;
    const dy = mob.y - player.y;
    const dz = mob.z - player.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    if (dist < reach) {
      hitMob(mob, 4); // dégâts de base
      attackCooldown = 0.4;
      return;
    }
  }
}

/* ============================================================
   DÉGÂTS AUX MOBS
   ============================================================ */

function hitMob(mob, amount) {
  mob.hp -= amount;
  if (mob.hp <= 0) {
    killMob(mob);
  }
}

function killMob(mob) {
  // drop simple
  if (mob.type === MOB_TYPE.COW) {
    giveItem(ITEM.COOKED_BEEF ?? ITEM.DIRT, 1); // remplace plus tard
  }
  if (mob.type === MOB_TYPE.ZOMBIE) {
    giveItem(ITEM.ROTTEN_FLESH ?? ITEM.DIRT, 1);
  }

  mobs = mobs.filter(m => m !== mob);
}

/* ============================================================
   ZOMBIES ATTAQUENT LE JOUEUR
   ============================================================ */

function updateMobCombat(mob, delta) {
  if (mob.type !== MOB_TYPE.ZOMBIE) return;

  const dx = mob.x - player.x;
  const dz = mob.z - player.z;
  const dist = Math.sqrt(dx*dx + dz*dz);

  if (dist < 1.3) {
    damagePlayer(3); // dégâts zombie
  }
}

/* ============================================================
   UPDATE GLOBAL
   ============================================================ */

function updateCombat(delta) {
  if (playerInvincible > 0) playerInvincible -= delta;
  if (attackCooldown > 0) attackCooldown -= delta;

  for (const mob of mobs) {
    updateMobCombat(mob, delta);
  }
}
