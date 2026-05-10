console.log("MUSEUM PRO ENGINE START");

let map;
let markers;
let allData = [];

// ======================
// INIT
// ======================

window.addEventListener("load", () => {

  initMap();
  loadData();

});

// ======================
// MAP INIT
// ======================

function initMap() {

  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  markers = L.markerClusterGroup();
  map.addLayer(markers);

  console.log("MAP READY");

}

// ======================
// LOAD DATA
// ======================

function loadData() {

  fetch("./data/locations.json?v=" + Date.now()) // cache bust FIX
    .then(r => r.json())
    .then(data => {

      allData = data;

      console.log("DATA LOADED:", allData.length);

      renderMarkers();

    })
    .catch(err => console.error("LOAD ERROR:", err));

}

// ======================
// ICON SYSTEM
// ======================

function getIcon(type) {

  const colors = {
    church: "#b30000",
    skyscraper: "#1f77b4",
    district: "#2ca02c",
    historic: "#ff7f0e"
  };

  return L.divIcon({
    className: "custom-icon",
    html: `<div style="
      background:${colors[type] || "#666"};
      width:12px;
      height:12px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12]
  });

}

// ======================
// RENDER MARKERS
// ======================

function renderMarkers() {

  markers.clearLayers();

  allData.forEach(item => {

    if (!item.lat || !item.lng) return;

    const marker = L.marker(
      [item.lat, item.lng],
      { icon: getIcon(item.type) }
    );

    marker.on("click", () => {
      loadWikipedia(item.name);
    });

    marker.bindPopup(`
      <b>${item.name}</b><br>
      ${item.type || ""}<br>
      ${item.year || ""}
    `);

    markers.addLayer(marker);

  });

  console.log("MARKERS RENDERED:", allData.length);

}

// ======================
// WIKIPEDIA ENGINE (FIXED)
// ======================

async function loadWikipedia(title) {

  const panel = document.getElementById("details");

  panel.innerHTML = "<p>Loading Wikipedia...</p>";

  try {

    // 1. direct try
    let url =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    let res = await fetch(url);

    if (res.ok) {

      const data = await res.json();
      renderWiki(data);
      return;

    }

    // 2. search fallback
    const searchUrl =
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(title)}&limit=1&format=json&origin=*`;

    const sres = await fetch(searchUrl);
    const sdata = await sres.json();

    const best = sdata?.[1]?.[0];

    if (!best) {
      panel.innerHTML = "<p>No Wikipedia match found</p>";
      return;
    }

    // 3. final fetch
    const finalUrl =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best)}`;

    const finalRes = await fetch(finalUrl);

    if (!finalRes.ok) {
      panel.innerHTML = "<p>No Wikipedia data</p>";
      return;
    }

    const data = await finalRes.json();
    renderWiki(data);

  } catch (err) {

    console.error(err);
    panel.innerHTML = "<p>Wikipedia error</p>";

  }

}

// ======================
// RENDER WIKI PANEL
// ======================

function renderWiki(data) {

  const panel = document.getElementById("details");

  panel.innerHTML = `
    <h3>${data.title || ""}</h3>

    ${data.thumbnail ?
      `<img src="${data.thumbnail.source}" style="width:100%; border-radius:8px; margin-bottom:8px;">`
      : ""
    }

    <p>${data.extract || "No description available."}</p>

    <a href="${data.content_urls?.desktop?.page}" target="_blank">
      Open Wikipedia →
    </a>
  `;

}
