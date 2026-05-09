console.log("MUSEUM PRO START");

let map;
let markers;
let allData = [];

function initMap() {

  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  markers = L.markerClusterGroup();
  map.addLayer(markers);

  console.log("MAP READY");

  loadData();
}

function loadData() {

  fetch("./locations.json")
    .then(r => r.json())
    .then(data => {

      allData = data;

      console.log("DATA LOADED:", data.length);

      render(2025);

    })
    .catch(err => console.error("DATA ERROR:", err));

}

function render(yearLimit) {

  markers.clearLayers();

  let count = 0;

  allData.forEach(p => {

    if (p.year && Number(p.year) > yearLimit) return;

    if (!p.lat || !p.lng) return;

    const marker = L.marker([p.lat, p.lng]);

    marker.bindPopup(`
      <b>${p.name || "Unknown"}</b><br/>
      Year: ${p.year || "?"}
    `);

    markers.addLayer(marker);
    count++;

  });

  console.log("RENDERED:", count);
}

// UI
function initUI() {

  const slider = document.getElementById("yearRange");
  const label = document.getElementById("yearLabel");

  slider.addEventListener("input", (e) => {

    const year = Number(e.target.value);

    label.innerText = year;

    render(year);

  });
}

window.onload = () => {
  initMap();
  initUI();
};
