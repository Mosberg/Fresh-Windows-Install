(async function () {
  const software = await loadAllSoftware();
  renderSoftware(software);
})();