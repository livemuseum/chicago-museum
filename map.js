console.log("MUSEUM ENGINE BOOT");

let map;
let markers;
let allData = [];

let activeYear = 2025;
let activeType = "all";

// ======================
// INIT SAFE
// ======================

window.addEventListener("load", () => {

  console.log("WINDOW READY");

  initMap();
  loadData();
  bindUI();

});

// ======================
// MAP INIT
// ======================

function initMap() {

  if (typeof L === "undefined") {
    console.error("Leaflet not loaded");
    return;
  }

  map = L.map("map").setView([41.8781, -87.6298], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  markers = L.markerClusterGroup();
  map.addLayer(markers);

  console.log("MAP READY");

}

// ======================
// LOAD DATA (CACHE SAFE)
// ======================

function loadData() {

  fetch("./data/locations.json?v=" + Date.now())
    .then(r => r.json())
    .then(data => {

      allData = data || [];

      console.log("DATA LOADED:", allData.length);

      render();

    })
    .catch(err => {

      console.error("DATA LOAD ERROR:", err);

    });

}

// ======================
// UI SAFE BINDING (NO CRASH IF ELEMENTS MISSING)
// ======================

function bindUI() {

  const yearSlider = document.getElementById("yearRange");

  if (yearSlider) {

    yearSlider.addEventListener("input", (e) => {

      activeYear = +e.target.value;

      const label = document.getElementById("yearLabel");
      if (label) label.innerText = activeYear;

      render();

    });

  }

  // optional type filters
  document.querySelectorAll("[data-type]").forEach(btn => {

    btn.addEventListener("click", () => {

      activeType = btn.getAttribute("data-type") || "all";

      render();

    });

  });

}

// ======================
// ICONS
// ======================

function getIcon(type) {

  const colors = {
    church: "#b30000",
    skyscraper: "#1f77b4",
    district: "#2ca02c",
    historic: "#ff7f0e"
  };

  return L.divIcon({
    className: "icon",
    html: `<div style="
      width:10px;height:10px;
      background:${colors[type] || "#666"};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 3px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [10, 10]
  });

}

// ======================
// RENDER ENGINE (CORE)
// ======================

function render() {

  if (!markers) return;

  markers.clearLayers();

  let visible = 0;

  allData
    .filter(item => {

      const yearOk = !item.year || item.year <= activeYear;
      const typeOk = activeType === "all" || item.type === activeType;

      return yearOk && typeOk;

    })
    .forEach(item => {

      if (!item.lat || !item.lng) return;

      const marker = L.marker(
        [item.lat, item.lng],
        { icon: getIcon(item.type) }
      );

      // CLICK
      marker.on("click", () => {
        loadWikipedia(item.name);
        showWhyItMatters(item);
      });

      // HOVER
      marker.on("mouseover", () => {
        marker.bindPopup(`<b>${item.name}</b>`).openPopup();
      });

      markers.addLayer(marker);

      visible++;

    });

  console.log("RENDER DONE | visible:", visible);

  // fallback debug marker (если ничего нет)
  if (visible === 0) {
    console.warn("NO VISIBLE DATA — CHECK FILTERS OR JSON");
  }

}

// ======================
// WIKIPEDIA (ROBUST)
// ======================

async function loadWikipedia(title) {

  const panel = document.getElementById("details");

  if (panel) panel.innerHTML = "<p>Loading...</p>";

  try {

    let url =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    let res = await fetch(url);

    if (!res.ok) {

      const search =
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(title)}&limit=1&format=json&origin=*`;

      const sres = await fetch(search);
      const sdata = await sres.json();

      const best = sdata?.[1]?.[0];

      if (!best) {
        if (panel) panel.innerHTML = "<p>No Wikipedia data</p>";
        return;
      }

      res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best)}`
      );

    }

    const data = await res.json();

    renderWiki(data);

  } catch (e) {

    console.error(e);

    const panel = document.getElementById("details");
    if (panel) panel.innerHTML = "<p>Wikipedia error</p>";

  }

}

// ======================
// AI SUMMARY
// ======================

function makeAISummary(text) {

  if (!text) return "No description available.";

  const sentences = text.split(". ");

  return sentences.slice(0, 2).join(". ") + ".";

}

// ======================
// WIKI RENDER
// ======================

function renderWiki(data) {

  const panel = document.getElementById("details");
  if (!panel) return;

  const summary = makeAISummary(data.extract);

  panel.innerHTML = `
    <h3>${data.title || ""}</h3>

    ${data.thumbnail ?
      `<img src="${data.thumbnail.source}" style="width:100%;border-radius:8px;">`
      : ""
    }

    <p>${summary}</p>

    <a href="${data.content_urls?.desktop?.page}" target="_blank">
      Wikipedia →
    </a>
  `;

}

// ======================
// WHY IT MATTERS (AI LAYER)
// ======================

function showWhyItMatters(item) {

  const panel = document.getElementById("details");
  if (!panel) return;

  panel.innerHTML += `
    <hr>
    <h4>Why it matters</h4>
    <p>
      ${item.name} is part of Chicago’s ${item.type || "urban"} history
      and reflects the city’s architectural and cultural evolution.
    </p>
  `;

}
