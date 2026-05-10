console.log("MUSEUM PRO v4 START");

let map;
let markers;
let allData = [];

let activeYear = 2025;
let activeType = "all";

// ======================
// INIT
// ======================

window.addEventListener("load", () => {

  initMap();
  loadData();
  bindUI();

});

// ======================
// MAP
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
// DATA
// ======================

function loadData() {

  fetch("./data/locations.json?v=" + Date.now())
    .then(r => r.json())
    .then(data => {

      allData = data;

      console.log("DATA:", allData.length);

      render();

    });

}

// ======================
// UI BINDING
// ======================

function bindUI() {

  const slider = document.getElementById("yearRange");

  if (slider) {

    slider.addEventListener("input", (e) => {

      activeYear = +e.target.value;

      document.getElementById("yearLabel").innerText = activeYear;

      render();

    });

  }

  // optional filter buttons (if exist)
  document.querySelectorAll("[data-type]").forEach(btn => {

    btn.addEventListener("click", () => {

      activeType = btn.getAttribute("data-type");

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
      box-shadow:0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [10, 10]
  });

}

// ======================
// RENDER
// ======================

function render() {

  markers.clearLayers();

  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.innerHTML = "";

  allData
    .filter(item => {

      const yearOk = !item.year || item.year <= activeYear;
      const typeOk = activeType === "all" || item.type === activeType;

      return yearOk && typeOk;

    })
    .forEach(item => {

      const marker = L.marker(
        [item.lat, item.lng],
        { icon: getIcon(item.type) }
      );

      // ======================
      // CLICK → WIKI + AI
      // ======================
      marker.on("click", () => {
        loadWikipedia(item.name);
        showWhyItMatters(item);
      });

      // ======================
      // HOVER PREVIEW
      // ======================
      marker.on("mouseover", () => {

        marker.bindPopup(`
          <b>${item.name}</b><br>
          ${item.type || ""}<br>
          ${item.year || ""}
        `).openPopup();

      });

      markers.addLayer(marker);

      // ======================
      // SIDEBAR LIST
      // ======================
      if (sidebar) {

        const div = document.createElement("div");
        div.className = "object-card";
        div.innerHTML = `
          <b>${item.name}</b><br>
          <small>${item.type || ""} | ${item.year || ""}</small>
        `;

        div.onclick = () => {
          map.setView([item.lat, item.lng], 15);
          loadWikipedia(item.name);
          showWhyItMatters(item);
        };

        sidebar.appendChild(div);

      }

    });

}

// ======================
// WIKIPEDIA (SAFE)
// ======================

async function loadWikipedia(title) {

  const panel = document.getElementById("details");
  panel.innerHTML = "<p>Loading Wikipedia...</p>";

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

    const summary = makeAISummary(data.extract);

    panel.innerHTML = `
      <h3>${data.title}</h3>
      ${data.thumbnail ? `<img src="${data.thumbnail.source}" style="width:100%;border-radius:8px;">` : ""}
      <p>${summary}</p>
      <a href="${data.content_urls?.desktop?.page}" target="_blank">Wikipedia →</a>
    `;

  } catch (e) {

    panel.innerHTML = "<p>Wikipedia error</p>";

  }

}

// ======================
// 🧠 AI SUMMARY
// ======================

function makeAISummary(text) {

  if (!text) return "No description available.";

  const sentences = text.split(". ");

  return sentences.slice(0, 2).join(". ") + ".";

}

// ======================
// 🧠 WHY IT MATTERS (AI LAYER)
// ======================

function showWhyItMatters(item) {

  const panel = document.getElementById("details");

  const text = `
    <hr>
    <h4>Why it matters</h4>
    <p>
      ${item.name} represents a key part of Chicago’s ${item.type || "urban"} development.
      It reflects historical growth patterns and architectural evolution of the city.
    </p>
  `;

  panel.innerHTML += text;

}
