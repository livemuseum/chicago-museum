const map = L.map('map').setView([41.8781, -87.6298], 11);

// base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; OpenStreetMap'
}).addTo(map);

// cluster
const cluster = L.markerClusterGroup();
map.addLayer(cluster);

let dataGlobal = [];

/* =========================
   1. CHICAGO DATA PORTAL
========================= */
function loadPortal() {
  fetch("https://data.cityofchicago.org/resource/tt4n-kn4t.json?$limit=2000")
    .then(r => r.json())
    .then(data => {
      dataGlobal = data;

      cluster.clearLayers();

      data.forEach(item => {
        if (!item.location) return;

        const lat = parseFloat(item.location.latitude);
        const lng = parseFloat(item.location.longitude);

        if (!lat || !lng) return;

        const marker = L.marker([lat, lng]);

        marker.bindPopup(`
          <b>${item.address || "Unknown"}</b><br>
          Architect: ${item.architect || ""}<br>
          Year: ${item.date_built || ""}
        `);

        cluster.addLayer(marker);
      });
    });
}

/* =========================
   2. LIBRARY OF CONGRESS
   (historic photos)
========================= */
function loadLOC() {
  fetch("https://www.loc.gov/photos/?fo=json&c=50")
    .then(r => r.json())
    .then(data => {
      const results = data.results || [];

      results.forEach(p => {
        if (!p.latitude || !p.longitude) return;

        const marker = L.marker([p.latitude, p.longitude]);

        marker.bindPopup(`
          <b>${p.title || "Historic Photo"}</b><br>
          <img src="${p.image_url || ""}" width="150">
        `);

        cluster.addLayer(marker);
      });
    });
}

/* =========================
   SEARCH
========================= */
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  cluster.clearLayers();

  dataGlobal.forEach(item => {
    const name = (item.address || "").toLowerCase();

    if (name.includes(q)) {
      if (!item.location) return;

      const marker = L.marker([
        item.location.latitude,
        item.location.longitude
      ]);

      cluster.addLayer(marker);
    }
  });
});
