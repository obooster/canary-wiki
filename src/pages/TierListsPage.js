import { useState } from 'react';
import { Trophy } from 'lucide-react';
import Layout from '../components/Layout';

const TIER_COLORS = {
  S: { bg: '#FF5555', text: '#000', label: 'S' },
  A: { bg: '#FFAA00', text: '#000', label: 'A' },
  B: { bg: '#55FF55', text: '#000', label: 'B' },
  C: { bg: '#5555FF', text: '#fff', label: 'C' },
  D: { bg: '#AA00AA', text: '#fff', label: 'D' },
  F: { bg: '#555555', text: '#fff', label: 'F' },
};

const TIER_LISTS = [
  {
    id: 'swords',
    title: 'Espadas',
    description: 'Ranking das melhores espadas para early a late game',
    updatedAt: 'Fev 2025',
    items: [
      // S TIER
      { tier: 'S', name: 'Espada do Dragão', note: 'Dano extremamente alto e escala forte' },
      { tier: 'S', name: 'Espada do Pigman', note: 'Altíssimo dano físico e força' },
      { tier: 'S', name: 'Bumerangue', note: 'Dano bruto muito alto' },
      { tier: 'S', name: 'Cajado do Bonzo', note: 'Burst mágico muito forte' },
      { tier: 'S', name: 'Machado Vulcânico', note: 'Dano alto com boa força' },

      // A TIER
      { tier: 'A', name: 'Aspecto do Fim', note: 'Dano e força equilibrados, muito forte early-mid' },
      { tier: 'A', name: 'Espada Saltitante', note: 'Excelente dano e crit' },
      { tier: 'A', name: 'Lombo de Cordeiro', note: 'Boa força e dano consistente' },
      { tier: 'A', name: 'Buquê Fúnebre', note: 'Dano alto com componente mágico' },
      { tier: 'A', name: 'Espada do Golem', note: 'Muito tank com bom dano' },
      { tier: 'A', name: 'Cajado do Zombie', note: 'Boa mistura de força e dano' },
      { tier: 'A', name: 'Espada de Pedra do Fim', note: 'Boa progressão mid game' },
      { tier: 'A', name: 'Espada do Fim', note: 'Dano consistente early-mid' },

      // B TIER
      { tier: 'B', name: 'Presa de Prata', note: 'Dano alto porém sem escala' },
      { tier: 'B', name: 'Vara de Brasa', note: 'Forte' },
      { tier: 'B', name: 'Espada de Diamante', note: 'Mid game sólida' },
      { tier: 'B', name: 'Espada de Ouro', note: 'Early game com leve força' },
      { tier: 'B', name: 'Espada de Ferro', note: 'Básica porém funcional' },

      // C TIER
      { tier: 'C', name: 'Espada Flamejante', note: 'Dano ok mas sem escala' },
      { tier: 'C', name: 'Espada do Morto-Vivo', note: 'Early game simples' },
      { tier: 'C', name: 'Espada da Aranha', note: 'Early game básica' },
      { tier: 'C', name: 'Lâmina de Esmeralda', note: 'Baixa utilidade geral' },
      { tier: 'C', name: 'Cutelo', note: 'Fraca no geral' },

      // D TIER
      { tier: 'D', name: 'Espada de Pedra', note: 'Muito fraca' },
      { tier: 'D', name: 'Espada de Madeira', note: 'Início absoluto do jogo' }
    ]
  }
];

function groupByTier(items) {
  const grouped = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: [],
  };

  items.forEach(item => {
    if (grouped[item.tier]) {
      grouped[item.tier].push(item);
    }
  });

  return grouped;
}

function TierRow({ tier, items }) {
  const tc = TIER_COLORS[tier];
  return (
    <div className="flex min-h-[60px]" data-testid={`tier-row-${tier}`}>
      <div
        className="flex items-center justify-center w-12 flex-shrink-0 font-pixel text-xl border-r border-[#333]"
        style={{ background: tc.bg, color: tc.text }}
      >
        {tc.label}
      </div>
      <div className="flex flex-wrap gap-2 p-2 flex-1">
        {items.map((item, i) => (
          <div
            key={i}
            data-testid={`tier-item-${item.name.toLowerCase().replace(/\s/g, '-')}`}
            className="flex flex-col bg-[#252525] border border-[#333] px-3 py-1.5 hover:border-[#555] transition-colors"
            title={item.note}
          >
            <span className="text-white text-xs font-medium">{item.name}</span>
            {item.note && <span className="text-[#777] text-[10px]">{item.note}</span>}
          </div>
        ))}
        {items.length === 0 && (
          <span className="text-[#555] text-xs self-center px-2">-</span>
        )}
      </div>
    </div>
  );
}

function TierListCard({ list }) {
  const grouped = groupByTier(list.items);

  return (
    <div className="bg-[#1E1E1E] border border-[#333]">
      <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
        <div>
          <p className="font-pixel text-[#FFAA00] text-sm">{list.title}</p>
          <p className="text-[#777] text-xs">{list.description}</p>
        </div>
        <span className="text-[#555] text-[10px]">Atualizado: {list.updatedAt}</span>
      </div>

      <div className="divide-y divide-[#2A2A2A]">
        {Object.entries(TIER_COLORS).map(([tier]) => (
          <TierRow
            key={tier}
            tier={tier}
            items={grouped[tier] || []}
          />
        ))}
      </div>
    </div>
  );
}

export default function TierListsPage() {
  const [activeTab, setActiveTab] = useState('swords');
  const activeList = TIER_LISTS.find(l => l.id === activeTab);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-[#FFAA00]" />
            <h1 className="font-pixel text-2xl md:text-3xl text-[#FFAA00]">Tier Lists</h1>
          </div>
          <p className="text-[#777] text-sm">Rankings baseados na experiência da comunidade</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" data-testid="tierlist-tabs">
          {TIER_LISTS.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveTab(list.id)}
              data-testid={`tierlist-tab-${list.id}`}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === list.id
                ? 'bg-[#FFAA00] text-black font-pixel'
                : 'bg-[#1E1E1E] border border-[#333] text-[#AAAAAA] hover:border-[#555] hover:text-white'
                }`}
            >
              {list.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#1E1E1E] border border-[#333]">
          <span className="text-[#777] text-xs self-center mr-1">Legenda:</span>
          {Object.entries(TIER_COLORS).map(([tier, tc]) => (
            <div key={tier} className="flex items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center font-pixel text-xs" style={{ background: tc.bg, color: tc.text }}>
                {tc.label}
              </div>
              <span className="text-[#777] text-xs">
                {tier === 'S' ? 'Imbatível' : tier === 'A' ? 'Excelente' : tier === 'B' ? 'Bom' : tier === 'C' ? 'Médio' : tier === 'D' ? 'Fraco' : 'Inútil'}
              </span>
            </div>
          ))}
        </div>

        {activeList && <TierListCard list={activeList} />}

        <div className="mt-6 p-4 bg-[#1E1E1E] border border-[#FFAA00]/20">
          <p className="text-[#777] text-xs">
            <span className="text-[#FFAA00]">Nota:</span> Estas tier lists são baseadas na opinião da comunidade e podem mudar com atualizações do servidor.
            Para sugerir mudanças, acesse o Discord da RedeCanary.
          </p>
        </div>
      </div>
    </Layout>
  );
}