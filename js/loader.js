const SOFTWARE_SOURCES = [
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-core.json",
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-dev.json",
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-gaming.json",
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-creative.json",
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-security.json",
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-open-source.json",
  "https://mosberg.github.io/Fresh-Windows-Install/data/software-network.json"
];

async function loadAllSoftware() {
  const all = [];

  for (const url of SOFTWARE_SOURCES) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (Array.isArray(json.software)) {
        all.push(...json.software);
      }
    } catch (e) {
      console.warn("Failed to load:", url);
    }
  }

  // Deduplicate by name
  const map = new Map();
  all.forEach(item => map.set(item.name, item));
  const merged = Array.from(map.values());

  return merged;
}
