const map = L.map('map').setView([41.8781, -87.6298], 11);

// base map
const modern = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// optional historical layer
const historical = L.tileLayer('https://tiles.wmflabs.org/historic/{z}/{x}/{y}.png');

L.control.layers({
  "Modern": modern,
  "Historical": historical
}).addTo(map);

// cluster group
const cluster = L.markerClusterGroup();
let dataGlobal = [];
let currentFilter = "all";

// load data
fetch("locations.json")
  .then(r => r.json())
  .then(data => {
    dataGlobal = data;
    render(data);
  });

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
  });

  map.addLayer(cluster);
}

// filter system
window.setFilter = function(type) {
  currentFilter = type;
  applyFilters();
};

// search
document.getElementById("search").addEventListener("input", e => {
  applyFilters(e.target.value.toLowerCase());
});

// timeline
document.getElementById("year").addEventListener("input", e => {
  document.getElementById("yearLabel").innerText = e.target.value;
  applyFilters();
});

function applyFilters(search = "") {
  const yearLimit = +document.getElementById("year").value;

  let filtered = dataGlobal.filter(loc => {
    const matchType = currentFilter === "all" || loc.type === currentFilter;
    const matchYear = !loc.year || loc.year <= yearLimit;
    const matchSearch = loc.name.toLowerCase().includes(search);

    return matchType && matchYear && matchSearch;
  });

  render(filtered);
}
