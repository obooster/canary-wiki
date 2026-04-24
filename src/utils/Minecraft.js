export const ATTR_LABELS = {
  DAMAGE: { label: 'Dano', color: '#FF5555' },
  DEFENSE: { label: 'Defesa', color: '#55FFFF' },
  MAX_HEALTH: { label: 'Vida', color: '#FF5555' },
  SPEED: { label: 'Velocidade', color: '#55FFFF' },
  CRIT_CHANCE: { label: 'Crit Chance', color: '#FFAA00' },
  CRIT_DAMAGE: { label: 'Crit Damage', color: '#FFAA00' },
  FARMING_FORTUNE: { label: 'Fort. de Farm', color: '#FFAA00' },
  HEALTH_REGEN: { label: 'Regeneração de Vida', color: '#FF5555' },
  STRENGTH: { label: 'Força', color: '#FF5555' },
  MAX_INTELLIGENCE: { label: 'Inteligência Máxima', color: '#55FFFF' },
  HASTE: { label: 'Pressa', color: '#55FFFF' },
  BONUS_ATTACK_SPEED: { label: 'Vel. Ataque', color: '#3cff46' }
};

export const SKILL_LABELS = {
  COMBAT_SKILL: { label: 'Combate', color: '#FF5555' },
  FARMING_SKILL: { label: 'Agricultura', color: '#55FF55' },
  MINING_SKILL: { label: 'Mineração', color: '#AAAAAA' },
  FORAGING_SKILL: { label: 'Lenha', color: '#FFAA00' },
};

export const RARITY_COLORS = {
  COMMON: { hex: '#AAAAAA', label: 'Comum', border: '#AAAAAA22' },
  UNCOMMON: { hex: '#55FF55', label: 'Incomum', border: '#55FF5522' },
  RARE: { hex: '#5555FF', label: 'Raro', border: '#5555FF22' },
  EPIC: { hex: '#AA00AA', label: 'Épico', border: '#AA00AA22' },
  LEGENDARY: { hex: '#FFAA00', label: 'Lendário', border: '#FFAA0022' },
  SPECIAL: { hex: '#ff322e', label: 'Especial', border: '#ff322e22' },
};

export const RARITY_ORDER = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5,
  SPECIAL: 6
};

export const rarities = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'SPECIAL'];

export function stripMcCodes(text = '') {
  return text.replace(/§./g, '');
}

export function parseMcText(text = '') {
  return [{ text: stripMcCodes(text), color: '#FFFFFF' }];
}

export function formatNumber(n) {
  return Number(n || 0).toLocaleString();
}

export function getHead(textureBase64) {
  try {
    const json = JSON.parse(atob(textureBase64));
    const url = json.textures?.SKIN?.url;
    if (!url) return null;

    const hash = url.split('/').pop();
    return `https://mc-heads.net/head/${hash}`;
  } catch {
    return null;
  }
}