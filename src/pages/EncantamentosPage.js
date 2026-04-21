import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';
import { parseMcText } from '../utils/minecraft';

const API = `https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/enchants.json`;

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

function EnchantCard({ enchKey, ench }) {
  const [expanded, setExpanded] = useState(false);
  const extra = ench.extra || {};
  const descriptions = extra.descriptions || {};
  const expCosts = extra.expCosts || {};
  const sellPrices = extra.sellPrices || {};
  const targets = extra.targets || [];

  return (
    <div
      data-testid={`enchant-card-${enchKey.toLowerCase()}`}
      className="bg-[#1E1E1E] border border-[#333] hover:border-[#AA00AA55] transition-colors"
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={16} className="text-[#AA00AA] flex-shrink-0" strokeWidth={2.5} />
          <div>
            <p className="text-white font-medium text-sm">{ench.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[#AA00AA] bg-[#AA00AA18] px-1.5 py-0.5">
                Nv. Máx: {ench.maxLevel}
              </span>
              {targets.slice(0, 3).map(t => (
                <span
                  key={t}
                  className="text-[10px] text-[#5555FF] bg-[#5555FF18] px-1.5 py-0.5"
                >
                  {TARGET_LABELS[t] || t}
                </span>
              ))}
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-[#777]" />
        ) : (
          <ChevronDown size={14} className="text-[#777]" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A] space-y-4">

          {Object.keys(descriptions).length > 0 && (
            <div>
              <p className="text-[#777] text-xs uppercase tracking-wider mt-3 mb-2">
                Efeitos por Nível
              </p>
              <div className="space-y-1">
                {Object.entries(descriptions).map(([lvl, descs]) => (
                  <div key={lvl} className="flex gap-2 py-1 border-b border-[#2A2A2A]">
                    <span className="text-[#FFAA00] font-pixel text-xs w-4 flex-shrink-0">
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

          <div>
            <p className="text-[#777] text-xs uppercase tracking-wider mb-2">
              Aplicável em
            </p>
            <div className="flex flex-wrap gap-1">
              {targets.map(t => (
                <span
                  key={t}
                  className="text-xs text-[#5555FF] bg-[#5555FF18] border border-[#5555FF33] px-2 py-0.5"
                >
                  {TARGET_LABELS[t] || t}
                </span>
              ))}
            </div>
          </div>

          {!ench.allowedInEnchantTable && (
            <p className="text-[#FF5555] text-xs flex items-center gap-1">
              <X size={11} /> Não disponível na mesa de encantamentos
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function EncantamentosPage() {
  const [enchants, setEnchants] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [targetFilter, setTargetFilter] = useState('');

  useEffect(() => {
    axios.get(API)
      .then(r => setEnchants(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allTargets = useMemo(() => {
    const set = new Set();
    Object.values(enchants).forEach(e =>
      (e.extra?.targets || []).forEach(t => set.add(t))
    );
    return [...set].sort();
  }, [enchants]);

  const filtered = useMemo(() => {
    return Object.entries(enchants).filter(([, e]) => {
      const matchSearch = !search || e.name?.toLowerCase().includes(search.toLowerCase());
      const matchTarget = !targetFilter || (e.extra?.targets || []).includes(targetFilter);
      return matchSearch && matchTarget;
    });
  }, [enchants, search, targetFilter]);

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
          <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333] px-3 py-2 flex-1">
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
            className="bg-[#1E1E1E] border border-[#333] text-sm px-3 py-2 text-[#AAAAAA]"
          >
            <option value="">Todos</option>
            {allTargets.map(t => (
              <option key={t} value={t}>{TARGET_LABELS[t] || t}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(([key, ench]) => (
              <EnchantCard key={key} enchKey={key} ench={ench} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}