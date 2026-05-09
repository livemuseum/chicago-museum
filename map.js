
// ================= MAP INIT =================
const map = L.map('map').setView([41.8781, -87.6298], 11);

const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const historical = L.tileLayer('https://tiles.wmflabs.org/historic/{z}/{x}/{y}.png');

// layers control
L.control.layers({
  "Modern": base,
  "Historical": historical
}).addTo(map);

// ================= CLUSTER =================
const cluster = L.markerClusterGroup();
map.addLayer(cluster);

// ================= DATA =================
let dataGlobal = [];
let currentYear = 1900;

// ================= 3D (pseudo) =================
function add3D(lat, lng, height = 20) {
  const icon = L.divIcon({
    className: 'cube',
    html: `<div style="
      width:10px;
      height:${height}px;
      background:rgba(0,0,0,0.4);
    "></div>`
  });

  L.marker([lat, lng], { icon }).addTo(map);
}

// ================= RENDER =================
function render(data) {
  cluster.clearLayers();

  data.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng]);

    marker.bindPopup(`
      <b>${loc.name}</b><br>
      Year: ${loc.year || "?"}<br>
      Type: ${loc.type || ""}<br><br>

      ${loc.before ? `<img src="${loc.before}" width="120"><br>Before<br>` : ""}
      ${loc.after ? `<img src="${loc.after}" width="120"><br>After` : ""}
    `);

    cluster.addLayer(marker);

    // optional 3D visual
    if (loc.year && loc.year < 1900) {
      add3D(loc.lat, loc.lng, 15);
    }
  });
}

// ================= CHICAGO API =================
function loadChicago() {
  fetch("https://data.cityofchicago.org/resource/tt4n-kn4t.json?$limit=1500")
    .then(r => r.json())
    .then(data => {

      dataGlobal = data.map(d => {
        return {
          name: d.address,
          lat: d.location?.latitude,
          lng: d.location?.longitude,
          year: parseInt(d.date_built || 0),
          type: "architecture"
        };
      }).filter(x => x.lat && x.lng);

      applyFilters();
    });
}

// ================= LIBRARY OF CONGRESS =================
function loadHistoric() {
  fetch("https://www.loc.gov/photos/?fo=json&c=50")
    .then(r => r.json())
    .then(data => {

      const results = data.results || [];

      results.forEach(p => {
        if (!p.latitude || !p.longitude) return;

        cluster.addLayer(
          L.marker([p.latitude, p.longitude])
            .bindPopup(`
              <b>${p.title}</b><br>
              <img src="${p.image_url || ""}" width="150">
            `)
        );
      });
    });
}

// ================= FILTERS =================
function applyFilters() {

  const filtered = dataGlobal.filter(loc => {
    return !loc.year || loc.year <= currentYear;
  });

  render(filtered);
}

// ================= SEARCH =================
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = dataGlobal.filter(l =>
    (l.name || "").toLowerCase().includes(q)
  );

  render(filtered);
});

// ================= TIMELINE =================
document.getElementById("year").addEventListener("input", e => {
  currentYear = +e.target.value;
  document.getElementById("yearLabel").innerText = currentYear;

  applyFilters();
});
