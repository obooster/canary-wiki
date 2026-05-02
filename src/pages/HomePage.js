import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Package, Sparkles, Hammer, BookOpen, Heart, Skull, Map, ScrollText, Trophy, ExternalLink, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';

import background from '../background.png'
import logo from '../icon.png'

const API_ENDPOINTS = {
  items: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json',
  enchantments: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/enchants.json',
  reforges: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/reforges.json',
  pets: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/pets.json',
  entities: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/entities.json',
  collections: 'https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/collections.json',
};

function preloadData(endpoint) {
  if (!API_ENDPOINTS[endpoint]) return;
  axios.get(API_ENDPOINTS[endpoint]).catch(() => {});
}

const CATEGORIES = [
  { path: '/getting-started', label: 'Guia de Início', icon: Map, desc: 'Como começar no servidor', color: '#55FF55', testId: 'category-card-guide' },
  { path: '/items', label: 'Itens', icon: Package, desc: 'Armas, armaduras e acessórios', color: '#5555FF', testId: 'category-card-items', preload: 'items' },
  { path: '/enchantments', label: 'Encantamentos', icon: Sparkles, desc: 'Todos os encantamentos do server', color: '#AA00AA', testId: 'category-card-enchantments', preload: 'enchantments' },
  { path: '/reforges', label: 'Reforjas', icon: Hammer, desc: 'Reforjas e bônus de status', color: '#FF5555', testId: 'category-card-reforges', preload: 'reforges' },
  { path: '/collections', label: 'Coleções', icon: BookOpen, desc: 'Coleções e recompensas', color: '#55FF55', testId: 'category-card-collections', preload: 'collections' },
  { path: '/pets', label: 'Pets', icon: Heart, desc: 'Pets e habilidades', color: '#FF55FF', testId: 'category-card-pets', preload: 'pets' },
  { path: '/entities', label: 'Entidades', icon: Skull, desc: 'Mobs, chefes e drops', color: '#FF5555', testId: 'category-card-entities', preload: 'entities' },
  { path: '/tier-lists', label: 'Tier Lists', icon: Trophy, desc: 'Rankings de itens e pets', color: '#FFAA00', testId: 'category-card-tierlists' },
  { path: '/rules', label: 'Regras', icon: ScrollText, desc: 'Regras do servidor', color: '#AAAAAA', testId: 'category-card-rules' },
];

const STATS = [
  { label: 'Itens', value: '700+' },
  { label: 'Encantamentos', value: '70+' },
  { label: 'Pets', value: '10+' },
  { label: 'Entidades', value: '60+' },
  { label: 'Reforjas', value: '70+' },
  { label: 'Coleções', value: '40+' }
];

function AnimatedNumber({ value, duration = 1200 }) {
  const numeric = parseInt(value.replace(/\D/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now) {
      const raw = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(raw);

      const current = Math.floor(eased * numeric);
      setDisplay(current);

      if (raw < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [numeric, duration]);

  return (
    <span>
      {display}{suffix}
    </span>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Layout>
      <section
        data-testid="hero-section"
        className="relative min-h-[420px] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden"
        style={{ background: `linear-gradient(to bottom, #121212cc, #121212ee), url('${background}') center/cover no-repeat` }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 15px, #fff 15px, #fff 16px), repeating-linear-gradient(90deg, transparent, transparent 15px, #fff 15px, #fff 16px)'
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <img
            src={logo}
            alt="RedeCanary"
            className="w-20 h-20 object-contain drop-shadow-[0_0_20px_#FFAA0066] animate-float"
            data-testid="hero-logo"
          />

          <div>
            <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-[#FFAA00] leading-tight drop-shadow-[0_2px_8px_#FFAA0044]">
              Canary
            </h1>
            <p className="font-pixel text-xl md:text-2xl text-white mt-1">Wiki</p>
            <p className="text-[#AAAAAA] mt-3 text-sm md:text-base">
              Sua enciclopédia completa do SkyBlock da RedeCanary
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-lg" data-testid="hero-search-form">
            <div className="flex items-center bg-[#1E1E1E]/90 border-2 border-[#FFAA00]/50 hover:border-[#FFAA00] focus-within:border-[#FFAA00] transition-colors">
              <Search size={18} className="ml-4 text-[#FFAA00] flex-shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar itens, encantamentos, pets..."
                className="flex-1 bg-transparent text-white px-4 py-3.5 text-sm outline-none placeholder-[#555]"
                data-testid="hero-search-input"
              />
              <button
                type="submit"
                className="bg-[#FFAA00] text-black px-5 py-3.5 font-bold text-sm hover:bg-[#FFC800] active:translate-y-px transition-all font-pixel"
                data-testid="hero-search-button"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-pixel text-[#FFAA00] text-lg tabular-nums min-w-[60px] text-center"><AnimatedNumber value={s.value} /></p>
                <p className="text-[#777] text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#FFAA00]/10 border-y border-[#FFAA00]/30 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          <p className="text-sm text-white">
            Servidor online: <span className="font-mono text-[#FFAA00]">redecanary.net</span>
          </p>
        </div>
        <a
          href="https://redecanary.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#FFAA00] hover:text-[#FFC800] whitespace-nowrap"
          data-testid="hero-server-link"
        >
          Jogar agora <ExternalLink size={11} />
        </a>
      </div>

      <section className="px-4 md:px-8 py-10" data-testid="categories-section">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-pixel text-xl md:text-2xl text-white mb-6">
            <span className="text-[#FFAA00]">▌</span> Explorar Wiki
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.path}
                  to={cat.path}
                  data-testid={cat.testId}
                  onMouseEnter={() => cat.preload && preloadData(cat.preload)}
                  className="group flex items-start gap-4 p-4 bg-[#1E1E1E] border border-[#333] hover:border-[#555] hover:bg-[#252525] transition-all duration-150 relative overflow-hidden"
                >
                  <div
                    className="flex-shrink-0 p-2.5 transition-colors"
                    style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}33` }}
                  >
                    <Icon size={20} style={{ color: cat.color }} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-white text-sm group-hover:text-[#FFAA00] transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-[#777] text-xs mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-[#555] group-hover:text-[#FFAA00] mt-1 flex-shrink-0 transition-colors" />
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: cat.color }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-[#333] px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={logo} alt="RedeCanary" className="w-5 h-5 object-contain" />
          <span className="font-pixel text-[#FFAA00] text-xs">Canary Wiki</span>
        </div>
        <p className="text-[#555] text-xs">
          Feito pelo booster para a comunidade · redecanary.net
        </p>
      </footer>
    </Layout>
  );
}