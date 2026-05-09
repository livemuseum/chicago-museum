console.log("ENGINE START");

let map;
let markers;
let allData = [];

window.onload = () => {

  console.log("WINDOW READY");

  // MAP INIT
  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  // IMPORTANT: marker group MUST be created
  markers = L.markerClusterGroup();
  map.addLayer(markers);

  console.log("MAP READY");

  // TEST MARKER (важно для проверки)
  L.marker([41.8781, -87.6298])
    .addTo(map)
    .bindPopup("TEST OK");

  // LOAD DATA
  fetch("./data/locations.json")
    .then(r => {

      console.log("FETCH STATUS:", r.status);

      return r.json();

    })
    .then(data => {

      console.log("DATA LOADED:", data);

      allData = data;

      render();

    })
    .catch(err => {

      console.error("FETCH ERROR:", err);

    });

};

function render() {

  console.log("RENDER START");

  console.log("DATA SIZE:", allData.length);

  markers.clearLayers();

  allData.forEach(obj => {

    console.log("ADDING:", obj.name);

    if (!obj.lat || !obj.lng) return;

    const marker = L.marker([obj.lat, obj.lng]);

    marker.bindPopup(`
      <b>${obj.name}</b><br>
      ${obj.year || ""}
    `);

    markers.addLayer(marker);

  });

  console.log("RENDER DONE");

}
