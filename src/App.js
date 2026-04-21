import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import ItemsPage from "./pages/ItemsPage";
import EncantamentosPage from "./pages/EncantamentosPage";
import ReforjasPage from "./pages/ReforjasPage";
import ColecoesPage from "./pages/ColecoesPage";
import PetsPage from "./pages/PetsPage";
import EntidadesPage from "./pages/EntidadesPage";
import GuiaPage from "./pages/GuiaPage";
import RegrasPage from "./pages/RegrasPage";
import TierListsPage from "./pages/TierListsPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/enchantments" element={<EncantamentosPage />} />
        <Route path="/reforges" element={<ReforjasPage />} />
        <Route path="/collections" element={<ColecoesPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/entities" element={<EntidadesPage />} />
        <Route path="/getting-started" element={<GuiaPage />} />
        <Route path="/rules" element={<RegrasPage />} />
        <Route path="/tier-lists" element={<TierListsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}