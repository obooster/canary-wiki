import { Routes, Route } from 'react-router-dom'
import { useState, lazy, Suspense } from "react";

import "./App.css";

import SplashScreen from "./components/SplashScreen";

const HomePage = lazy(() => import("./pages/HomePage"));
const ItemsPage = lazy(() => import("./pages/ItemsPage"));
const EnchantmentsPage = lazy(() => import("./pages/EnchantmentsPage"));
const ReforgesPage = lazy(() => import("./pages/ReforgesPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const PetsPage = lazy(() => import("./pages/PetsPage"));
const EntitiesPage = lazy(() => import("./pages/EntitiesPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const RulesPage = lazy(() => import("./pages/RulesPage"));
const TierListsPage = lazy(() => import("./pages/TierListsPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FFAA00] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true)

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />

  console.log('feito com amor pelo busti')
  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/enchantments" element={<EnchantmentsPage />} />
          <Route path="/reforges" element={<ReforgesPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/entities" element={<EntitiesPage />} />
          <Route path="/getting-started" element={<GuidePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/tier-lists" element={<TierListsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}