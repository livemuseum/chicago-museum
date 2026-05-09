console.log("MUSEUM ENGINE BOOT");

// ======================
// STATE
// ======================

let map;
let markers;
let allData = [];

// ======================
// INIT
// ======================

window.addEventListener("load", () => {

  console.log("WINDOW READY");

  initMap();
  loadData();
  initUI();

});

// ======================
// MAP
// ======================

function initMap() {

  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markers = L.markerClusterGroup();
  map.addLayer(markers);

  console.log("MAP READY");

  // test marker
  L.marker([41.8781, -87.6298])
    .addTo(map)
    .bindPopup("MUSEUM ENGINE OK");

}

// ======================
// LOAD DATA
// ======================

function loadData() {

  fetch("./data/locations.json")
    .then(res => {
      console.log("FETCH STATUS:", res.status);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {

      console.log("DATA LOADED:", data.length);

      allData = data;

      renderMarkers();

    })
    .catch(err => {

      console.error("LOAD ERROR:", err);

    });

}

// ======================
// RENDER MARKERS
// ======================

function renderMarkers() {

  if (!markers) return;

  markers.clearLayers();

  allData.forEach(item => {

    if (!item.lat || !item.lng) return;

    const marker = L.marker([item.lat, item.lng]);

    marker.on("click", () => {
      loadWikipedia(item.name);
    });

    marker.bindPopup(`
      <b>${item.name}</b><br>
      ${item.year || ""}
    `);

    markers.addLayer(marker);

  });

  console.log("MARKERS RENDERED:", allData.length);

}

// ======================
// WIKIPEDIA SIDEBAR
// ======================

async function loadWikipedia(title) {

  const panel = document.getElementById("details");

  if (!panel) return;

  panel.innerHTML = "<p>Loading Wikipedia...</p>";

  try {

    const url =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    const res = await fetch(url);

    const data = await res.json();

    panel.innerHTML = `
      <h2>${data.title || title}</h2>

      ${
        data.thumbnail
          ? `<img src="${data.thumbnail.source}" style="width:100%; border-radius:8px;">`
          : ""
      }

      <p>${data.extract || "No description available."}</p>

      <a href="${data.content_urls?.desktop?.page}" target="_blank">
        Open Wikipedia →
      </a>
    `;

  } catch (e) {

    console.error(e);

    panel.innerHTML = "<p>Wikipedia load failed</p>";

  }

}

// ======================
// UI (safe hooks)
// ======================

function initUI() {

  const search = document.getElementById("searchBox");
  const year = document.getElementById("yearRange");
  const label = document.getElementById("yearLabel");

  if (search) {

    search.addEventListener("input", (e) => {

      const q = e.target.value.toLowerCase();

      const filtered = allData.filter(i =>
        i.name.toLowerCase().includes(q)
      );

      markers.clearLayers();

      filtered.forEach(renderSingleMarker);

    });

  }

  if (year) {

    year.addEventListener("input", (e) => {

      const y = Number(e.target.value);

      if (label) label.innerText = y;

      const filtered = allData.filter(i =>
        !i.year || i.year <= y
      );

      markers.clearLayers();

      filtered.forEach(renderSingleMarker);

    });

  }

}

// ======================
// SINGLE MARKER HELPER
// ======================

function renderSingleMarker(item) {

  const marker = L.marker([item.lat, item.lng]);

  marker.on("click", () => loadWikipedia(item.name));

  marker.bindPopup(item.name);

  markers.addLayer(marker);

}
