const State = {
  favorites: new Set(JSON.parse(localStorage.getItem("favorites") || "[]")),
  batch: new Set(),
  filters: {
    tags: new Set(),
    categories: new Set(),
    search: ""
  },

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify([...this.favorites]));
  }
};
