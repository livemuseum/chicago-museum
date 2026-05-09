const map = L.map('map').setView([41.8781, -87.6298], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// cluster group
const markers = L.markerClusterGroup();
let dataGlobal = [];

fetch("locations.json")
  .then(r => r.json())
  .then(data => {
    dataGlobal = data;
    render(data);
  });

function render(data) {
  markers.clearLayers();

  data.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng]).bindPopup(`
      <b>${loc.name}</b><br>
      ${loc.year || ""}<br>
      ${loc.type || ""}
    `);

    markers.addLayer(marker);
  });

  map.addLayer(markers);
}
