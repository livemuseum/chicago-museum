console.log("MUSEUM PRO - WIKIPEDIA ENGINE");

let map;
let markers;
let allData = [];

window.onload = () => {

  initMap();
  loadData();

};

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

}

// ======================
// DATA
// ======================

function loadData() {

  fetch(".data//locations.json")
    .then(r => r.json())
    .then(data => {

      allData = data;

      render();

    })
    .catch(err => console.error(err));

}

// ======================
// RENDER
// ======================

function render() {

  markers.clearLayers();

  allData.forEach(obj => {

    const marker = L.marker([obj.lat, obj.lng]);

    marker.on("click", () => {

      loadWikipedia(obj.name);

    });

    markers.addLayer(marker);

  });

}

// ======================
// WIKIPEDIA API
// ======================

async function loadWikipedia(title) {

  const sidebar = document.getElementById("details");

  sidebar.innerHTML = "<p>Loading Wikipedia...</p>";

  const url =
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  try {

    const res = await fetch(url);

    const data = await res.json();

    console.log("WIKI DATA:", data);

    sidebar.innerHTML = `
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

  } catch (err) {

    sidebar.innerHTML = "<p>Wikipedia load failed</p>";

    console.error(err);

  }

}
