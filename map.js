

// ================= MAP =================
const map = L.map('map').setView([41.8781, -87.6298], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ================= LAYER =================
let layer = L.layerGroup().addTo(map);

// ================= HELPERS =================
function clear() {
  layer.clearLayers();
}

// ================= 1. BUILDINGS =================
function loadBuildings() {
  clear();

  fetch("https://data.cityofchicago.org/resource/tt4n-kn4t.json?$limit=2000")
    .then(r => r.json())
    .then(data => {

      data.forEach(d => {
        const lat = d.location?.latitude;
        const lng = d.location?.longitude;

        if (!lat || !lng) return;

        L.marker([lat, lng]).addTo(layer)
          .bindPopup(`
            <b>${d.address || "Unknown"}</b><br>
            Architect: ${d.architect || ""}<br>
            Year: ${d.date_built || ""}
          `);
      });
    });
}

// ================= 2. SCHOOLS =================
function loadSchools() {
  clear();

  fetch("https://data.cityofchicago.org/resource/2e6r-mc5g.json?$limit=2000")
    .then(r => r.json())
    .then(data => {

      data.forEach(d => {
        if (!d.location) return;

        const lat = d.location.latitude;
        const lng = d.location.longitude;

        if (!lat || !lng) return;

        L.marker([lat, lng]).addTo(layer)
          .bindPopup(`
            <b>${d.school_name}</b><br>
            Type: ${d.school_type || ""}
          `);
      });
    });
}

// ================= 3. CRIME SAMPLE =================
function loadCrime() {
  clear();

  fetch("https://data.cityofchicago.org/resource/ijzp-q8t2.json?$limit=1000")
    .then(r => r.json())
    .then(data => {

      data.forEach(d => {
        if (!d.latitude || !d.longitude) return;

        L.circleMarker([d.latitude, d.longitude], {
          radius: 4
        }).addTo(layer)
          .bindPopup(`
            <b>${d.primary_type}</b><br>
            ${d.description}
          `);
      });
    });
}

// ================= SEARCH =================
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  layer.eachLayer(l => {
    if (l.getPopup) {
      const txt = l.getPopup().getContent().toLowerCase();
      if (!txt.includes(q)) {
        map.removeLayer(l);
      }
    }
  });
});
