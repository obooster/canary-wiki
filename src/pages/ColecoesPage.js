import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';
import { parseMcText, SKILL_LABELS } from '../utils/minecraft';

const DATA_URL = "https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/collections.json";

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

function ItemIcon() {
  return (
    <div className="w-8 h-8 flex items-center justify-center bg-[#252525] border border-[#333] overflow-hidden">
      <span className="text-lg">📦</span>
    </div>
  );
}

function CollectionCard({ colKey, col }) {
  const [expanded, setExpanded] = useState(false);
  const skill = SKILL_LABELS[col.skillType] || { label: col.skillType, color: '#AAAAAA' };

  return (
    <div className="bg-[#1E1E1E] border border-[#333] hover:border-[#55FF5533] transition-colors">
      
      {/* HEADER */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#252525] border border-[#333] text-lg">
            <ItemIcon />
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

      {/* CONTENT */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">

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
      )}
    </div>
  );
}

export default function ColecoesPage() {
  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then(data => setCollections(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const skillTypes = useMemo(() => {
    return [...new Set(Object.values(collections).map(c => c.skillType))];
  }, [collections]);

  const filtered = useMemo(() => {
    return Object.entries(collections).filter(([, col]) => {
      const matchSearch = !search || col.name?.toLowerCase().includes(search.toLowerCase());
      const matchSkill = !skillFilter || col.skillType === skillFilter;
      return matchSearch && matchSkill;
    });
  }, [collections, search, skillFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(([key, col]) => {
      const sk = col.skillType || 'OTHER';
      if (!groups[sk]) groups[sk] = [];
      groups[sk].push([key, col]);
    });
    return groups;
  }, [filtered]);

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

        {/* FILTROS */}
        <div className="flex flex-wrap gap-3 mb-6">

          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1 min-w-48">
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

          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA]"
          >
            <option value="">Todas as habilidades</option>
            {skillTypes.map(s => (
              <option key={s} value={s}>
                {SKILL_LABELS[s]?.label || s}
              </option>
            ))}
          </select>

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

            {Object.entries(grouped).map(([skill, cols]) => {
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