import { Routes, Route } from 'react-router-dom'
import { useState } from "react";

import "./App.css";

import SplashScreen from "./components/SplashScreen";

import HomePage from "./pages/HomePage";
import ItemsPage from "./pages/ItemsPage";
import EnchantmentsPage from "./pages/EnchantmentsPage";
import ReforgesPage from "./pages/ReforgesPage";
import CollectionsPage from "./pages/CollectionsPage";
import PetsPage from "./pages/PetsPage";
import EntitiesPage from "./pages/EntitiesPage";
import GuidePage from "./pages/GuidePage";
import RulesPage from "./pages/RulesPage";
import TierListsPage from "./pages/TierListsPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  const [loading, setLoading] = useState(true)

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />

  console.log('feito com amor pelo busti')
  return (
    <div className="App">
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
    </div>
  );
}