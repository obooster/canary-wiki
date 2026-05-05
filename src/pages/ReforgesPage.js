import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Layout from '../components/Layout';
import { RARITY_COLORS, rarities as RARITIES } from '../utils/Minecraft';
import { useGameData } from '../hooks/useGameData';
import { useDebounce } from '../hooks/useDebounce';

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
  HAT: 'Chapéu',
  HELMET: 'Capacete',
  CHESTPLATE: 'Peitoral',
  LEGGINGS: 'Calças',
  BOOTS: 'Botas'
};

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
  HASTE: 'Pressa',
  MINING_FORTUNE: 'Fortuna'
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
  const name = refData.name || refKey;
  const categories = refData.categories || [];

  const statsByRarity = refData.stats || {};
  const obtainable = refData.obtainable;

  const availableRarities = RARITIES.filter(r => statsByRarity[r]);
  const [rarity, setRarity] = useState(availableRarities[0] || null);

  const stats = rarity ? statsByRarity[rarity] || {} : {};
  const color = rarity ? (RARITY_COLORS[rarity]?.hex || '#333') : '#333';

  return (
      <div
          className="bg-[#1E1E1E] border transition-all rounded-md duration-200"
          style={{
            borderColor: `${color}55`,
            boxShadow: `0 0 0 1px ${color}33`,
            opacity: obtainable ? 1 : 0.6
          }}
      >
        <div
            className="px-4 py-3 border-b border-[#2A2A2A] rounded-md flex justify-between items-center"
            style={{ borderTop: `2px solid ${color}` }}
        >
          <div>
            <p className="text-white text-sm font-medium">{name}</p>

            {/* categorias */}
            <div className="flex flex-wrap gap-1 mt-1">
              {categories.map(cat => (
                  <span
                      key={cat}
                      className="text-[10px] px-1.5 py-[1px] bg-[#2A2A2A]"
                  >
                {CATEGORY_LABELS[cat] || cat}
              </span>
              ))}
            </div>

            {/* obtainable */}
            {!obtainable && (
                <p className="text-[10px] text-[#FF5555] mt-1">
                  Não obtível
                </p>
            )}
          </div>

          <div className="flex gap-1">
            {availableRarities.map(r => {
              const c = RARITY_COLORS[r];
              return (
                  <button
                      key={r}
                      onClick={() => setRarity(r)}
                      className="w-4 h-4 rounded-xl transition-all"
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
          {rarity && Object.keys(stats).length > 0 ? (
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

export default function ReforgePage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';

  const { data: reforges } = useGameData('reforges');
  const [search, setSearch] = useState(qParam);
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const ITEMS_PER_PAGE = 24;

  const categories = useMemo(() => {
    if (!reforges) return [];
    const set = new Set();

    Object.values(reforges).forEach(r => {
      (r.categories || []).forEach(cat => set.add(cat));
    });

    return [...set];
  }, [reforges]);

  const filtered = useMemo(() => {
    if (!reforges) return [];
    return Object.entries(reforges)
        .filter(([, data]) => {
          const name = data.name || '';
          const categories = data.categories || [];

          return (
              (!search || name.toLowerCase().includes(search.toLowerCase())) &&
              (!catFilter || categories.includes(catFilter))
          );
        })
        .sort(([, a], [, b]) => {
          // obtainable primeiro
          if (a.obtainable !== b.obtainable) {
            return a.obtainable ? -1 : 1;
          }

          // opcional: ordenar por nome dentro do grupo
          return (a.name || '').localeCompare(b.name || '');
        });
  }, [reforges, debouncedSearch, catFilter]);

  const paginatedItems = useMemo(() => {
    if (!filtered.length) return [];
    const start = page * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, catFilter]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-2xl text-[#FF5555] font-pixel mb-4">Reforjas</h1>

        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-md border border-[#333] px-3 py-2 flex-1">
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
            className="bg-[#1E1E1E] border border-[#333] rounded-md px-3 py-2 text-sm"
          >
            <option value="">Todas categorias</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] || c}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[#777] text-xs mb-4">
          {filtered.length} reforj{filtered.length !== 1 ? 'as' : 'a'} encontrada{filtered.length !== 1 ? 's' : ''}
        </p>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paginatedItems.map(([k, v]) => (
            <ReforgeCard key={k} refKey={k} refData={v} />
          ))}
        </div>

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 bg-[#1E1E1E] border border-[#333] rounded-md text-[#AAA] text-sm disabled:opacity-30 hover:border-[#555]"
            >
              Anterior
            </button>
            <span className="text-[#777] text-sm">
              {page * ITEMS_PER_PAGE + 1}-{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * ITEMS_PER_PAGE >= filtered.length}
              className="px-3 py-1 bg-[#1E1E1E] border border-[#333] rounded-md text-[#AAA] text-sm disabled:opacity-30 hover:border-[#555]"
            >
              Proximo
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
}