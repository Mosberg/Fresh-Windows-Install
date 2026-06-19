# Dynamic Software Dashboard  
A modular, JSON‑driven software dashboard for Windows — powered by GitHub Pages.

[Github](https://mosberg.github.io/Fresh-Windows-Install/) - [Perchance](https://perchance.org/dynamic-software-dashboard)
(Github)[https://mosberg.github.io/Fresh-Windows-Install] - (Perchance)[https://perchance.org/dynamic-software-dashboard]

## 🚀 Features
- Loads **multiple JSON files dynamically**
- Uses **real official icons** stored in `/icons/`
- Fully modular **HTML / CSS / JS** structure
- Supports **favorites**, **batch install**, **filters**, **tags**, **categories**
- Works entirely client‑side — no backend required

## 📁 Folder Structure
```
Mosberg.github.io/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   ├── loader.js
│   ├── state.js
│   ├── ui.js
│   └── main.js
├── data/
│   ├── software-core.json
│   ├── software-dev.json
│   ├── software-gaming.json
│   ├── software-creative.json
│   ├── software-security.json
│   ├── software-open-source.json
│   └── software-network.json
└── icons/
    └── *.png
```

## 📦 JSON Format
Each file follows:

```json
{
  "version": "1.0.0",
  "software": [
    {
      "name": "Example App",
      "description": "Short description",
      "tags": ["tag1", "tag2"],
      "category": "Category Name",
      "url": "https://example.com",
      "download": "https://example.com/download",
      "image": "https://raw.githubusercontent.com/Mosberg/Mosberg.github.io/refs/heads/main/icons/example.png",
      "popular": 8
    }
  ]
}
```

## 🔧 Adding New Software
1. Add the icon to `/icons/`
2. Add the entry to the appropriate JSON file in `/data/`
3. Reload the page — no build step required

## 🧠 Multi‑JSON Loading
The dashboard automatically merges all JSON files listed in:

```
js/config.js
```

## 🛠️ Local Development
Just open `index.html` in a browser — everything runs client‑side.

## 📜 License
MIT
