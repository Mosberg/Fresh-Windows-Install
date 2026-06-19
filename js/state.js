let RAW_DATA = null;          // merged JSON from all sources
let SOFTWARE = {};            // { category: [items...] }

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let selectedTags = new Set();
let selectedCategories = new Set();
let batchSelection = new Set();
