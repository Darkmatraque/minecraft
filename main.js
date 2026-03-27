let renderer, scene, camera, controls;
let canvas;
let clock;
let chunkMeshes = new Map();
let currentBiomeLabel = BIOME.PLAINS;
let selectedHotbarIndex = 0;

const CHUNK = {
  SIZE: WORLD.CHUNK_SIZE
};

let keys = {};
let pointerLocked = false;
let hotbarEl, biomeLabelEl, posLabelEl, hintEl;

/* ===== TEXTURES ASCII ===== */

const materialCache = new Map();

function getBlockTexture(blockId) {
  const canvas = generateBlockTextureCanvas(blockId, 16);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  return tex;
}

function getMaterialForBlock(blockId) {
  if (materialCache.has(blockId)) return materialCache.get(blockId);

  const tex = getBlockTexture(blockId);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true
  });

  materialCache.set(blockId, mat);
  return mat;
}

/* ===== CHUNKS & RENDU ===== */

function chunkKey(cx, cz) {
  return `${cx},${cz}`;
}

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

function ensureChunk(cx, cz) {
  const key = chunkKey(cx, cz);
  if (chunkMeshes.has(key)) return;

  const mesh = buildChunkMesh(cx, cz);
  if (mesh) {
    scene.add(mesh);
    chunkMeshes.set(key, mesh);
  }
}

function updateVisibleChunks() {
  const range = 3;
  const cx = Math.floor(player.x / CHUNK.SIZE);
  const cz = Math.floor(player.z / CHUNK.SIZE);

  const needed = new Set();

  for (let dx = -range; dx <= range; dx++) {
    for (let dz = -range; dz <= range; dz++) {
      const ncx = cx + dx;
      const ncz = cz + dz;
      if (ncx < 0 || ncz < 0) continue;
      if (ncx >= WORLD.WIDTH / CHUNK.SIZE || ncz >= WORLD.DEPTH / CHUNK.SIZE) continue;
      const key = chunkKey(ncx, ncz);
      needed.add(key);
      ensureChunk(ncx, ncz);
    }
  }

  for (const [key, mesh] of chunkMeshes.entries()) {
    if (!needed.has(key)) {
      scene.remove(mesh);
      chunkMeshes.delete(key);
    }
  }
}

function rebuildChunkAt(x, z) {
  const cx = Math.floor(x / CHUNK.SIZE);
  const cz = Math.floor(z / CHUNK.SIZE);
  const key = chunkKey(cx, cz);
  const old = chunkMeshes.get(key);
  if (old) {
    scene.remove(old);
    chunkMeshes.delete(key);
  }
  ensureChunk(cx, cz);
}

/* ===== RAYCAST ===== */

function getLookRay() {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  return dir.normalize();
}

function raycastBlock(maxDist = 6) {
  const origin = new THREE.Vector3(player.x, player.y + PLAYER.eyeHeight, player.z);
  const dir = getLookRay();

  const step = 0.1;
  let dist = 0;
  let lastAirPos = null;

  while (dist < maxDist) {
    const px = origin.x + dir.x * dist;
    const py = origin.y + dir.y * dist;
    const pz = origin.z + dir.z * dist;

    const bx = Math.floor(px);
    const by = Math.floor(py);
    const bz = Math.floor(pz);

    const id = getBlock(bx, by, bz);
    if (id !== BLOCK.AIR) {
      return { hit: true, x: bx, y: by, z: bz, placePos: lastAirPos };
    }

    lastAirPos = { x: bx, y: by, z: bz };
    dist += step;
  }

  return { hit: false };
}

/* ===== CONTROLES & INVENTAIRE ===== */

