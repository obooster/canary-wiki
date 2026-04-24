import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import Layout from '../components/Layout';
import { RARITY_COLORS } from '../utils/Minecraft';

const API = `https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/reforges.json`;

const CATEGORY_LABELS = {
  SWORD: 'Espada',
  BOW: 'Arco',
  ARMOR: 'Armadura',
  PICKAXE: 'Picareta',
  ACCESSORY: 'Acessório',
  NECKLACE: 'Colar',
  CLOAK: 'Manto',
  BELT: 'Cinto',
  BRACELET: 'Bracelete',
  HOE: 'Enxada',
};

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

const ATTR_LABELS = {
  STRENGTH: 'Força',
  DAMAGE: 'Dano',
  DEFENSE: 'Defesa',
  MAX_HEALTH: 'Vida Máx.',
  SPEED: 'Velocidade',
  CRIT_CHANCE: 'Chance Crítica',
  CRIT_DAMAGE: 'Dano Crítico',
  MAX_INTELLIGENCE: 'Inteligência',
  MAGIC_DAMAGE: 'Dano mágico',
  BONUS_ATTACK_SPEED: 'Vel. Ataque',
  FARMING_FORTUNE: 'Fort. de Farm',
  HASTE: 'Pressa'
};

function formatStatValue(value) {
  const num = Number(value);
  if (isNaN(num)) return value;

  if (num > 0) return `+${num}`;
  return `${num}`;
}

function StatBadge({ stat, value }) {
  const num = Number(value);
  const isNegative = num < 0;

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[#AAAAAA] text-xs">
        {ATTR_LABELS[stat] || stat}
      </span>

      <span
        className="text-xs font-medium"
        style={{ color: isNegative ? '#FF5555' : '#55FF55' }}
      >
        {formatStatValue(value)}
      </span>
    </div>
  );
}

function ReforgeCard({ refKey, refData }) {
  const first = Object.values(refData)[0] || {};
  const name = first.name || refKey;
  const category = first.category || '';

  const availableRarities = RARITIES.filter(r => refData[r]);
  const [rarity, setRarity] = useState(availableRarities[0]);

  const current = refData[rarity] || {};
  const stats = current.stats || {};

  const color = RARITY_COLORS[rarity]?.hex || '#333';

  return (
    <div
      className="bg-[#1E1E1E] border transition-all duration-200"
      style={{
        borderColor: `${color}55`,
        boxShadow: `0 0 0 1px ${color}33`,
      }}
    >
      <div
        className="px-4 py-3 border-b border-[#2A2A2A] flex justify-between items-center"
        style={{
          borderTop: `2px solid ${color}`
        }}
      >
        <div>
          <p className="text-white text-sm font-medium">{name}</p>
          <span className="text-[10px] text-[#FF5555]">
            {CATEGORY_LABELS[category] || category}
          </span>
        </div>

        <div className="flex gap-1">
          {availableRarities.map(r => {
            const c = RARITY_COLORS[r];
            return (
              <button
                key={r}
                onClick={() => setRarity(r)}
                className="w-4 h-4 transition-all"
                style={{
                  background: c?.hex,
                  opacity: rarity === r ? 1 : 0.4,
                  transform: rarity === r ? 'scale(1.1)' : 'scale(1)',
                  outline: rarity === r ? `2px solid ${c?.hex}` : 'none'
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="px-4 py-3">
        {Object.keys(stats).length > 0 ? (
          Object.entries(stats).map(([k, v]) => (
            <StatBadge key={k} stat={k} value={v} />
          ))
        ) : (
          <p className="text-[#555] text-xs">Sem bônus para essa raridade</p>
        )}
      </div>
    </div>
  );
}

export default function ReforjasPage() {
  const [reforges, setReforges] = useState({});
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(r => setReforges(r.data))
      .catch(console.error);
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    Object.values(reforges).forEach(r => {
      const first = Object.values(r)[0];
      if (first?.category) set.add(first.category);
    });
    return [...set];
  }, [reforges]);

  const filtered = useMemo(() => {
    return Object.entries(reforges).filter(([, data]) => {
      const first = Object.values(data)[0] || {};
      const name = first.name || '';
      const cat = first.category || '';

      return (
        (!search || name.toLowerCase().includes(search.toLowerCase())) &&
        (!catFilter || cat === catFilter)
      );
    });
  }, [reforges, search, catFilter]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-2xl text-[#FF5555] font-pixel mb-4">Reforjas</h1>

        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1">
            <Search size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar reforja..."
              className="bg-transparent outline-none text-sm flex-1"
            />
            {search && <button onClick={() => setSearch('')}><X size={12} /></button>}
          </div>

          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] px-3 py-2 text-sm"
          >
            <option value="">Todas categorias</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] || c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(([k, v]) => (
            <ReforgeCard key={k} refKey={k} refData={v} />
          ))}
        </div>

      </div>
    </Layout>
  );
}