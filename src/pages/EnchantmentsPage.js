import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';
import { parseMcText } from '../utils/Minecraft';
import { useGameData } from '../hooks/useGameData';
import { useDebounce } from '../hooks/useDebounce';

const TARGET_LABELS = {
  SWORD: 'Espada', BOW: 'Arco', PICKAXE: 'Picareta', AXE: 'Machado',
  HELMET: 'Capacete', CHESTPLATE: 'Peitoral', LEGGINGS: 'Calças', BOOTS: 'Botas',
  ARMOR: 'Armadura', WAND: 'Varinha', FISHING_ROD: 'Vara de Pesca', HOE: 'Enxada',
  SHOVEL: 'Pá', HAT: 'Chapéu', SHEAR: 'Tesoura'
};

function McTextSpan({ text }) {
  const parts = parseMcText(text);
  return (
    <span>
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            color: p.color,
            fontWeight: p.bold ? 'bold' : 'normal',
            fontStyle: p.italic ? 'italic' : 'normal'
          }}
        >
          {p.text}
        </span>
      ))}
    </span>
  );
}

const EnchantCard = memo(function EnchantCard({ench, enchs}) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  const extra = ench.extra || {};
  const descriptions = extra.descriptions || {};
  const expCosts = extra.expCosts || {};
  const sellPrices = extra.sellPrices || {};
  const targets = extra.targets || [];
  const conflicts = extra.conflicts || []

  useEffect(() => {
    if (expanded) {
      const el = contentRef.current;
      setHeight(el.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <div className="bg-[#1E1E1E] border border-[#333] rounded-md hover:border-[#AA00AA55] transition-colors">

      {/* HEADER */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(prev => !prev)}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={16} className="text-[#AA00AA]" />
          <div>
            <p className="text-white font-medium text-sm">{ench.name}</p>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[#AA00AA] bg-[#AA00AA18] px-1.5 py-0.5">
                Nv. Máx: {ench.maxLevel}
              </span>

              {targets.slice(0, 3).map(t => (
                <span key={t} className="text-[10px] text-[#5555FF] bg-[#5555FF18] px-1.5 py-0.5">
                  {TARGET_LABELS[t] || t}
                </span>
              ))}
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
        className="overflow-hidden transition-all duration-300 ease-out"
      >
        <div ref={contentRef} className="px-4 pb-4 border-t border-[#2A2A2A] space-y-4">

          {/* DESCRIÇÕES */}
          {Object.keys(descriptions).length > 0 && (
            <div>
              <p className="text-[#777] text-xs uppercase tracking-wider mt-3 mb-2">
                Efeitos por Nível
              </p>

              <div className="space-y-1">
                {Object.entries(descriptions).map(([lvl, descs]) => (
                  <div key={lvl} className="flex gap-2 py-1 border-b border-[#2A2A2A]">
                    <span className="text-[#FFAA00] font-pixel text-xs w-4">
                      {lvl}
                    </span>

                    <div className="text-xs">
                      {descs.map((d, i) => (
                        <p key={i}><McTextSpan text={d} /></p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* XP */}
          {Object.keys(expCosts).length > 0 && (
            <div>
              <p className="text-[#777] text-xs uppercase tracking-wider mb-2">
                Custo em XP
              </p>

              <div className="flex flex-wrap gap-2">
                {Object.entries(expCosts).map(([lvl, cost]) => (
                  <div key={lvl} className="text-center bg-[#252525] px-2 py-1">
                    <p className="text-[#FFAA00] font-pixel text-xs">Nv.{lvl}</p>
                    <p className="text-[#55FF55] text-xs">{cost} XP</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREÇO */}
          {Object.keys(sellPrices).length > 0 && (
            <div>
              <p className="text-[#777] text-xs uppercase tracking-wider mb-2">
                Preço de Venda
              </p>

              <div className="flex flex-wrap gap-2">
                {Object.entries(sellPrices).map(([lvl, price]) => (
                  <div key={lvl} className="text-center bg-[#252525] px-2 py-1">
                    <p className="text-[#FFAA00] font-pixel text-xs">Nv.{lvl}</p>
                    <p className="text-[#FFAA00] text-xs">{price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TARGETS + CONFLICTS */}
          <div>
            <p className="text-[#777] text-xs uppercase tracking-wider mb-2">
              Aplicável em
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {targets.map(t => (
                  <span key={t} className="text-xs text-[#5555FF] bg-[#5555FF18] border border-[#5555FF33] px-2 py-0.5 mb-2">
                    {TARGET_LABELS[t] || t}
                  </span>
              ))}
            </div>

            {conflicts.length > 0 && (
                <>
                  <p className="text-[#777] text-xs uppercase tracking-wider mb-2">
                    Conflitos
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {conflicts.map(c => (
                        <span key={c} className="text-xs text-[#FF5555] bg-[#FF555518] border border-[#FF555533] px-2 py-0.5">
                            {enchs[c].name || c}
                        </span>
                    ))}
                  </div>
                </>
            )}
          </div>

          {!ench.allowedInEnchantTable && (
            <p className="text-[#FF5555] text-xs flex items-center gap-1">
              <X size={11} /> Não disponível na mesa de encantamentos
            </p>
          )}

        </div>
      </div>
    </div>
  );
});

export default function EnchantmentsPage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';

  const { data: enchants, loading } = useGameData('enchantments');
  const [search, setSearch] = useState(qParam);
  const [targetFilter, setTargetFilter] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const ITEMS_PER_PAGE = 24;

  const allTargets = useMemo(() => {
    if (!enchants) return [];
    const set = new Set();
    Object.values(enchants).forEach(e =>
      (e.extra?.targets || []).forEach(t => set.add(t))
    );
    return [...set].sort();
  }, [enchants]);

  const filtered = useMemo(() => {
    if (!enchants) return [];
    return Object.entries(enchants).filter(([, e]) => {
      const matchSearch = !debouncedSearch || e.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchTarget = !targetFilter || (e.extra?.targets || []).includes(targetFilter);
      return matchSearch && matchTarget;
    });
  }, [enchants, debouncedSearch, targetFilter]);

  const paginatedItems = useMemo(() => {
    if (!filtered.length) return [];
    const start = page * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, targetFilter]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl md:text-3xl text-[#AA00AA] mb-1">
            Encantamentos
          </h1>
          <p className="text-[#777] text-sm">
            Todos os encantamentos customizados do servidor
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-md border border-[#333] px-3 py-2 flex-1">
            <Search size={14} className="text-[#777]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-white text-sm outline-none flex-1"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={12} className="text-[#777]" />
              </button>
            )}
          </div>

          <select
            value={targetFilter}
            onChange={e => setTargetFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] rounded-md text-sm px-3 py-2 text-[#AAAAAA]"
          >
            <option value="">Todos</option>
            {allTargets.map(t => (
              <option key={t} value={t}>{TARGET_LABELS[t] || t}</option>
            ))}
          </select>
        </div>

        <p className="text-[#777] text-xs mb-4">
          {filtered.length} encantamento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="space-y-2">
              {paginatedItems.map(([key, ench]) => (
                <EnchantCard key={key} enchKey={key} ench={ench} enchs={enchants} />
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
          </>
        )}
      </div>
    </Layout>
  );
}