import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Package, X } from 'lucide-react';
import Layout from '../components/Layout';
import { RARITY_COLORS, ATTR_LABELS, formatNumber } from '../utils/minecraft';

const API = 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json';

const RARITY_ORDER = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5,
  SPECIAL: 6
};

const CATEGORY_LABELS = {
  HELMET: 'Capacete',
  CHESTPLATE: 'Peitoral',
  LEGGINGS: 'Calças',
  BOOTS: 'Botas',

  SWORD: 'Espada',
  BOW: 'Arco',
  PICKAXE: 'Picareta',
  AXE: 'Machado',
  HOE: 'Enxada',
  SHOVEL: 'Pá',
  SHEAR: 'Tesoura',
  FISHING_ROD: 'Vara de Pesca',

  ACCESSORY: 'Acessório',
  WAND: 'Varinha',

  ARMOR: 'Armadura',

  BELT: 'Cinto',
  BRACELET: 'Bracelete',
  CLOAK: 'Manto',
  HAT: 'Chapéu',
  MODIFIER: 'Modificador',
  NECKLACE: 'Colar',
  PET_ITEM: 'Item de Pet',
  OTHER: 'Outro',
};

function RarityBadge({ rarity }) {
  const r = RARITY_COLORS[rarity] || RARITY_COLORS.COMMON;
  return (
    <span
      data-testid={`rarity-badge-${rarity?.toLowerCase()}`}
      className="text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider"
      style={{ color: r.hex, background: r.border, border: `1px solid ${r.hex}44` }}
    >
      {r.label}
    </span>
  );
}

function ItemCard({ itemKey, item, onClick }) {
  const r = RARITY_COLORS[item.rarity] || RARITY_COLORS.COMMON;
  return (
    <button
      data-testid={`item-card-${itemKey.toLowerCase()}`}
      onClick={onClick}
      className="w-full text-left p-3 bg-[#1E1E1E] border border-[#333] hover:border-[#555] hover:bg-[#252525] transition-all duration-150 group"
      style={{ borderLeftColor: r.hex, borderLeftWidth: 2 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#252525] border border-[#333]">
          <Package size={20} style={{ color: r.hex }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate group-hover:text-[#FFAA00] transition-colors" style={{ color: r.hex }}>
            {item.displayName}
          </p>
          <p className="text-[#777] text-xs">{CATEGORY_LABELS[item.category] || item.category}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <RarityBadge rarity={item.rarity} />
            {item.sellPrice > 0 && (
              <span className="text-[10px] text-[#FFAA00]">{formatNumber(item.sellPrice)} moedas</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function ItemModal({ itemKey, item, onClose }) {
  if (!item) return null;
  const r = RARITY_COLORS[item.rarity] || RARITY_COLORS.COMMON;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose} data-testid="item-modal-overlay">
      <div className="bg-[#1E1E1E] border border-[#333] max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()} data-testid="item-modal">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]" style={{ borderTopColor: r.hex, borderTopWidth: 2 }}>
          <div>
            <p className="font-pixel text-sm" style={{ color: r.hex }}>{item.displayName}</p>
            <p className="text-[#777] text-xs">{CATEGORY_LABELS[item.category] || item.category}</p>
          </div>
          <button onClick={onClose} className="text-[#777] hover:text-white" data-testid="item-modal-close">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <RarityBadge rarity={item.rarity} />
          </div>

          {item.baseAttributes && Object.keys(item.baseAttributes).length > 0 && (
            <div>
              <p className="text-[#777] text-xs uppercase tracking-wider mb-2">Atributos Base</p>
              <div className="space-y-1">
                {Object.entries(item.baseAttributes).map(([attr, val]) => {
                  const a = ATTR_LABELS[attr];
                  return (
                    <div key={attr} className="flex items-center justify-between py-1 border-b border-[#2A2A2A]">
                      <span className="text-[#AAAAAA] text-xs">{a ? a.label : attr}</span>
                      <span className="text-sm font-medium" style={{ color: a?.color || '#55FF55' }}>
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {item.sellPrice > 0 && (
            <div className="flex items-center justify-between bg-[#252525] px-3 py-2">
              <span className="text-[#AAAAAA] text-xs">Preço de Venda</span>
              <span className="text-[#FFAA00] font-pixel text-sm">{formatNumber(item.sellPrice)} moedas</span>
            </div>
          )}

          <div className="text-[#555] text-xs font-mono">ID: {itemKey}</div>
        </div>
      </div>
    </div>
  );
}

export default function ItemsPage() {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(r => setItems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [...new Set(Object.values(items).map(i => i.category))].sort(), [items]);
  const rarities = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'SPECIAL'];

  const filtered = useMemo(() => {
    return Object.entries(items)
      .filter(([, item]) => {
        const matchSearch =
          !search ||
          item.displayName?.toLowerCase().includes(search.toLowerCase());

        const matchRarity =
          !rarityFilter || item.rarity === rarityFilter;

        const matchCat =
          !categoryFilter || item.category === categoryFilter;

        return matchSearch && matchRarity && matchCat;
      })
      .sort((a, b) => {
        const A = a[1];
        const B = b[1];

        const priceA = A.sellPrice || 0;
        const priceB = B.sellPrice || 0;

        const rarityA = RARITY_ORDER[A.rarity] ?? 0;
        const rarityB = RARITY_ORDER[B.rarity] ?? 0;

        // ordenação por preço com remoção de itens sem preço
        if (sortBy === 'price_asc' || sortBy === 'price_desc') {
          const aHasPrice = priceA > 0;
          const bHasPrice = priceB > 0;

          if (!aHasPrice && !bHasPrice) return 0;
          if (!aHasPrice) return 1;
          if (!bHasPrice) return -1;
        }

        switch (sortBy) {
          case 'price_asc':
            return priceA - priceB;

          case 'price_desc':
            return priceB - priceA;

          case 'rarity':
          default:
            return rarityB - rarityA;
        }
      });
  }, [items, search, rarityFilter, categoryFilter, sortBy]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl md:text-3xl text-[#5555FF] mb-1">Itens</h1>
          <p className="text-[#777] text-sm">Armas, armaduras, acessórios e mais</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" data-testid="items-filters">
          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-[#777]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar item..."
              className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#555]"
              data-testid="items-search-input"
            />
            {search && <button onClick={() => setSearch('')}><X size={12} className="text-[#777]" /></button>}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA] outline-none cursor-pointer hover:border-[#555]"
          >
            <option value="rarity">Raridade</option>
            <option value="price_asc">Preço (menor)</option>
            <option value="price_desc">Preço (maior)</option>
          </select>

          <select
            value={rarityFilter}
            onChange={e => setRarityFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA] outline-none cursor-pointer hover:border-[#555]"
            data-testid="items-filter-rarity"
          >
            <option value="">Todas as raridades</option>
            {rarities.map(r => <option key={r} value={r}>{RARITY_COLORS[r]?.label || r}</option>)}
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA] outline-none cursor-pointer hover:border-[#555]"
            data-testid="items-filter-category"
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
          </select>
        </div>

        <p className="text-[#777] text-xs mb-4" data-testid="items-count">
          {filtered.length} ite{filtered.length !== 1 ? 'ns' : 'm'} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-20 bg-[#1E1E1E] border border-[#333] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" data-testid="items-grid">
            {filtered.map(([key, item]) => (
              <ItemCard key={key} itemKey={key} item={item} onClick={() => setSelected({ key, item })} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-[#555]">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum item encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && <ItemModal itemKey={selected.key} item={selected.item} onClose={() => setSelected(null)} />}
    </Layout>
  );
}