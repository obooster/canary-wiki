const container = document.getElementById("container");
const searchInput = document.getElementById("search");

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

            const name = (item.displayName || "");

            const highlightedName = value
                ? name.replace(
                    new RegExp(escapeRegex(value), "gi"),
                    match => `<span class="highlight">${match}</span>`
                ) : name;

            card.innerHTML = `
            <h3>${highlightedName}</h3>
            <div class="stats">
                <p>${item.category}</p>
                <p>💰 ${item.sellPrice}</p>
                <p>❤ ${item.baseAttributes?.MAX_HEALTH || 0} | 🛡 ${item.baseAttributes?.DEFENSE || 0}</p>
            </div>
            `;

            container.appendChild(card);
        });
    }
    // render

    render(items, "");
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

            render(filtered, value);     
        }, 50)
        
    });

  });