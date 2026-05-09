
// ================= MAP INIT =================
const map = L.map('map').setView([41.8781, -87.6298], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ================= LAYER =================
let layer = L.layerGroup().addTo(map);

function clearLayer() {
  layer.clearLayers();
}

// ================= SAFE COORDS ENGINE =================
function getCoords(d) {
  const lat =
    d.latitude ||
    d.lat ||
    d.location?.latitude ||
    d.location?.lat;

  const lng =
    d.longitude ||
    d.lng ||
    d.location?.longitude ||
    d.location?.lng;

  if (lat === undefined || lng === undefined) return null;

  const fLat = parseFloat(lat);
  const fLng = parseFloat(lng);

  if (isNaN(fLat) || isNaN(fLng)) return null;

  return [fLat, fLng];
}

// ================= BUILDINGS =================
function loadBuildings() {
  clearLayer();

  fetch("https://data.cityofchicago.org/resource/tt4n-kn4t.json?$limit=3000")
    .then(r => r.json())
    .then(data => {

      let count = 0;

      data.forEach(d => {
        const coords = getCoords(d);
        if (!coords) return;

        L.marker(coords).addTo(layer)
          .bindPopup(`
            <b>${d.address || "Unknown"}</b><br>
            Architect: ${d.architect || "N/A"}<br>
            Year: ${d.date_built || "?"}
          `);

        count++;
      });

      console.log("Buildings loaded:", count);
    });
}

// ================= SCHOOLS =================
function loadSchools() {
  clearLayer();

  fetch("https://data.cityofchicago.org/resource/2e6r-mc5g.json?$limit=3000")
    .then(r => r.json())
    .then(data => {

      let count = 0;

      data.forEach(d => {
        const coords = getCoords(d);
        if (!coords) return;

        L.marker(coords).addTo(layer)
          .bindPopup(`
            <b>${d.school_name || "School"}</b><br>
            Type: ${d.school_type || ""}
          `);

        count++;
      });

      console.log("Schools loaded:", count);
    });
}

// ================= CRIME =================
function loadCrime() {
  clearLayer();

  fetch("https://data.cityofchicago.org/resource/ijzp-q8t2.json?$limit=2000")
    .then(r => r.json())
    .then(data => {

      let count = 0;

      data.forEach(d => {
        const coords = getCoords(d);
        if (!coords) return;

        L.circleMarker(coords, {
          radius: 4
        }).addTo(layer)
          .bindPopup(`
            <b>${d.primary_type}</b><br>
            ${d.description || ""}
          `);

        count++;
      });

      console.log("Crime points loaded:", count);
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
