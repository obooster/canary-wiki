fetch("https://raw.githubusercontent.com/RedeCanary/redecanary-requests/main/skyblock/items.json")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("container");

    Object.values(data).forEach(item => {

      const card = document.createElement("div");
      card.className = "card " + (item.rarity || "").toLowerCase();

      card.innerHTML = `
        <h3>${item.displayName}</h3>
        <p>${item.category}</p>
        <p>💰 ${item.sellPrice}</p>
        <p>❤ ${item.baseAttributes?.MAX_HEALTH || 0}</p>
        <p>🛡 ${item.baseAttributes?.DEFENSE || 0}</p>
      `;

      container.appendChild(card);
    });

  }).catch(err => console.error(err));