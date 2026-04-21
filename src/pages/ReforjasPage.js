import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Hammer, X } from 'lucide-react';
import Layout from '../components/Layout';

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

const ATTR_LABELS = {
  STRENGTH: 'Força',
  DAMAGE: 'Dano',
  DEFENSE: 'Defesa',
  MAX_HEALTH: 'Vida Máx.',
  SPEED: 'Velocidade',
  CRIT_CHANCE: 'Chance Crítica',
  CRIT_DAMAGE: 'Dano Crítico',
  MAX_INTELLIGENCE: 'Int. Máxima',
  INTELLIGENCE: 'Inteligência',
  BONUS_ATTACK_SPEED: 'Vel. Ataque',
  MAGIC_DAMAGE: 'Dano Mágico',
  FARMING_FORTUNE: 'Fort. de Farm',
  HASTE: 'Pressa'
};

function StatBadge({ stat, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[#AAAAAA] text-xs">{ATTR_LABELS[stat] || stat}</span>
      <span className="text-[#55FF55] text-xs font-medium">+{value}</span>
    </div>
  );
}

function ReforgeCard({ refKey, refData }) {
  const firstEntry = Object.values(refData)[0] || {};
  const category = firstEntry.category || '';
  const name = firstEntry.name || refKey;

  const data = firstEntry.stats || {};

  return (
    <div
      data-testid={`reforge-card-${refKey.toLowerCase()}`}
      className="bg-[#1E1E1E] border border-[#333] hover:border-[#FF555533] transition-colors"
    >
      <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hammer size={16} className="text-[#FF5555]" strokeWidth={2.5} />
          <div>
            <p className="text-white font-medium text-sm">{name}</p>
            <span className="text-[10px] text-[#FF5555] bg-[#FF555518] px-1.5 py-0.5">
              {CATEGORY_LABELS[category] || category}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {data && Object.keys(data).length > 0 ? (
          Object.entries(data).map(([stat, val]) => (
            <StatBadge key={stat} stat={stat} value={val} />
          ))
        ) : (
          <p className="text-[#555] text-xs">Sem bônus disponível</p>
        )}
      </div>
    </div>
  );
}

export default function ReforjasPage() {
  const [reforges, setReforges] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(r => setReforges(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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
    return Object.entries(reforges).filter(([, refData]) => {
      const first = Object.values(refData)[0] || {};
      const name = first.name || '';
      const cat = first.category || '';

      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || cat === catFilter;

      return matchSearch && matchCat;
    });
  }, [reforges, search, catFilter]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl md:text-3xl text-[#FF5555] mb-1">
            Reforjas
          </h1>
          <p className="text-[#777] text-sm">
            Bônus de status por tipo de reforja
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-[#777]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar reforja..."
              className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#555]"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={12} className="text-[#777]" />
              </button>
            )}
          </div>

          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA] outline-none cursor-pointer"
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] || c}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[#777] text-xs mb-4">
          {filtered.length} reforja{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-[#1E1E1E] border border-[#333] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(([key, data]) => (
              <ReforgeCard key={key} refKey={key} refData={data} />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-16 text-[#555]">
                <Hammer size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhuma reforja encontrada</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}