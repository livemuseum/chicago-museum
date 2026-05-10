alert("NEW MAP JS LOADED");

console.log("🟣 MUSEUM PRO FINAL");

Cesium.Ion.defaultAccessToken = "PASTE_TOKEN_HERE";

let viewer;
let allData = [];

// ======================
// START
// ======================

window.onload = async function () {

  viewer = new Cesium.Viewer("cesiumContainer", {

    animation: false,
    timeline: false,

    terrain: undefined

  });

  console.log("🗺 VIEWER READY");

  viewer.scene.globe.depthTestAgainstTerrain = false;

  loadData();

};

// ======================
// LOAD JSON
// ======================

async function loadData() {

  try {

    const response = await fetch(
      "./data/locations.json?v=" + Date.now()
    );

    allData = await response.json();

    console.log("📦 DATA:", allData.length);

    render();

  } catch (e) {

    console.error("DATA ERROR:", e);

  }

}

// ======================
// RENDER
// ======================

function render() {

  allData.forEach(addObject);

  viewer.zoomTo(viewer.entities);

}

// ======================
// ADD OBJECT
// ======================

function addObject(o) {

  if (!o.lat || !o.lng) return;

  const entity = viewer.entities.add({

    name: o.name,

    position: Cesium.Cartesian3.fromDegrees(
      Number(o.lng),
      Number(o.lat),
      0
    ),

    // BIG VISIBLE ICON
    billboard: {

      image:
        "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",

      width: 32,
      height: 32,

      verticalOrigin: Cesium.VerticalOrigin.BOTTOM

    },

    label: {

      text: o.name,

      font: "16px sans-serif",

      showBackground: true,

      scale: 0.6,

      pixelOffset: new Cesium.Cartesian2(0, -40)

    }

  });

  // INFO PANEL
  entity.description = buildDescription(o);

  console.log("✅ ADDED:", o.name);

}

// ======================
// AI DESCRIPTION
// ======================

function buildDescription(o) {

  return `
    <div style="font-family:Arial;max-width:400px;">

      <h2>${o.name}</h2>

      <p>
        <b>Type:</b> ${o.type || "historic"}
      </p>

      <p>
        <b>Year:</b> ${o.year || "unknown"}
      </p>

      <hr/>

      <p>
        This site is part of Chicago's
        architectural and cultural evolution.
      </p>

      <p style="color:gray;">
        AI Insight:
        This location contributes to the
        historical identity of the city.
      </p>

    </div>
  `;

}
