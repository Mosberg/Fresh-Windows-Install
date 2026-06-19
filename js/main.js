document.getElementById("appVersion").textContent = APP_VERSION;

// theme toggle
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

// live controls
document.getElementById("search").oninput = render;
document.getElementById("sort").onchange = render;
document.getElementById("onlyFavorites").onchange = render;
document.getElementById("popularitySlider").oninput = e => {
  document.getElementById("popularityValue").textContent = e.target.value;
  render();
};
document.getElementById("reloadDataBtn").onclick = () => {
  reloadData();
};

// favorites import/export/clear
document.getElementById("exportFavoritesBtn").onclick = () => {
  document.getElementById("favoritesJson").value = JSON.stringify(favorites, null, 2);
};

document.getElementById("importFavoritesBtn").onclick = () => {
  try {
    const text = document.getElementById("favoritesJson").value.trim();
    if (!text) return;
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      favorites = parsed;
      localStorage.setItem("favorites", JSON.stringify(favorites));
      render();
      alert("Favorites imported.");
    } else {
      alert("JSON must be an array of names.");
    }
  } catch (e) {
    alert("Invalid JSON.");
  }
};

document.getElementById("clearFavoritesBtn").onclick = () => {
  if (confirm("Clear all favorites?")) {
    favorites = [];
    localStorage.setItem("favorites", JSON.stringify(favorites));
    render();
  }
};

// batch installer
document.getElementById("generateBatchBtn").onclick = () => {
  const allItems = [];
  Object.values(SOFTWARE).forEach(list =>
    list.forEach(i => {
      if (batchSelection.has(i.name)) allItems.push(i);
    })
  );
  if (!allItems.length) {
    alert("No apps selected for batch install.");
    return;
  }
  const lines = [
    "### PowerShell / winget pseudo‑script",
    "### Replace names with exact IDs if needed.",
    "",
    "foreach ($app in @("
  ];
  allItems.forEach(i => {
    lines.push(`  "${i.name}"`);
  });
  lines.push(")) {");
  lines.push('  Write-Host "Installing $app..."');
  lines.push('  winget install --exact --id $app -h --accept-source-agreements --accept-package-agreements');
  lines.push("}");
  document.getElementById("batchScript").value = lines.join("\n");
};

// config editor
document.getElementById("loadConfigBtn").onclick = () => {
  if (!RAW_DATA) {
    alert("JSON not loaded yet.");
    return;
  }
  document.getElementById("configEditor").value = JSON.stringify(RAW_DATA, null, 2);
};

document.getElementById("applyConfigBtn").onclick = () => {
  try {
    const text = document.getElementById("configEditor").value.trim();
    if (!text) return;
    const parsed = JSON.parse(text);
    if (typeof parsed === "object" && !Array.isArray(parsed) && Array.isArray(parsed.software)) {
      RAW_DATA = parsed;
      SOFTWARE = {};
      parsed.software.forEach(item => {
        const cat = item.category || "Uncategorized";
        if (!SOFTWARE[cat]) SOFTWARE[cat] = [];
        item.tags = Array.isArray(item.tags) ? item.tags : [];
        SOFTWARE[cat].push(item);
      });
      selectedTags = new Set();
      selectedCategories = new Set();
      batchSelection = new Set();
      document.getElementById("dataVersion").textContent = parsed.version || "n/a";
      renderFilters();
      render();
      alert("Config applied (local only). Commit to GitHub to persist.");
    } else {
      alert("Config must be an object with a 'software' array.");
    }
  } catch (e) {
    alert("Invalid JSON in config editor.");
  }
};

// Perchance export
document.getElementById("exportPerchanceBtn").onclick = () => {
  if (!RAW_DATA) {
    alert("JSON not loaded yet.");
    return;
  }
  const out = {
    categories: Object.entries(SOFTWARE).map(([category, items]) => ({
      name: category,
      items: items.map(i => ({
        name: i.name,
        url: i.url,
        desc: i.description || "",
        tags: i.tags,
        popular: typeof i.popular === "number" ? i.popular : 0,
        image: i.image || ""
      }))
    }))
  };
  document.getElementById("perchanceOutput").value = JSON.stringify(out, null, 2);
};

// init
document.getElementById("popularityValue").textContent =
  document.getElementById("popularitySlider").value;

reloadData();
