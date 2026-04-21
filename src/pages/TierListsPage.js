import React, { useState } from 'react';
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
    tiers: {
      S: [
        { name: 'Espada Lendária do Céu', note: 'Melhor do late game' },
        { name: 'Espada Crítica', note: 'Excelente para boss' },
      ],
      A: [
        { name: 'Espada de Ametista', note: 'Boa para early late game' },
        { name: 'Espada Sombria', note: 'Viável no mid game' },
      ],
      B: [
        { name: 'Espada de Diamante', note: 'Mid game sólida' },
        { name: 'Espada Elemental', note: 'Alternativa mid' },
      ],
      C: [
        { name: 'Espada de Ferro', note: 'Early game' },
        { name: 'Espada de Pedra', note: 'Starter' },
      ],
      D: [
        { name: 'Espada de Madeira', note: 'Apenas início' },
      ],
    }
  },
  {
    id: 'pets',
    title: 'Pets (Combate)',
    description: 'Ranking dos melhores pets para combate',
    updatedAt: 'Fev 2025',
    tiers: {
      S: [
        { name: 'Dragão Lendário', note: 'Melhor para boss' },
        { name: 'Enderman Lendário', note: 'Excelente dano' },
      ],
      A: [
        { name: 'Lobo Lendário', note: 'Força + Crit. Damage' },
        { name: 'Enderman Épico', note: 'Bom dano' },
      ],
      B: [
        { name: 'Lobo Épico', note: 'Viável mid game' },
        { name: 'Lobo Raro', note: 'Early combate' },
      ],
      C: [
        { name: 'Gato Incomum', note: 'Velocidade ok' },
      ],
      D: [
        { name: 'Abelha', note: 'Não é para combate' },
      ],
    }
  },
  {
    id: 'farming',
    title: 'Pets (Agricultura)',
    description: 'Ranking dos melhores pets para farmar',
    updatedAt: 'Fev 2025',
    tiers: {
      S: [
        { name: 'Abelha Lendária', note: 'Melhor Fortuna de Agric.' },
        { name: 'Gato Lendário', note: 'Velocidade + Fortuna' },
      ],
      A: [
        { name: 'Abelha Épica', note: 'Excelente para farm' },
        { name: 'Gato Épico', note: 'Bom custo-benefício' },
      ],
      B: [
        { name: 'Abelha Rara', note: 'Mid game farming' },
      ],
      C: [
        { name: 'Abelha Incomum', note: 'Início do jogo' },
      ],
      D: [
        { name: 'Abelha Comum', note: 'Starter' },
      ],
    }
  },
  {
    id: 'enchants',
    title: 'Encantamentos',
    description: 'Os encantamentos mais valiosos para equipamentos',
    updatedAt: 'Fev 2025',
    tiers: {
      S: [
        { name: 'Crítico V', note: '+50% dano crítico' },
        { name: 'Primeiro Golpe IV', note: '+100% no primeiro hit' },
      ],
      A: [
        { name: 'Nitidez V', note: '+25 de dano' },
        { name: 'Poder V', note: '+40% dano arco' },
      ],
      B: [
        { name: 'Proteção V', note: '+15 defesa' },
        { name: 'Saque III', note: '+45% drop' },
      ],
      C: [
        { name: 'Eficiência V', note: 'Velocidade de miner.' },
      ],
      D: [
        { name: 'Crítico I', note: 'Fraco demais' },
      ],
    }
  },
];

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
  return (
    <div data-testid={`tierlist-${list.id}`} className="bg-[#1E1E1E] border border-[#333]">
      <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
        <div>
          <p className="font-pixel text-[#FFAA00] text-sm">{list.title}</p>
          <p className="text-[#777] text-xs">{list.description}</p>
        </div>
        <span className="text-[#555] text-[10px]">Atualizado: {list.updatedAt}</span>
      </div>
      <div className="divide-y divide-[#2A2A2A]">
        {Object.entries(list.tiers).map(([tier, items]) => (
          <TierRow key={tier} tier={tier} items={items} />
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
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === list.id
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