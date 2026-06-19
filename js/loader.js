async function loadAllSoftware() {
  const all = [];

  for (const url of SOFTWARE_SOURCES) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (Array.isArray(json.software)) {
        all.push(...json.software);
      }
    } catch (err) {
      console.warn("Failed to load:", url);
    }
  }

  // Deduplicate by name
  const map = new Map();
  all.forEach(item => map.set(item.name, item));

  return Array.from(map.values());
}
