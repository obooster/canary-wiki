import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Skull, X, Shield, Swords, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import { stripMcCodes, parseMcText, formatNumber } from '../utils/Minecraft';
import { useGameData } from '../hooks/useGameData';
import { useDebounce } from '../hooks/useDebounce';

export const TYPE_ICONS = {
  ZOMBIE: '🧟',
  SPIDER: '🕷️',
  SKELETON: '💀',
  CREEPER: '💥',
  WITCH: '🧙',
  BLAZE: '🔥',
  ENDERMAN: '👁️',
  ENDER_DRAGON: '🐉',

  COW: '🐄',
  CAVE_SPIDER: '🕷️',
  SILVERFISH: '🪲',
  SLIME: '🟢',
  PIG_ZOMBIE: '👹',
  GUARDIAN: '🐟',
  GHAST: '👻',
  MAGMA_CUBE: '🟠',
  ENDER_CRYSTAL: '💎',
  ENDERMITE: '🪳',

  CHICKEN: '🐔',
  PIG: '🐷',
  SHEEP: '🐑',
  RABBIT: '🐰',
};

export const TYPE_LABELS = {
  ZOMBIE: 'Zumbi',
  SPIDER: 'Aranha',
  SKELETON: 'Esqueleto',
  CREEPER: 'Creeper',
  WITCH: 'Bruxa',
  BLAZE: 'Blaze',
  ENDERMAN: 'Enderman',
  ENDER_DRAGON: 'Dragão',

  COW: 'Vaca',
  CAVE_SPIDER: 'Aranha das Cavernas',
  SILVERFISH: 'Peixe-prata',
  SLIME: 'Slime',
  PIG_ZOMBIE: 'Porco Zumbi',
  GUARDIAN: 'Guardião',
  GHAST: 'Ghast',
  MAGMA_CUBE: 'Cubo de Magma',
  ENDER_CRYSTAL: 'Cristal do End',
  ENDERMITE: 'Endermite',

  CHICKEN: 'Galinha',
  PIG: 'Porco',
  SHEEP: 'Ovelha',
  RABBIT: 'Coelho',
};

function McName({ text }) {
  const parts = parseMcText(text);
  return (
    <span>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.color, fontWeight: p.bold ? 'bold' : 'normal' }}>{p.text}</span>
      ))}
    </span>
  );
}

