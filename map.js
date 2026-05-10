console.log("🟣 MUSEUM PRO v5 AI SYSTEM START");

let map;
let markers;
let allData = [];

let state = {
  year: 2025,
  type: "all"
};

// ======================
// INIT
// ======================

window.addEventListener("load", () => {

  initMap();
  loadData();
  bindUI();

});

// ======================
// MAP (Google Earth style base)
// ======================

function initMap() {

  map = L.map("map", {
    zoomControl: true,
    attributionControl: true
  }).setView([41.8781, -87.6298], 11);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "&copy; OpenStreetMap" }
  ).addTo(map);

  markers = L.markerClusterGroup({
    chunkedLoading: true
  });

  map.addLayer(markers);

  console.log("🗺 MAP READY");

}

// ======================
// DATA LAYER
// ======================

function loadData() {

  fetch("./data/locations.json?v=" + Date.now())
    .then(r => r.json())
    .then(data => {

      allData = data;

      console.log("📦 DATA LOADED:", allData.length);

      render();

    });

}

// ======================
// UI BINDING (timeline + filters)
// ======================

function bindUI() {

  const year = document.getElementById("yearRange");

  if (year) {

    year.addEventListener("input", (e) => {

      state.year = +e.target.value;

      const label = document.getElementById("yearLabel");
      if (label) label.innerText = state.year;

      render();

    });

  }

  document.querySelectorAll("[data-type]").forEach(btn => {

    btn.addEventListener("click", () => {

      state.type = btn.dataset.type;

      render();

    });

  });

}

// ======================
// ICON SYSTEM (museum identity)
// ======================

function icon(type) {

  const palette = {
    church: "#c0392b",
    skyscraper: "#2980b9",
    historic: "#f39c12",
    district: "#27ae60"
  };

  return L.divIcon({
    className: "",
    html: `<div style="
      width:10px;height:10px;
      background:${palette[type] || "#555"};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 5px rgba(0,0,0,0.3);
    "></div>`
  });

}

// ======================
// RENDER ENGINE (core logic)
// ======================

function render() {

  markers.clearLayers();

  let visible = 0;

  allData
    .filter(o => {

      const yearOK = !o.year || o.year <= state.year;
      const typeOK = state.type === "all" || o.type === state.type;

      return yearOK && typeOK;

    })
    .forEach(o => {

      const m = L.marker([o.lat, o.lng], {
        icon: icon(o.type)
      });

      // CLICK → AI + WIKI
      m.on("click", () => {
        loadWikipedia(o.name);
        showAIContext(o);
      });

      // HOVER PREVIEW (Google Earth feel)
      m.on("mouseover", () => {
        m.bindPopup(`<b>${o.name}</b>`).openPopup();
      });

      markers.addLayer(m);

      visible++;

    });

  console.log("📍 VISIBLE:", visible);

}

// ======================
// 🧠 AI WHY IT MATTERS (context engine)
// ======================

function showAIContext(o) {

  const panel = document.getElementById("details");

  panel.innerHTML = `
    <h3>${o.name}</h3>

    <p><b>AI Insight:</b></p>
    <p>
      This ${o.type || "structure"} reflects the historical evolution of Chicago’s
      urban development and architectural identity.
    </p>
  `;

}

// ======================
// 📚 WIKIPEDIA ENGINE (ROBUST)
// ======================

async function loadWikipedia(title) {

  const panel = document.getElementById("details");

  panel.innerHTML = "<p>Loading AI museum data...</p>";

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
        panel.innerHTML = "<p>No Wikipedia data</p>";
        return;
      }

      res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best)}`
      );

    }

    const data = await res.json();

    panel.innerHTML = `
      <h3>${data.title}</h3>

      ${data.thumbnail ?
        `<img src="${data.thumbnail.source}" style="width:100%;border-radius:8px;">`
        : ""
      }

      <p>${aiSummary(data.extract)}</p>

      <a href="${data.content_urls?.desktop?.page}" target="_blank">
        Open Wikipedia →
      </a>
    `;

  } catch (e) {

    panel.innerHTML = "<p>AI system error</p>";

  }

}

// ======================
// 🧠 AI SUMMARY ENGINE
// ======================

function aiSummary(text) {

  if (!text) return "";

  const s = text.split(". ");

  return s.slice(0, 2).join(". ") + ".";

}
