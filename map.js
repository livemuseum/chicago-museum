console.log("MAP JS VERSION = 999");

console.log("MUSEUM PRO ENGINE START");

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

});

// ======================
// MAP INIT
// ======================

function initMap() {

  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markers = L.markerClusterGroup();
  map.addLayer(markers);

  console.log("MAP READY");

  }

// ======================
// LOAD DATA
// ======================

function loadData() {

  console.log("LOADING DATA...");

  fetch("./data/locations.json")
    .then(res => {

      console.log("FETCH STATUS:", res.status);

      if (!res.ok) throw new Error("HTTP " + res.status);

      return res.json();

    })
    .then(data => {

      console.log("DATA LOADED:", data);

      allData = data;

      renderMarkers();

    })
    .catch(err => {

      console.error("LOAD ERROR:", err);

    });

}

// ======================
// RENDER MARKERS (CLEAN)
// ======================

function renderMarkers() {

  console.log("RENDER START");

  console.log("DATA SIZE:", allData.length);

  // 🔴 FULL CLEAN
  markers.clearLayers();

  allData.forEach(item => {

    if (!item.lat || !item.lng) return;

    console.log("ADDING:", item.name);

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

  console.log("RENDER DONE");

}

// ======================
// WIKIPEDIA SIDEBAR (ROBUST)
// ======================

async function loadWikipedia(title) {

  const panel = document.getElementById("details");

  if (!panel) return;

  panel.innerHTML = "<p>Loading Wikipedia...</p>";

  try {

    // direct API
    let url =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    let res = await fetch(url);

    // fallback search if not found
    if (!res.ok) {

      console.log("Fallback search triggered");

      const searchUrl =
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(title)}&limit=1&namespace=0&format=json&origin=*`;

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      const best = searchData?.[1]?.[0];

      if (!best) {
        panel.innerHTML = "<p>No Wikipedia match found</p>";
        return;
      }

      url =
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best)}`;

      res = await fetch(url);
    }

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
// OPTIONAL SAFE UI HOOKS
// ======================

window.addEventListener("load", () => {

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

      filtered.forEach(item => {

        const m = L.marker([item.lat, item.lng]);

        m.bindPopup(item.name);

        markers.addLayer(m);

      });

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

      filtered.forEach(item => {

        const m = L.marker([item.lat, item.lng]);

        m.bindPopup(item.name);

        markers.addLayer(m);

      });

    });

  }

});
