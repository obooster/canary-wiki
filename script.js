const container = document.getElementById("container");
const searchInput = document.getElementById("search");

fetch("https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json")
  .then(res => res.json())
  .then(data => {

    const items = Object.values(data);

    function render(list) {
      container.innerHTML = "";

      list.forEach(item => {
        const card = document.createElement("div");
        card.className = "card " + (item.rarity || "").toLowerCase();

        card.innerHTML = `
          <h3>${item.displayName}</h3>
          <div class="stats">
            <p>${item.category}</p>
            <p>💰 ${item.sellPrice}</p>
            <p>❤ ${item.baseAttributes?.MAX_HEALTH || 0} | 🛡 ${item.baseAttributes?.DEFENSE || 0}</p>
          </div>
        `;

        container.appendChild(card);
      });
    }

    render(items);

    searchInput.addEventListener("input", () => {
      const value = searchInput.value.toLowerCase();

      const filtered = items.filter(item =>
        item.displayName.toLowerCase().includes(value)
      );

      render(filtered);
    });

  });