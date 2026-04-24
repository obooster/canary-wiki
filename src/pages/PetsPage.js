import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Search, Heart, X, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { RARITY_COLORS, SKILL_LABELS, ATTR_LABELS, getHead } from '../utils/Minecraft';

const API = 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/pets.json';

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

function PetAvatar({ pet }) {
  const headUrl = getHead(pet.texture);
  const [imgErr, setImgErr] = useState(false);

  if (headUrl && !imgErr) {
    return (
      <img
        src={headUrl}
        alt={pet.name}
        onError={() => setImgErr(true)}
        className="w-12 h-12 object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    );
  }

  return (
    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-[#252525] border border-[#333]">
      {pet.name === 'Abelha' ? '🐝' :
       pet.name === 'Lobo' ? '🐺' :
       pet.name === 'Gato' ? '🐱' :
       pet.name === 'Enderman' ? '🟣' :
       pet.name === 'Dragão' ? '🐉' : '🐾'}
    </div>
  );
}

function PetCard({pet}) {
  const [selectedRarity, setSelectedRarity] = useState(
    pet.rarities?.includes('LEGENDARY') ? 'LEGENDARY' : pet.rarities?.[0] || 'COMMON'
  );

  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  const skill = SKILL_LABELS[pet.skill] || { label: pet.skill, color: '#AAAAAA' };
  const rarityData = pet.attributes?.[selectedRarity];
  const rc = RARITY_COLORS[selectedRarity] || RARITY_COLORS.COMMON;

  const xpEntries = Object.entries({
    ...pet.levelableBlocks,
    ...pet.levelableEntities
  });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (expanded) {
      setHeight(el.scrollHeight);
    } else {
      const full = el.scrollHeight;
      setHeight(full);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
        });
      });
    }
  }, [expanded]);

  return (
    <div className="bg-[#1E1E1E] border border-[#333] hover:border-[#FF55FF33] transition-colors flex flex-col h-full">
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3">
          <div className="relative">
            <PetAvatar pet={pet} />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full" style={{ background: rc.hex }} />
          </div>

          <div className="flex-1">
            <p className="font-pixel text-sm" style={{ color: rc.hex }}>
              {pet.name}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] px-1.5 py-0.5"
                style={{ color: skill.color, background: `${skill.color}18` }}
              >
                {skill.label}
              </span>
            </div>

            <div className="flex gap-1 mt-2">
              {pet.rarities?.map(r => {
                const c = RARITY_COLORS[r]?.hex;

                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRarity(r)}
                    className="w-3.5 h-3.5"
                    style={{
                      background: c,
                      outline: selectedRarity === r ? `2px solid ${c}` : 'none',
                      opacity: selectedRarity === r ? 1 : 0.35
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* STATS */}
        {rarityData && (
          <div className="mt-3 space-y-1 flex-1">
            {Object.entries(rarityData.levelableAttributes || {}).map(([attr, perLevel]) => {
              const a = ATTR_LABELS[attr];

              return (
                <div key={attr} className="flex justify-between text-xs py-0.5 border-b border-[#2A2A2A]">
                  <span className="text-[#AAAAAA]">{a ? a.label : attr}</span>
                  <span style={{ color: a?.color || '#55FF55' }}>
                    +{perLevel}/nv
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* XP */}
      {xpEntries.length > 0 && (
        <div className="border-t border-[#2A2A2A] mt-auto pb-2">
          
          <button
            className="w-full px-4 pt-2 flex justify-between items-center"
            onClick={() => setExpanded(prev => !prev)}
          >
            <span className="text-[#777] text-xs uppercase">
              Fontes de XP
            </span>

            {expanded
              ? <X size={10} className="text-[#555]" />
              : <Star size={10} className="text-[#555]" />
            }
          </button>

          <div
            style={{ height }}
            className="overflow-hidden transition-all duration-300 ease-out"
          >
            <div ref={contentRef} className="px-4 pb-3">

              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pr-1">
                {xpEntries.map(([src, xp]) => (
                  <div key={src} className="flex justify-between text-xs py-0.5">
                    <span className="text-[#777]">{src}</span>
                    <span className="text-[#FFAA00]">{xp}x XP</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function PetsPage() {
  const [pets, setPets] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(r => setPets(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const skills = useMemo(
    () => [...new Set(Object.values(pets).map(p => p.skill))],
    [pets]
  );

  const filtered = useMemo(() => {
    return Object.entries(pets).filter(([, pet]) => {
      const matchSearch =
        !search || pet.name?.toLowerCase().includes(search.toLowerCase());
      const matchSkill =
        !skillFilter || pet.skill === skillFilter;
      const matchRarity =
        !rarityFilter || (pet.rarities || []).includes(rarityFilter);

      return matchSearch && matchSkill && matchRarity;
    });
  }, [pets, search, skillFilter, rarityFilter]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        <div className="mb-6">
          <h1 className="font-pixel text-2xl md:text-3xl text-[#FF55FF] mb-1">
            Pets
          </h1>
          <p className="text-[#777] text-sm">
            Companions do SkyBlock com habilidades e atributos
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-[#777]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar pet..."
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
            {skills.map(s => (
              <option key={s} value={s}>
                {SKILL_LABELS[s]?.label || s}
              </option>
            ))}
          </select>

          <select
            value={rarityFilter}
            onChange={e => setRarityFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA]"
          >
            <option value="">Todas as raridades</option>
            {RARITIES.map(r => (
              <option key={r} value={r}>
                {RARITY_COLORS[r]?.label || r}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[#777] text-xs mb-4">
          {filtered.length} pet{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-[#1E1E1E] border border-[#333] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
            {filtered.map(([key, pet]) => (
              <PetCard key={key} petKey={key} pet={pet} />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-[#555]">
                <Heart size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum pet encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}