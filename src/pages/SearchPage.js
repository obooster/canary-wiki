import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Sparkles, Hammer, BookOpen, Heart, Skull } from 'lucide-react';
import Layout from '../components/Layout';
import { RARITY_COLORS, stripMcCodes } from '../utils/Minecraft';
import { useSearchData } from '../hooks/useSearchData';

const CAT_CONFIG = {
  items:        { label: 'Itens',          icon: Package,  color: '#5555FF', path: '/items' },
  enchantments: { label: 'Encantamentos',  icon: Sparkles, color: '#AA00AA', path: '/enchantments' },
  reforges:     { label: 'Reforjas',       icon: Hammer,   color: '#FF5555', path: '/reforges' },
  collections:  { label: 'Coleções',       icon: BookOpen, color: '#55FF55', path: '/collections' },
  pets:         { label: 'Pets',           icon: Heart,    color: '#FF55FF', path: '/pets' },
  entities:     { label: 'Entidades',      icon: Skull,    color: '#FF5555', path: '/entities' },
};

function ResultCard({ result, searchQuery }) {
  const cat = CAT_CONFIG[result.category] || { label: result.category, color: '#AAAAAA', path: '/' };
  const Icon = cat.icon || Package;
  const rarity = result.item?.rarity;
  const rc = rarity ? RARITY_COLORS[rarity] : null;
  const targetPath = searchQuery ? `${cat.path}?q=${encodeURIComponent(searchQuery)}` : cat.path;

  return (
    <Link
      to={targetPath}
      data-testid={`search-result-${result.key.toLowerCase()}`}
      className="flex items-center gap-3 px-4 py-3 bg-[#1E1E1E] border border-[#333] hover:border-[#555] hover:bg-[#252525] transition-all"
    >
      <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${cat.color}18` }}>
        <Icon size={16} style={{ color: cat.color }} strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: rc?.hex || 'white' }}>
          {stripMcCodes(result.name)}
        </p>
        <p className="text-[#777] text-xs">{cat.label}</p>
      </div>

      {rarity && (
        <span
          className="text-[10px] px-1.5 py-0.5 flex-shrink-0"
          style={{ color: rc?.hex, background: rc?.border }}
        >
          {rc?.label || rarity}
        </span>
      )}
    </Link>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data: allData, loading } = useSearchData();
  const [results, setResults] = useState([]);
  const [inputVal, setInputVal] = useState(q);

  useEffect(() => {
    setInputVal(q);
  }, [q]);

  useEffect(() => {
    if (!inputVal.trim()) {
      setResults([]);
      return;
    }

    if (!allData.length) return;

    const filtered = allData.filter(item =>
      (item.name || "").toLowerCase().includes(inputVal.toLowerCase())
    );

    setResults(filtered);
  }, [inputVal, allData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl text-white mb-4">Busca</h1>

          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-[#1E1E1E] border-2 border-[#333] focus-within:border-[#FFAA00] transition-colors">
              <Search size={16} className="ml-4 text-[#777]" />
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Buscar em toda a wiki..."
                className="flex-1 bg-transparent text-white px-4 py-3 text-sm outline-none placeholder-[#555]"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#FFAA00] text-black px-5 py-3 font-pixel text-sm hover:bg-[#FFC800]"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {q && (
          <p className="text-[#777] text-sm mb-4">
            {loading ? 'Buscando...' : `${results.length} resultado(s) para "${q}"`}
          </p>
        )}

        {!loading && results.length === 0 && q && (
          <div className="text-center py-16 text-[#555]">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum resultado</p>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => {
            const cc = CAT_CONFIG[cat] || { label: cat, color: '#AAA' };

            return (
              <div key={cat}>
                <p className="font-pixel text-xs mb-2" style={{ color: cc.color }}>
                  {cc.label} ({items.length})
                </p>

<div className="space-y-2">
                    {items.map(r => (
                      <ResultCard key={`${r.category}-${r.key}`} result={r} searchQuery={q} />
                    ))}
                  </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}