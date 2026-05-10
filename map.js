console.log("🟣 MUSEUM PRO 3D AI START");

// ======================
// CHECK CESIUM
// ======================

if (typeof Cesium === "undefined") {
  console.error("❌ Cesium not loaded. Check CDN script in HTML.");
}

// ======================
// START APP
// ======================

window.addEventListener("load", async () => {

  console.log("WINDOW READY");

  await initCesium();
  loadData();

});

// ======================
// CESIUM INIT (FIXED - NO createWorldTerrain)
// ======================

async function initCesium() {

  try {

    const viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: await Cesium.Terrain.fromWorldTerrain(),
      animation: false,
      timeline: false,
      shouldAnimate: true
    });

    window.viewer = viewer; // make global for debug

    console.log("🗺 CESIUM READY");

    // TEST ENTITY (Chicago)
    viewer.entities.add({
      name: "Chicago Test",
      position: Cesium.Cartesian3.fromDegrees(-87.6298, 41.8781),
      point: {
        pixelSize: 15,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      }
    });

  } catch (err) {

    console.error("❌ CESIUM INIT ERROR:", err);

  }

}

// ======================
// LOAD DATA
// ======================

function loadData() {

  fetch("./data/locations.json?v=" + Date.now())
    .then(r => r.json())
    .then(data => {

      console.log("📦 DATA LOADED:", data.length);

      data.forEach(addEntity);

    })
    .catch(err => console.error("DATA ERROR:", err));

}

// ======================
// ADD ENTITIES
// ======================

function addEntity(o) {

  if (!window.viewer) {
    console.warn("Viewer not ready yet");
    return;
  }

  const entity = viewer.entities.add({

    name: o.name,

    position: Cesium.Cartesian3.fromDegrees(o.lng, o.lat),

    point: {
      pixelSize: 12,
      color: getColor(o.type),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    }

  });

  entity.description = buildAI(o);

}

// ======================
// COLOR SYSTEM
// ======================

function getColor(type) {

  const map = {
    church: Cesium.Color.CRIMSON,
    skyscraper: Cesium.Color.DODGERBLUE,
    historic: Cesium.Color.ORANGE,
    district: Cesium.Color.GREEN
  };

  return map[type] || Cesium.Color.GRAY;

}

// ======================
// 🧠 AI MUSEUM DESCRIPTION
// ======================

function buildAI(o) {

  return `
    <h2>${o.name}</h2>

    <p><b>Type:</b> ${o.type || "unknown"}</p>
    <p><b>Year:</b> ${o.year || "unknown"}</p>

    <hr/>

    <p>
      This location is part of Chicago’s historical urban fabric.
      It represents architectural and cultural development patterns
      across different eras of the city.
    </p>

    <p style="color:gray;">
      AI Insight: This structure contributes to spatial evolution
      and historical identity of the city landscape.
    </p>
  `;

}
