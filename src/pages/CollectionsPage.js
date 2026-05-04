import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';
import { parseMcText, SKILL_LABELS } from '../utils/Minecraft';
import { getTexture } from '../utils/Texture-Finder';
import { useGameData } from '../hooks/useGameData';
import { useDebounce } from '../hooks/useDebounce';

function McLine({ text }) {
  const parts = parseMcText(text);
  return (
    <span>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.color, fontWeight: p.bold ? 'bold' : 'normal' }}>
          {p.text}
        </span>
      ))}
    </span>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 bg-[#333] flex-1">
      <div
        className="h-full bg-[#FFAA00] transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ItemIcon({ itemId, metadata = 0 }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!itemId) return;
    const result = getTexture(itemId, metadata);
    if (result.success) {
      setImgSrc(result.url);
      setError(false);
    } else {
      setError(true);
    }
  }, [itemId, metadata]);

  if (error || !itemId) {
    return (
      <div className="w-8 h-8 bg-[#25FF25] border border-[#333] overflow-hidden flex items-center justify-center text-2lg">
        ����
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={itemId}
      className="w-8 h-8 object-cover [image-rendering:pixelated]"
      onError={() => setError(true)}
    />
  );
}

function CollectionCard({col}) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  const skill = SKILL_LABELS[col.skillType] || { label: col.skillType, color: '#AAAAAA' };

  useEffect(() => {
    if (expanded) {
      const el = contentRef.current;
      setHeight(el.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <div className="bg-[#1E1E1E] border border-[#333] hover:border-[#55FF5533] transition-colors">
      
      {/* HEADER */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(prev => !prev)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#252525] border border-[#333] text-lg">
            <ItemIcon itemId={col.material} />
          </div>

          <div>
            <p className="text-white font-medium text-sm">{col.name}</p>

            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10px] px-1.5 py-0.5"
                style={{ color: skill.color, background: `${skill.color}18` }}
              >
                {skill.label}
              </span>

              <span className="text-[#777] text-[10px]">
                {col.maxLevel} níveis
              </span>
            </div>
          </div>
        </div>

        {expanded
          ? <ChevronUp size={14} className="text-[#777]" />
          : <ChevronDown size={14} className="text-[#777]" />
        }
      </button>

      {/* CONTAINER ANIMADO */}
      <div
        style={{ height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-4 pb-4 border-t border-[#2A2A2A]">

          <p className="text-[#777] text-xs uppercase tracking-wider mt-3 mb-3">
            Progressão de Níveis
          </p>

          <div className="space-y-2">
            {Array.from({ length: col.maxLevel }, (_, i) => i + 1).map(lvl => {
              const req = col.requirements?.[lvl - 1] || 0;
              const rewards = col.rewards?.[lvl.toString()] || [];

              return (
                <div key={lvl} className="border border-[#2A2A2A] p-3">

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[#FFAA00] text-xs">
                        Nv. {lvl}
                      </span>
                      <ProgressBar value={lvl} max={col.maxLevel} />
                    </div>

                    <span className="text-[#AAAAAA] text-xs">
                      {req.toLocaleString()} itens
                    </span>
                  </div>

                  {rewards.length > 0 ? (
                    <div className="space-y-0.5">
                      {rewards.map((r, i) => (
                        <p key={i} className="text-xs">
                          <McLine text={r} />
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#555] text-xs">
                      Sem recompensas neste nível
                    </p>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';

  const { data: collections, loading } = useGameData('collections');
  const [search, setSearch] = useState(qParam);
  const [skillFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const skillTypes = useMemo(() => {
    if (!collections) return [];
    return [...new Set(Object.values(collections).map(c => c.skillType))];
  }, [collections]);

  const filtered = useMemo(() => {
    if (!collections) return [];
    return Object.entries(collections).filter(([, col]) => {
      const matchSearch = !debouncedSearch || col.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchSkill = !skillFilter || col.skillType === skillFilter;
      return matchSearch && matchSkill;
    });
  }, [collections, debouncedSearch, skillFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(([key, col]) => {
      const sk = col.skillType || 'OTHER';
      if (!groups[sk]) groups[sk] = [];
      groups[sk].push([key, col]);
    });
    return groups;
  }, [filtered]);

  const visibleSkills = useMemo(() => {
    if (!activeCategory) return skillTypes;
    return skillTypes.filter(s => s === activeCategory);
  }, [activeCategory, skillTypes]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="font-pixel text-2xl md:text-3xl text-[#55FF55] mb-1">
            Coleções
          </h1>
          <p className="text-[#777] text-sm">
            Coleções por habilidade com recompensas
          </p>
        </div>

        {/* BOTOES DE CATEGORIA */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-sm border transition-colors ${
              !activeCategory
                ? 'bg-[#55FF55] border-[#55FF55] text-[#1E1E1E]'
                : 'bg-[#1E1E1E] border-[#333] text-[#AAA] hover:border-[#55FF55]'
            }`}
          >
            Todas
          </button>
          {skillTypes.map(s => {
            const sk = SKILL_LABELS[s] || { label: s, color: '#AAA' };
            return (
              <button
                key={s}
                onClick={() => setActiveCategory(activeCategory === s ? null : s)}
                className={`px-3 py-1.5 text-sm border transition-colors ${
                  activeCategory === s
                    ? 'bg-[#55FF55] border-[#55FF55] text-[#1E1E1E]'
                    : 'bg-[#1E1E1E] border-[#333] text-[#AAA] hover:border-[#55FF55]'
                }`}
                style={activeCategory !== s ? { borderColor: sk.color + '44' } : {}}
              >
                {sk.label}
              </button>
            );
          })}
        </div>

        {/* BUSCA */}
        <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 mb-6">
          <Search size={14} className="text-[#777]" />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar coleção..."
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#555]"
          />

          {search && (
            <button onClick={() => setSearch('')}>
              <X size={12} className="text-[#777]" />
            </button>
          )}
        </div>

        {/* LISTA */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[#1E1E1E] border border-[#333] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">

            {visibleSkills.map(skill => {
              const cols = grouped[skill] || [];
              if (cols.length === 0) return null;
              const sk = SKILL_LABELS[skill] || { label: skill, color: '#AAAAAA' };

              return (
                <div key={skill}>
                  <h2
                    className="font-pixel text-base mb-3 flex items-center gap-2"
                    style={{ color: sk.color }}
                  >
                    ▌ {sk.label}
                    <span className="text-[#555] text-xs">
                      ({cols.length})
                    </span>
                  </h2>

                  <div className="space-y-2">
                    {cols.map(([key, col]) => (
                      <CollectionCard key={key} colKey={key} col={col} />
                    ))}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#555]">
                <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhuma coleção encontrada</p>
              </div>
            )}

          </div>
        )}
      </div>
    </Layout>
  );
}