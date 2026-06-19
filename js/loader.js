async function reloadData() {
  const status = document.getElementById("updateStatus");
  const dataVersionEl = document.getElementById("dataVersion");
  status.textContent = "Loading JSON…";

  const all = [];
  let latestVersion = "n/a";

  for (const url of SOFTWARE_SOURCES) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();

      if (json.version && json.version > latestVersion) {
        latestVersion = json.version;
      }

      if (Array.isArray(json.software)) {
        all.push(...json.software);
      }
    } catch (e) {
      console.warn("Failed to load:", url, e);
    }
  }

  RAW_DATA = { version: latestVersion, software: all };

  SOFTWARE = {};
  (RAW_DATA.software || []).forEach(item => {
    const cat = item.category || "Uncategorized";
    if (!SOFTWARE[cat]) SOFTWARE[cat] = [];
    item.tags = Array.isArray(item.tags) ? item.tags : [];
    SOFTWARE[cat].push(item);
  });

  selectedTags = new Set();
  selectedCategories = new Set();
  batchSelection = new Set();

  dataVersionEl.textContent = latestVersion || "n/a";
  status.textContent = "Loaded from JSON";

  renderFilters();
  render();
}