function initControls() {
  document.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    if (e.code.startsWith("Digit")) {
      const num = Number(e.code.slice(-1));
      if (num >= 1 && num <= 9) {
        selectedHotbarIndex = num - 1;
        updateHotbarUI();
      }
    }

    if (e.code === "KeyE") {
      toggleInventory();
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  document.addEventListener("wheel", (e) => {
    if (INVENTORY.open) return;
    if (e.deltaY < 0) {
      selectedHotbarIndex = (selectedHotbarIndex + 8) % 9;
    } else {
      selectedHotbarIndex = (selectedHotbarIndex + 1) % 9;
    }
    updateHotbarUI();
  });

  document.body.addEventListener("click", () => {
    if (!INVENTORY.open && !pointerLocked) {
      controls.lock();
    }
  });

  controls.addEventListener("lock", () => {
    pointerLocked = true;
    hintEl.style.display = "none";
  });

  controls.addEventListener("unlock", () => {
    pointerLocked = false;
    hintEl.style.display = "block";
  });

  document.addEventListener("mousedown", (e) => {
    if (!pointerLocked || INVENTORY.open) return;

    if (e.button === 0) {
      mineBlock();
    } else if (e.button === 2) {
      placeBlock();
    }
  });

  document.addEventListener("contextmenu", (e) => e.preventDefault());
}

/* ===== MINAGE & PLACEMENT ===== */

function mineBlock() {
  const hit = raycastBlock();
  if (!hit.hit) return;

  const id = getBlock(hit.x, hit.y, hit.z);
  if (id === BLOCK.AIR) return;

  addItem(id, 1);

  setBlock(hit.x, hit.y, hit.z, BLOCK.AIR);
  rebuildChunkAt(hit.x, hit.z);

  updateHotbarUI();
  refreshInventoryUI();
}

function placeBlock() {
  const hit = raycastBlock();
  if (!hit.hit || !hit.placePos) return;

  const blockId = getHotbarBlock(selectedHotbarIndex);
  if (blockId === BLOCK.AIR) return;

  const { x, y, z } = hit.placePos;

  const px = player.x;
  const py = player.y;
  const pz = player.z;

  if (
    Math.abs(x + 0.5 - px) < PLAYER.radius &&
    Math.abs(y + 0.5 - py) < PLAYER.height &&
    Math.abs(z + 0.5 - pz) < PLAYER.radius
  ) {
    return;
  }

  setBlock(x, y, z, blockId);
  rebuildChunkAt(x, z);

  consumeHotbar(selectedHotbarIndex);

  updateHotbarUI();
  refreshInventoryUI();
}

/* ===== UI HOTBAR & INFO ===== */

function updateHotbarUI() {
  hotbarEl.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const slot = INVENTORY.slots[i];
    const def = BLOCK_DEFS[slot.id];

    const slotEl = document.createElement("div");
    slotEl.className = "hotbar-slot";
    if (i === selectedHotbarIndex) slotEl.classList.add("selected");

    if (slot.id !== BLOCK.AIR && slot.count > 0) {
      slotEl.textContent = def.name[0];
      if (slot.count > 1) {
        const count = document.createElement("span");
        count.className = "slot-count";
        count.textContent = slot.count;
        slotEl.appendChild(count);
      }
    } else {
      slotEl.textContent = "";
    }

    hotbarEl.appendChild(slotEl);
  }
}

function updateInfoUI() {
  biomeLabelEl.textContent = "Biome: " + currentBiomeLabel;
  posLabelEl.textContent =
    "X: " + player.x.toFixed(1) +
    " Y: " + player.y.toFixed(1) +
    " Z: " + player.z.toFixed(1);
}

/* ===== SCÈNE & GAME LOOP ===== */

function initScene() {
  canvas = document.getElementById("game-canvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(player.x, player.y + PLAYER.eyeHeight, player.z);

  controls = new THREE.PointerLockControls(camera, document.body);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
  hemi.position.set(0, 100, 0);
  scene.add(hemi);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(50, 100, 50);
  dirLight.castShadow = true;
  scene.add(dirLight);

  clock = new THREE.Clock();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function updateBiomeLabel() {
  const nx = player.x / 256;
  const nz = player.z / 256;
  const hBase = heightNoise.noise(nx * 1.5, nz * 1.5);
  const hDetail = heightNoise.noise(nx * 4.0, nz * 4.0) * 0.25;
  const heightNorm = Math.min(1, Math.max(0, hBase * 0.7 + hDetail * 0.3));
  const temp = tempNoise.noise(nx * 0.8, nz * 0.8);
  const humid = humidNoise.noise(nx * 0.8, nz * 0.8);
  currentBiomeLabel = getBiomeAt(temp, humid, heightNorm);
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  const delta = clock.getDelta();

  if (pointerLocked && !INVENTORY.open) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    let dirVec = {
      forward: new THREE.Vector3(0, 0, 0),
      right: new THREE.Vector3(0, 0, 0),
      move: 0,
      jump: false
    };

    let moveX = 0;
    let moveZ = 0;

    if (keys["KeyW"]) moveZ += 1;
    if (keys["KeyS"]) moveZ -= 1;
    if (keys["KeyA"]) moveX -= 1;
    if (keys["KeyD"]) moveX += 1;

    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
      dirVec.forward.copy(forward).multiplyScalar(moveZ);
      dirVec.right.copy(right).multiplyScalar(moveX);
      dirVec.move = 1;
    }

    dirVec.jump = !!keys["Space"];

    movePlayer(delta, dirVec);
    camera.position.set(player.x, player.y + PLAYER.eyeHeight, player.z);
  }

  updateVisibleChunks();
  updateBiomeLabel();
  updateInfoUI();

  renderer.render(scene, camera);
}

/* ===== UI INIT & MAIN ===== */

function initUI() {
  hotbarEl = document.getElementById("hotbar");
  biomeLabelEl = document.getElementById("biome-label");
  posLabelEl = document.getElementById("pos-label");
  hintEl = document.getElementById("hint");

  updateHotbarUI();
}

function main() {
  initWorld();
  spawnPlayer();

  initInventory();
  initScene();
  initUI();
  initInventoryUI();
  initControls();

  updateVisibleChunks();
  gameLoop();
}

document.addEventListener("DOMContentLoaded", main);

