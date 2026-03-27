class SimplexLike {
  constructor(seed = 1) {
    this.seed = seed;
  }
  noise(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7 + this.seed * 101.3) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  }
}

const heightNoise = new SimplexLike(1);
const tempNoise   = new SimplexLike(2);
const humidNoise  = new SimplexLike(3);
