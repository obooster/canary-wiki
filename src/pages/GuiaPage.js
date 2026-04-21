import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ChevronRight, Package, Sparkles, Heart, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';

const STEPS = [
  {
    id: 1,
    title: 'Conecte-se ao Servidor',
    icon: '🌐',
    content: [
      'Abra o Minecraft Java Edition',
      'Vá em "Multiplayer" > "Adicionar Servidor"',
      'Digite o IP: redecanary.net',
      'Clique em "Concluído" e depois em "Conectar"',
    ],
    tip: 'Ao entrar no servidor você já será enviado automaticamente para sua ilha inicial',
  },
  {
    id: 2,
    title: 'Sua Ilha Inicial',
    icon: '🏝️',
    content: [
      'Ao entrar no servidor você já será direcionado para sua própria ilha',
      'Não é necessário criar ou escolher ilha manualmente',
      'Explore sua ilha e comece a coletar recursos',
      'Expanda sua base conforme progride no jogo',
    ],
    tip: 'Sua ilha é o centro da sua progressão no SkyBlock',
  },
  {
    id: 3,
    title: 'Habilidades e Progresso',
    icon: '📚',
    content: [
      'Abra o "Menu do SkyBlock" no slot 9 da hotbar',
      'Lá você pode visualizar suas habilidades e progresso',
      'Farming, mineração e combate aumentam seu XP',
      'Habilidades liberam vantagens importantes',
    ],
    tip: 'O menu do SkyBlock centraliza todo o seu progresso',
  },
  {
    id: 4,
    title: 'Sistema de Itens',
    icon: '⚔️',
    content: [
      'Itens possuem raridades: Comum, Incomum, Raro, Épico e Lendário',
      'Raridade maior significa melhores atributos base',
      'Itens podem ser obtidos por drop, crafting ou comércio',
      'Equipamentos são essenciais para progressão',
    ],
    tip: 'Sempre compare atributos antes de trocar itens',
  },
  {
    id: 5,
    title: 'Encantamentos e Reforjas',
    icon: '✨',
    content: [
      'Encante suas armas e armaduras na mesa de encantamentos',
      'Encantamentos customizados são exclusivos do servidor',
      'Reforjas adicionam bônus de status ao equipamento',
      'Combinar ambos melhora muito sua eficiência',
    ],
    tip: 'Crítico e dano são essenciais no início do jogo',
  },
  {
    id: 6,
    title: 'Economia e Comércio',
    icon: '💰',
    content: [
      'O comércio principal acontece no Leilão do Vilarejo (spawn)',
      'Itens podem ser vendidos e comprados entre jogadores',
      'Use o sistema de leilão para encontrar melhores ofertas',
      'A economia é totalmente baseada nos jogadores',
    ],
    tip: 'Visite o vilarejo regularmente para boas oportunidades',
  },
];

const QUICK_LINKS = [
  { to: '/items', icon: Package, label: 'Ver Itens', color: '#5555FF' },
  { to: '/enchantments', icon: Sparkles, label: 'Encantamentos', color: '#AA00AA' },
  { to: '/pets', icon: Heart, label: 'Pets', color: '#FF55FF' },
  { to: '/collections', icon: BookOpen, label: 'Coleções', color: '#55FF55' },
];

export default function GuiaPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Map size={24} className="text-[#55FF55]" strokeWidth={2.5} />
            <h1 className="font-pixel text-2xl md:text-3xl text-[#55FF55]">
              Guia de Início
            </h1>
          </div>
          <p className="text-[#AAAAAA] text-sm leading-relaxed">
            Comece sua jornada no SkyBlock da RedeCanary com este guia básico de progressão.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex flex-col items-center gap-2 p-3 bg-[#1E1E1E] border border-[#333] hover:border-[#555] transition-all text-center group"
              >
                <Icon size={20} style={{ color: link.color }} />
                <span className="text-xs text-[#AAAAAA] group-hover:text-white transition-colors">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-6">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="relative">
              {idx < STEPS.length - 1 && (
                <div
                  className="absolute left-5 bottom-0 w-px bg-[#333]"
                  style={{ top: '3.5rem' }}
                />
              )}

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#1E1E1E] border-2 border-[#FFAA00] font-pixel text-[#FFAA00] text-sm z-10">
                  {step.id}
                </div>

                <div className="flex-1 bg-[#1E1E1E] border border-[#333] p-4 mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{step.icon}</span>
                    <h2 className="font-pixel text-white text-sm">
                      {step.title}
                    </h2>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {step.content.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#AAAAAA]">
                        <ChevronRight size={14} className="text-[#FFAA00] flex-shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-[#FFAA00]/10 border border-[#FFAA00]/30 px-3 py-2">
                    <p className="text-xs text-[#FFAA00]">
                      <span className="font-bold">Dica: </span>
                      {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#1E1E1E] border border-[#FFAA00]/30 p-6 text-center">
          <p className="font-pixel text-[#FFAA00] text-lg mb-2">
            Pronto para jogar?
          </p>
          <p className="text-[#AAAAAA] text-sm mb-4">
            Conecte-se agora: <span className="font-mono text-white">redecanary.net</span>
          </p>

          <a
            href="https://redecanary.net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFAA00] text-black px-6 py-2.5 font-pixel text-sm hover:bg-[#FFC800] active:translate-y-px transition-all border-b-4 border-[#CC8800]"
          >
            Jogar Agora
          </a>
        </div>
      </div>
    </Layout>
  );
}