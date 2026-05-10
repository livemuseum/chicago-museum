console.log("🟣 MUSEUM PRO 3D AI START");

let viewer = null;
let isReady = false;
let queue = [];
let allData = [];

// ======================
// START
// ======================

window.addEventListener("load", () => {
  initCesium();
  loadData();
});

// ======================
// CESIUM INIT
// ======================

async function initCesium() {

  try {

    viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider: await Cesium.Terrain.fromWorldTerrain(),
      animation: false,
      timeline: false
    });

    isReady = true;

    console.log("🗺 CESIUM READY");

    // flush queue
    queue.forEach(fn => fn());
    queue = [];

  } catch (e) {

    console.error("CESIUM INIT ERROR:", e);

  }

}

// ======================
// LOAD DATA
// ======================

function loadData() {

  fetch("./data/locations.json?v=" + Date.now())
    .then(r => r.json())
    .then(data => {

      allData = data;

      console.log("📦 DATA LOADED:", allData.length);

      render();

    })
    .catch(err => console.error("DATA ERROR:", err));

}

// ======================
// SAFE EXEC (WAIT FOR CESIUM)
// ======================

function safe(fn) {

  if (!isReady) {
    queue.push(fn);
    return;
  }

  fn();

}

// ======================
// RENDER
// ======================

function render() {

  allData.forEach(o => {

    safe(() => addEntity(o));

  });

}

// ======================
// ADD ENTITY
// ======================

function addEntity(o) {

  if (!viewer) return;

  if (!o.lat || !o.lng) {
    console.warn("BAD DATA:", o);
    return;
  }

  viewer.entities.add({

    name: o.name,

    position: Cesium.Cartesian3.fromDegrees(o.lng, o.lat),

    point: {
      pixelSize: 12,
      color: getColor(o.type),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    }

  });

  console.log("ADDED:", o.name);

}

// ======================
// COLORS
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