function EntityCard({ entKey, entity }) {
  const icon = TYPE_ICONS[entity.type] || '👾';
  const isBoss = entity.attributes?.health >= 1000;

  return (
    <div
      data-testid={`entity-card-${entKey.toLowerCase()}`}
      className={`bg-[#1E1E1E] border transition-colors ${isBoss ? 'border-[#FF555533] hover:border-[#FF5555]' : 'border-[#333] hover:border-[#555]'}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`text-2xl w-10 h-10 flex items-center justify-center bg-[#252525] border ${isBoss ? 'border-[#FF5555]' : 'border-[#333]'}`}>
              {icon}
            </div>
            <div>
              <p className="font-medium text-sm">
                <McName text={entity.name} />
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#AAAAAA]">{TYPE_LABELS[entity.type] || entity.type}</span>
                <span className="text-[10px] text-[#FFAA00] font-pixel">Nv. {entity.level}</span>
                {isBoss && <span className="text-[10px] text-[#FF5555] bg-[#FF555518] px-1.5 py-0.5">BOSS</span>}
              </div>
            </div>
          </div>
          <span className="text-[#555] text-[10px] font-mono">#{entity.id}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center bg-[#252525] py-2">
            <Shield size={12} className="text-[#FF5555] mb-1" />
            <p className="text-[#FF5555] font-pixel text-xs">{formatNumber(entity.attributes?.health)}</p>
            <p className="text-[#555] text-[9px]">Vida</p>
          </div>
          <div className="flex flex-col items-center bg-[#252525] py-2">
            <Swords size={12} className="text-[#FF5555] mb-1" />
            <p className="text-[#FF5555] font-pixel text-xs">{entity.attributes?.damage}</p>
            <p className="text-[#555] text-[9px]">Dano</p>
          </div>
          <div className="flex flex-col items-center bg-[#252525] py-2">
            <Zap size={12} className="text-[#55FFFF] mb-1" />
            <p className="text-[#55FFFF] font-pixel text-xs">{entity.attributes?.speed}</p>
            <p className="text-[#555] text-[9px]">Veloc.</p>
          </div>
        </div>

        {/* Rewards */}
        <div className="space-y-1 border-t border-[#2A2A2A] pt-3">
          <p className="text-[#777] text-[10px] uppercase tracking-wider mb-1">Recompensas</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div>
              <span className="text-[#AAAAAA]">XP: </span>
              <span className="text-[#55FF55]">{entity.rewards?.exp}</span>
            </div>
            <div>
              <span className="text-[#AAAAAA]">XP Combate: </span>
              <span className="text-[#FFAA00]">{entity.rewards?.combatExp}</span>
            </div>
            <div>
              <span className="text-[#AAAAAA]">Moedas: </span>
              <span className="text-[#FFAA00]">{entity.rewards?.reward}</span>
            </div>
          </div>
        </div>

        {/* Drops */}
        {entity.drops?.length > 0 && (
          <div className="mt-3 border-t border-[#2A2A2A] pt-3">
            <p className="text-[#777] text-[10px] uppercase tracking-wider mb-2">Drops</p>
            <div className="space-y-1">
              {entity.drops.map((drop, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-[#AAAAAA]">{drop.item}</span>
                  <span className="text-[#FFAA00]">{(drop.chance * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EntitiesPage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';

  const { data: entities, loading } = useGameData('entities');
  const [search, setSearch] = useState(qParam);
  const [typeFilter, setTypeFilter] = useState('');
  const [bossOnly, setBossOnly] = useState(false);
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const ITEMS_PER_PAGE = 24;

  const types = useMemo(() => entities ? [...new Set(Object.values(entities).map(e => e.type))] : [], [entities]);

  const filtered = useMemo(() => {
    if (!entities) return [];
    return Object.entries(entities).filter(([, entity]) => {
      const name = stripMcCodes(entity.name);
      const matchSearch = !debouncedSearch || name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchType = !typeFilter || entity.type === typeFilter;
      const matchBoss = !bossOnly || entity.attributes?.health >= 1000;
      return matchSearch && matchType && matchBoss;
    }).sort((a, b) => a[1].level - b[1].level);
  }, [entities, debouncedSearch, typeFilter, bossOnly]);

  const paginatedItems = useMemo(() => {
    if (!filtered.length) return [];
    const start = page * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, typeFilter, bossOnly]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl md:text-3xl text-[#FF5555] mb-1">Entidades</h1>
          <p className="text-[#777] text-sm">Mobs, bosses e suas estatísticas de combate</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" data-testid="entity-filters">
          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-[#777]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar entidade..."
              className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#555]"
              data-testid="entity-search-input"
            />
            {search && <button onClick={() => setSearch('')}><X size={12} className="text-[#777]" /></button>}
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA] outline-none cursor-pointer hover:border-[#555]"
            data-testid="entity-filter-type"
          >
            <option value="">Todos os tipos</option>
            {types.map(t => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
          </select>

          <button
            onClick={() => setBossOnly(!bossOnly)}
            data-testid="entity-filter-boss"
            className={`px-3 py-2 text-sm border transition-colors ${bossOnly ? 'bg-[#FF5555] border-[#FF5555] text-black font-bold' : 'bg-[#1E1E1E] border-[#333] text-[#AAAAAA] hover:border-[#555]'}`}
          >
            Apenas Bosses
          </button>
        </div>

        <p className="text-[#777] text-xs mb-4" data-testid="entity-count">
          {filtered.length} entidade{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-[#1E1E1E] border border-[#333] animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-testid="entities-grid">
              {paginatedItems.map(([key, ent]) => <EntityCard key={key} entKey={key} entity={ent} />)}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-16 text-[#555]">
                  <Skull size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Nenhuma entidade encontrada</p>
                </div>
              )}
            </div>

            {filtered.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 bg-[#1E1E1E] border border-[#333] text-[#AAA] text-sm disabled:opacity-30 hover:border-[#555]"
                >
                  Anterior
                </button>
                <span className="text-[#777] text-sm">
                  {page * ITEMS_PER_PAGE + 1}-{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * ITEMS_PER_PAGE >= filtered.length}
                  className="px-3 py-1 bg-[#1E1E1E] border border-[#333] text-[#AAA] text-sm disabled:opacity-30 hover:border-[#555]"
                >
                  Proximo
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}