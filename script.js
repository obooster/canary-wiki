const container = document.getElementById("container");
const searchInput = document.getElementById("search");

const rarityOrder = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5,
  SPECIAL: 6
};

function normalize(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatPrice(value) {
  if (value === undefined || value === null) {
    return "Sem valor definido";
  }

  return value.toLocaleString("pt-BR");
}

function sortObjects(list) {
  return list.sort((a, b) => {

    const rarityA = rarityOrder[a.rarity] || 0;
    const rarityB = rarityOrder[b.rarity] || 0;

    // 🔥 primeiro: raridade
    if (rarityA !== rarityB) {
      return rarityB - rarityA; // maior primeiro
    }

    // 🔤 segundo: nome
    const nameA = (a.displayName || "").toLowerCase();
    const nameB = (b.displayName || "").toLowerCase();

    return nameA.localeCompare(nameB);
  });
}

fetch("https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json")
    .then(res => res.json())
    .then(data => {

        const items = Object.values(data);

        // render
        function render(list, value = "") {
            container.innerHTML = "";

            list.forEach(item => {
                const card = document.createElement("div");
                card.className = "card " + (item.rarity || "").toLowerCase();

                const originalName = item.displayName || "";
                const normalizedName = normalize(originalName);

                let highlightedName = originalName;

                if (value) {
                    const index = normalizedName.indexOf(value);

                    if (index !== -1) {
                        const end = index + value.length;

                        highlightedName =
                            originalName.slice(0, index) +
                            `<span class="highlight">` +
                            originalName.slice(index, end) +
                            `</span>` +
                            originalName.slice(end);
                    }
                }

                card.innerHTML = `
            <h3>${highlightedName}</h3>
            <div class="stats">
                <p>${item.category}</p>
                <p>💰 ${formatPrice(item.sellPrice)}</p>
                <p>❤ ${item.baseAttributes?.MAX_HEALTH || 0} | 🛡 ${item.baseAttributes?.DEFENSE || 0}</p>
            </div>
            `;

                container.appendChild(card);
            });
        }
        // render

        render(sortObjects(items), "");
        console.log("itens carregados:", items.length);

        let timeout;

        searchInput.addEventListener("keyup", () => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                const value = normalize(searchInput.value);

                const filtered = items.filter(item => {
                    const text = normalize(
                        (item.displayName || "") + " " +
                        (item.category || "") + " " +
                        (item.rarity || "")
                    );

                    return text.includes(value);
                });

                render(sortObjects(filtered), value);
            }, 50)

        });

    });