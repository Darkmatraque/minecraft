const BIOME = {
  PLAINS: "Plaines",
  DESERT: "Désert",
  FOREST: "Forêt",
  MOUNTAINS: "Montagnes"
};

function getBiomeAt(temp, humid, heightNorm) {
  if (heightNorm > 0.7) return BIOME.MOUNTAINS;
  if (temp > 0.6 && humid < 0.3) return BIOME.DESERT;
  if (humid > 0.6) return BIOME.FOREST;
  return BIOME.PLAINS;
}
