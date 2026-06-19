function renderSoftware(list) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const categories = {};

  list.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  Object.entries(categories).forEach(([category, items]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "category";

    const title = document.createElement("h2");
    title.textContent = `${category} (${items.length})`;

    const grid = document.createElement("div");
    grid.className = "software-grid";

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "software-card";

      card.innerHTML = `
        <div class="software-icon">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.description || ""}</p>
        </div>
      `;

      grid.appendChild(card);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(grid);
    app.appendChild(wrapper);
  });
}
