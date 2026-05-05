import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Home, Package, Sparkles, Hammer, BookOpen,
  Heart, Skull, Map, ScrollText, Trophy,
  Menu, X, Search, ExternalLink, ChevronRight
} from 'lucide-react';

import LOGO from '../icon.png'

const NAV_ITEMS = [
  { path: '/', label: 'Início', icon: Home, testId: 'nav-link-home' },
  { path: '/getting-started', label: 'Guia de Início', icon: Map, testId: 'nav-link-guide' },
  { path: '/items', label: 'Itens', icon: Package, testId: 'nav-link-items', preload: 'items' },
  { path: '/enchantments', label: 'Encantamentos', icon: Sparkles, testId: 'nav-link-enchantments', preload: 'enchantments' },
  { path: '/reforges', label: 'Reforjas', icon: Hammer, testId: 'nav-link-reforges', preload: 'reforges' },
  { path: '/collections', label: 'Coleções', icon: BookOpen, testId: 'nav-link-collections', preload: 'collections' },
  { path: '/pets', label: 'Pets', icon: Heart, testId: 'nav-link-pets', preload: 'pets' },
  { path: '/entities', label: 'Entidades', icon: Skull, testId: 'nav-link-entities', preload: 'entities' },
  { path: '/rules', label: 'Regras', icon: ScrollText, testId: 'nav-link-rules' },
  { path: '/tier-lists', label: 'Tier Lists', icon: Trophy, testId: 'nav-link-tierlists' },
];

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

function NavLink({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      data-testid={item.testId}
      onClick={onClick}
      onMouseEnter={() => item.preload && preloadData(item.preload)}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out group relative
        ${active
          ? 'text-[#FFAA00] bg-[#FFAA00]/10 border-l-2 border-[#FFAA00]'
          : 'text-[#AAAAAA] hover:text-white hover:bg-white/5 border-l-2 border-transparent'
        }`}
    >
      <Icon size={16} strokeWidth={2.5} className={active ? 'text-[#FFAA00]' : 'text-[#777]'} />
      <span>{item.label}</span>
      {active && <ChevronRight size={12} className="ml-auto text-[#FFAA00]" />}
    </Link>
  );
}

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSidebarOpen(false);
    }
  };

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col h-full">
      <Link
        to="/"
        onClick={onLinkClick}
        className="flex items-center gap-3 px-4 py-5 border-b border-[#333]"
      >
        <img src={LOGO} alt="RedeCanary" className="w-9 h-9 object-contain" />
        <div>
          <p className="font-pixel text-[#FFAA00] text-sm leading-tight">Canary</p>
          <p className="text-[#777] text-xs">Wiki</p>
        </div>
      </Link>

      <nav className="flex-1 py-2 overflow-y-auto">
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-[#555] uppercase tracking-widest">
          Navegar
        </p>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            active={location.pathname === item.path}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#333]">
        <a
          href="https://redecanary.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#FFAA00] hover:text-[#FFC800]"
        >
          <ExternalLink size={12} />
          <span className="text-xs font-mono">redecanary.net</span>
        </a>
        <p className="text-[#555] text-[10px] mt-1">Servidor Skyblock</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#1A1A1A] border-r border-[#333] flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        <SidebarContent onLinkClick={() => {}} />
      </aside>

      {/* overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar mobile */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] border-r border-[#333] z-50 flex flex-col transition-transform duration-200 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#333]">
          <span className="font-pixel text-[#FFAA00] text-sm">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={18} className="text-[#777]" />
          </button>
        </div>

        <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* topbar */}
        <header
          className="sticky top-0 z-30 bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#333] flex items-center gap-3 px-4 py-3"
        >
          <button
            className="lg:hidden text-[#777] hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <img src={LOGO} className="w-7 h-7 object-contain"  alt="Canary"/>
            <span className="font-pixel text-[#FFAA00] text-sm">
              Canary Wiki
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md">
            <div className="flex items-center rounded-md gap-2 bg-[#252525] border border-[#333] hover:border-[#555] focus-within:border-[#FFAA00] px-3 py-2 flex-1 transition-colors">
              <Search size={14} className="text-[#777]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar itens, encantamentos, pets..."
                className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#555]"
              />
            </div>
          </form>

          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-[#FFAA00] font-mono">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            redecanary.net
          </div>
        </header>

        {/* content */}
        <main className="flex-1 overflow-auto min-w-0">
            <div className="animate-page-fade">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}