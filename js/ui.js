function getAllTags() {
  const tags = new Set();
  Object.values(SOFTWARE).forEach(list => {
    list.forEach(item => item.tags.forEach(t => tags.add(t)));
  });
  return Array.from(tags).sort();
}

function getAllCategories() {
  return Object.keys(SOFTWARE).sort();
}

function renderFilters() {
  const tagContainer = document.getElementById("tagFilters");
  const catContainer = document.getElementById("categoryFilters");
  tagContainer.innerHTML = "";
  catContainer.innerHTML = "";

  getAllTags().forEach(tag => {
    const chip = document.createElement("div");
    chip.className = "filter-chip" + (selectedTags.has(tag) ? " active" : "");
    chip.textContent = tag;
    chip.onclick = () => {
      if (selectedTags.has(tag)) selectedTags.delete(tag);
      else selectedTags.add(tag);
      renderFilters();
      render();
    };
    tagContainer.appendChild(chip);
  });

  getAllCategories().forEach(cat => {
    const chip = document.createElement("div");
    chip.className = "filter-chip" + (selectedCategories.has(cat) ? " active" : "");
    chip.textContent = cat;
    chip.onclick = () => {
      if (selectedCategories.has(cat)) selectedCategories.delete(cat);
      else selectedCategories.add(cat);
      renderFilters();
      render();
    };
    catContainer.appendChild(chip);
  });
}

function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  render();
}

function render() {
  const search = document.getElementById("search").value.toLowerCase();
  const sort = document.getElementById("sort").value;
  const onlyFav = document.getElementById("onlyFavorites").checked;
  const minPop = parseInt(document.getElementById("popularitySlider").value, 10) || 0;
  const container = document.getElementById("categories");
  container.innerHTML = "";

  const categoryEntries = Object.entries(SOFTWARE);
  let sortedEntries = categoryEntries;

  if (sort === "category") {
    sortedEntries = [...categoryEntries].sort((a, b) => a[0].localeCompare(b[0]));
  }

  sortedEntries.forEach(([category, items]) => {
    if (selectedCategories.size && !selectedCategories.has(category)) return;

    let filtered = items.filter(i => {
      if (onlyFav && !favorites.includes(i.name)) return false;
      const pop = typeof i.popular === "number" ? i.popular : 0;
      if (pop < minPop) return false;

      if (selectedTags.size) {
        const hasAll = Array.from(selectedTags).every(t => i.tags.includes(t));
        if (!hasAll) return false;
      }

      const text = (i.name + " " + (i.description || "") + " " + i.tags.join(" ")).toLowerCase();
      if (search && !text.includes(search)) return false;

      return true;
    });

    if (!filtered.length) return;

    if (sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") filtered.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "popular") filtered.sort((a, b) => {
      const pa = typeof a.popular === "number" ? a.popular : 0;
      const pb = typeof b.popular === "number" ? b.popular : 0;
      return pb - pa;
    });

    const cat = document.createElement("div");
    cat.className = "category";

    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML = `<span>${category}</span><span>${filtered.length} items</span>`;

    const content = document.createElement("div");
    content.className = "category-content";

    header.onclick = () => {
      content.style.display = content.style.display === "block" ? "none" : "block";
    };

    const grid = document.createElement("div");
    grid.className = "software-grid";

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "software-card";

      const favClass = favorites.includes(item.name) ? "favorite active" : "favorite";
      const checked = batchSelection.has(item.name) ? "checked" : "";
      const imgSrc = item.image || "";
      const safeDesc = item.description || "";

      card.innerHTML = `
        <div class="software-icon">
          ${imgSrc ? `<img src="${imgSrc}" alt="${item.name} icon" loading="lazy" />` : `<span style="font-size:0.7rem;color:var(--fg2);">No icon</span>`}
        </div>
        <div class="software-body">
          <div class="card-top-row">
            <label>
              <input type="checkbox" class="batch-checkbox" data-name="${item.name}" ${checked} />
              Batch
            </label>
            <span class="${favClass}" data-fav="${item.name}">★</span>
          </div>
          <h3>${item.name}</h3>
          <p>${safeDesc}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.2rem;">
            <a href="${item.url}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;font-weight:600;font-size:0.85rem;">Website</a>
            ${item.download ? `<a href="${item.download}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;font-weight:600;font-size:0.85rem;">Download</a>` : ""}
          </div>
          <div class="tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      `;

      grid.appendChild(card);
    });

    content.appendChild(grid);
    cat.appendChild(header);
    cat.appendChild(content);
    container.appendChild(cat);
  });

  container.querySelectorAll("[data-fav]").forEach(el => {
    el.onclick = e => {
      e.stopPropagation();
      const name = el.getAttribute("data-fav");
      toggleFavorite(name);
    };
  });

  container.querySelectorAll(".batch-checkbox").forEach(cb => {
    cb.onchange = () => {
      const name = cb.getAttribute("data-name");
      if (cb.checked) batchSelection.add(name);
      else batchSelection.delete(name);
    };
  });
}
