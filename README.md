# RedeCanary Wiki

Wiki oficial da RedeCanary SkyBlock feita em React, focada em organização de informações do servidor como itens, encantamentos, pets, entidades, regras e guias.

---

## 📌 Visão geral

Este projeto é uma wiki interativa para o servidor de SkyBlock da RedeCanary.  
Ele centraliza informações importantes do jogo em uma interface moderna, rápida e responsiva.

---

## 🚀 Funcionalidades

- 📖 Guia de início para novos jogadores
- ⚔️ Lista completa de itens com raridade, atributos e preços
- ✨ Encantamentos e reforjas
- 🐾 Sistema de pets
- 👾 Entidades e drops
- 📜 Regras completas do servidor
- 🏆 Tier lists e rankings
- 🔎 Sistema de busca global
- 🎨 Interface dark com destaque por raridade
- 📊 Itens ordenados automaticamente por raridade

---

## 🧱 Tecnologias utilizadas

- React
- React Router DOM
- TailwindCSS
- Lucide Icons
- Axios
- JSON via GitHub Raw API

---

## 🧠 Lógica principal

### Itens
- Carregados via JSON remoto
- Filtrados por:
  - Nome
  - Categoria
  - Raridade
- Ordenados por:
  - Raridade
  - Preço (maior)
  - Preço (menor)

### Interface
- Sidebar fixa no desktop
- Sidebar mobile em drawer
- Topbar com busca global
- Cards com modal de detalhes

---

## 🎮 Sistema de raridade

COMUM < INCOMUM < RARO < ÉPICO < LENDÁRIO < ESPECIAL

Cada raridade possui cor própria e impacto visual na UI.

---

## 📡 Fonte de dados

https://github.com/RedeCanary/redecanary-requests/

---

## 🏷️ Licença

Projeto interno da comunidade RedeCanary
