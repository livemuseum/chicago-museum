// ======================
// 🟣 MUSEUM PRO 3D AI
// FINAL STABLE CESIUM VERSION
// ======================

console.log("🟣 MUSEUM PRO 3D AI START");

// ======================
// 🔑 CESIUM TOKEN
// ======================

// REPLACE WITH YOUR TOKEN
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODY0NzU0OC1hOGExLTQ2ZWMtYTMzMC0zMDQ3MzhkMjM5OTAiLCJpZCI6NDI5NjI4LCJpc3MiOiJodHRwczovL2lvbi5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3Nzg0MjYxNTR9.K4dqI6rl15tmHWb9JB49MzZ-BKydnlGNpUnWZ-Wt_QM";

// ======================
// GLOBALS
// ======================

let viewer = null;
let allData = [];

// ======================
// START APP
// ======================

window.addEventListener("load", async () => {

  console.log("WINDOW READY");

  await initCesium();

  await loadData();

});

// ======================
// INIT CESIUM
// ======================

async function initCesium() {

  try {

    viewer = new Cesium.Viewer("cesiumContainer", {

      terrain: Cesium.Terrain.fromWorldTerrain(),

      animation: false,
      timeline: false,

      baseLayerPicker: true,
      geocoder: true,
      sceneModePicker: true,
      navigationHelpButton: false,

      shouldAnimate: true

    });

    // Better atmosphere
    viewer.scene.globe.enableLighting = true;

    console.log("🗺 CESIUM READY");

  } catch (err) {

    console.error("❌ CESIUM INIT ERROR:", err);

  }

}

// ======================
// LOAD DATA
// ======================

async function loadData() {

  try {

    const response = await fetch(
      "./data/locations.json?v=" + Date.now()
    );

    const data = await response.json();

    allData = data;

    console.log("📦 DATA LOADED:", allData.length);

    renderEntities();

  } catch (err) {

    console.error("❌ DATA LOAD ERROR:", err);

  }

}

// ======================
// RENDER ENTITIES
// ======================

function renderEntities() {

  if (!viewer) {
    console.error("Viewer not ready");
    return;
  }

  allData.forEach(o => {

    addEntity(o);

  });

  // AUTO ZOOM TO ALL OBJECTS
  viewer.zoomTo(viewer.entities);

  console.log("📍 ENTITIES RENDERED");

}

// ======================
// ADD ENTITY
// ======================

function addEntity(o) {

  if (!o.lat || !o.lng) {

    console.warn("BAD OBJECT:", o);
    return;

  }

  const entity = viewer.entities.add({

    name: o.name,

    position: Cesium.Cartesian3.fromDegrees(
      Number(o.lng),
      Number(o.lat),
      0
    ),

    point: {
      pixelSize: 12,
      color: getColor(o.type),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    },

    label: {
      text: o.name,
      font: "14px sans-serif",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -18),
      scale: 0.6
    }

  });

  // AI DESCRIPTION
  entity.description = buildAI(o);

  console.log("✅ ADDED:", o.name);

}

// ======================
// COLOR SYSTEM
// ======================

function getColor(type) {

  const colors = {

    church: Cesium.Color.CRIMSON,
    skyscraper: Cesium.Color.DODGERBLUE,
    historic: Cesium.Color.ORANGE,
    district: Cesium.Color.LIMEGREEN

  };

  return colors[type] || Cesium.Color.GRAY;

}

// ======================
// 🧠 AI DESCRIPTION
// ======================

function buildAI(o) {

  return `
    <div style="font-family:Arial; max-width:400px;">

      <h2>${o.name}</h2>

      <p>
        <b>Type:</b> ${o.type || "unknown"}
      </p>

      <p>
        <b>Year:</b> ${o.year || "unknown"}
      </p>

      <hr/>

      <p>
        This location represents part of Chicago’s
        historical and architectural evolution.
      </p>

      <p>
        AI Museum Insight:
        The site contributes to the spatial identity
        and cultural memory of the city.
      </p>

    </div>
  `;

}
