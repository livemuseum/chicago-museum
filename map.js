console.log("MUSEUM PRO START");

let map;
let markers;

let allData = [];

let currentYear = 2025;
let currentSearch = "";

window.onload = () => {

  initMap();
  initUI();
  loadData();

};

function initMap() {

  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);

  markers = L.markerClusterGroup();

  map.addLayer(markers);

  console.log("MAP READY");
}

function loadData() {

  fetch("./locations.json")
    .then(r => {

      console.log("FETCH STATUS:", r.status);

      return r.json();

    })
    .then(data => {

      console.log("DATA LOADED:", data.length);

      allData = data;

      render();

    })
    .catch(err => {

      console.error("DATA ERROR:", err);

    });

}

function render() {

  markers.clearLayers();

  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = "";

  let visibleCount = 0;

  allData.forEach(obj => {

    // Проверка координат
    if (!obj.lat || !obj.lng) return;

    // Timeline filter
    if (obj.year && Number(obj.year) > currentYear) return;

    // Search filter
    if (
      currentSearch &&
      !obj.name.toLowerCase().includes(currentSearch)
    ) {
      return;
    }

    // Marker
    const marker = L.marker([obj.lat, obj.lng]);

    marker.bindPopup(`
      <b>${obj.name || "Unknown"}</b><br>
      Year: ${obj.year || "?"}
    `);

    markers.addLayer(marker);

    // Sidebar card
    const card = document.createElement("div");

    card.className = "object-card";

    card.innerHTML = `
      <b>${obj.name}</b><br>
      ${obj.year || ""}
    `;

    card.onclick = () => {

      map.setView([obj.lat, obj.lng], 15);

      marker.openPopup();

    };

    sidebar.appendChild(card);

    visibleCount++;

  });

  console.log("VISIBLE OBJECTS:", visibleCount);

}

function initUI() {

  // Timeline
  const slider = document.getElementById("yearRange");

  const yearLabel = document.getElementById("yearLabel");

  slider.addEventListener("input", (e) => {

    currentYear = Number(e.target.value);

    yearLabel.innerText = currentYear;

    render();

  });

  // Search
  const searchBox = document.getElementById("searchBox");

  searchBox.addEventListener("input", (e) => {

    currentSearch = e.target.value.toLowerCase();

    render();

  });

}
