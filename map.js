
// ================= MAP =================
const map = L.map('map').setView([41.8781, -87.6298], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ================= LAYER =================
let layer = L.layerGroup().addTo(map);

function clear() {
  layer.clearLayers();
}

// ================= SAFE COORDS =================
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

  if (lat == null || lng == null) return null;

  const fLat = parseFloat(lat);
  const fLng = parseFloat(lng);

  if (isNaN(fLat) || isNaN(fLng)) return null;

  return [fLat, fLng];
}

// ================= MAIN LOADER =================
function loadData() {
  clear();

  fetch("https://data.cityofchicago.org/resource/tt4n-kn4t.json?$limit=1000")
    .then(r => r.json())
    .then(data => {

      console.log("API DATA:", data.length);

      let count = 0;

      data.forEach(d => {
        const coords = getCoords(d);
        if (!coords) return;

        L.marker(coords).addTo(layer)
          .bindPopup(`
            <b>${d.address || "Unknown"}</b><br>
            ${d.date_built || ""}
          `);

        count++;
      });

      console.log("MARKERS:", count);

      // 🟢 fallback if empty
      if (count === 0) {
        console.warn("Empty dataset → switching to demo");
        loadDemo();
      }
    })
    .catch(err => {
      console.error("API ERROR:", err);
      loadDemo();
    });
}

// ================= DEMO DATA (100% WORKS ALWAYS) =================
function loadDemo() {
  clear();

  const demo = [
    { name: "Chicago Museum", lat: 41.8781, lng: -87.6298 },
    { name: "Downtown", lat: 41.8819, lng: -87.6278 },
    { name: "River North", lat: 41.8925, lng: -87.6343 },
    { name: "Hyde Park", lat: 41.7943, lng: -87.5907 }
  ];

  demo.forEach(d => {
    L.marker([d.lat, d.lng]).addTo(layer)
      .bindPopup(`<b>${d.name}</b>`);
  });

  console.log("Demo mode loaded");
}

// ================= AUTO START =================
loadData();
