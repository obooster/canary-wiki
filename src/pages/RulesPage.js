import { useState } from 'react';
import {
  ScrollText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  XCircle,
  Shield,
  Ban,
  Info,
  MessageCircle
} from 'lucide-react';

import Layout from '../components/Layout';

const RULES = [
  {
    id: 1,
    category: 'Comportamento e Chat',
    color: '#55FF55',
    icon: MessageCircle,
    rules: [
      {
        title: 'Anti-Jogo',
        desc: 'Atitudes que podem prejudicar a jogabilidade de outros jogadores dentro do servidor.',
        type: 'warning'
      },
      {
        title: 'Desinformação',
        desc: 'Espalhar informações falsas com o intuito de prejudicar outros jogadores ou causar baderna geral.',
        type: 'warning'
      },
      {
        title: 'Flood ou Spam',
        desc: 'Enviar mensagens repetidas ou sem sentido para poluir o chat.',
        type: 'ban'
      },
      {
        title: 'Ofensa a Jogador',
        desc: 'Ofender jogadores com xingamentos ou insultos.',
        type: 'ban'
      },
      {
        title: 'Ofensa à Equipe do Servidor',
        desc: 'Ofender membros da equipe ou o servidor.',
        type: 'ban'
      },
      {
        title: 'Discriminação',
        desc: 'Preconceito por raça, cor, sexo, orientação sexual ou religião.',
        type: 'ban'
      },
      {
        title: 'Comportamento Inapropriado',
        desc: 'Conteúdo ofensivo, sexual ou de ódio em qualquer forma.',
        type: 'ban'
      }
    ]
  },

  {
    id: 2,
    category: 'Trapaças e Bugs',
    color: '#FF5555',
    icon: Ban,
    rules: [
      {
        title: 'Uso de Trapaças',
        desc: 'Uso de hacks, mods ou clientes que dão vantagem injusta.',
        type: 'ban'
      },
      {
        title: 'Exploits de Bugs',
        desc: 'Explorar bugs para benefício próprio.',
        type: 'ban'
      },
      {
        title: 'Abuso de Bugs',
        desc: 'Usar erros do sistema sem reportar para vantagem.',
        type: 'ban'
      },
      {
        title: 'Falsificação de Provas',
        desc: 'Criar provas falsas para prejudicar outros jogadores.',
        type: 'ban'
      }
    ]
  },

  {
    id: 3,
    category: 'Economia e Comércio',
    color: '#FFAA00',
    icon: Shield,
    rules: [
      {
        title: 'Comércio Externo Inadequado',
        desc: 'Negociações externas não autorizadas.',
        type: 'warning'
      },
      {
        title: 'Estorno de Compra',
        desc: 'Tentar estornar compras da rede.',
        type: 'ban'
      },
      {
        title: 'Divulgação',
        desc: 'Divulgação de servidores, links ou canais sem permissão.',
        type: 'warning'
      }
    ]
  },

  {
    id: 4,
    category: 'Conta e Segurança',
    color: '#AA55FF',
    icon: Shield,
    rules: [
      {
        title: 'Invasão de Conta',
        desc: 'Acessar contas de outros jogadores sem permissão.',
        type: 'ban'
      }
    ]
  },

  {
    id: 5,
    category: 'Staff e Autoridade',
    color: '#55AAFF',
    icon: Shield,
    rules: [
      {
        title: 'Abuso de Poder',
        desc: 'Uso indevido de comandos ou cargo para benefício próprio.',
        type: 'ban'
      },
      {
        title: 'Apelações',
        desc: 'Use o Discord para contestar punições.',
        type: 'info'
      }
    ]
  }
];

const TYPE_CONFIG = {
  ban: { icon: XCircle, color: '#FF5555', label: 'Banimento' },
  warning: { icon: AlertTriangle, color: '#FFAA00', label: 'Aviso' },
  info: { icon: Info, color: '#5555FF', label: 'Info' },
};

function RuleSection({ section }) {
  const [expanded, setExpanded] = useState(true);
  const SectionIcon = section.icon;

  return (
    <div className="bg-[#1E1E1E] border border-[#333]">
      <button
        className="w-full flex items-center justify-between px-4 py-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <SectionIcon size={18} style={{ color: section.color }} />
          <div>
            <p className="font-pixel text-sm" style={{ color: section.color }}>
              {section.category}
            </p>
            <p className="text-[#777] text-xs">
              {section.rules.length} regras
            </p>
          </div>
        </div>

        {expanded ? (
          <ChevronUp size={14} className="text-[#777]" />
        ) : (
          <ChevronDown size={14} className="text-[#777]" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-[#2A2A2A] divide-y divide-[#2A2A2A]">
          {section.rules.map((rule, i) => {
            const tc = TYPE_CONFIG[rule.type] || TYPE_CONFIG.info;
            const Icon = tc.icon;

            return (
              <div key={i} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <Icon size={14} style={{ color: tc.color }} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-medium">
                        {rule.title}
                      </p>
                      <span
                        className="text-[9px] px-1.5 py-0.5 uppercase"
                        style={{
                          color: tc.color,
                          background: `${tc.color}18`
                        }}
                      >
                        {tc.label}
                      </span>
                    </div>
                    <p className="text-[#AAAAAA] text-xs leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RulesPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <ScrollText size={24} className="text-[#AAAAAA]" />
            <h1 className="font-pixel text-2xl md:text-3xl text-white">
              Regras do Servidor
            </h1>
          </div>

          <p className="text-[#AAAAAA] text-sm">
            O desrespeito às regras pode resultar em punições.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 p-3 bg-[#1E1E1E] border border-[#333]">
          <p className="text-[#777] text-xs w-full mb-1">Legenda:</p>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;

            return (
              <div key={key} className="flex items-center gap-1.5">
                <Icon size={12} style={{ color: cfg.color }} />
                <span className="text-xs" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {RULES.map(section => (
            <RuleSection key={section.id} section={section} />
          ))}
        </div>

        <div className="mt-8 bg-[#FF5555]/10 border border-[#FF5555]/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-[#FF5555]" />
            <p className="font-pixel text-[#FF5555] text-xs">
              Aviso Importante
            </p>
          </div>
          <p className="text-[#AAAAAA] text-xs">
            As regras podem mudar sem aviso prévio.
          </p>
        </div>
      </div>
    </Layout>
  );
}