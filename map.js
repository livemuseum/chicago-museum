console.log("🟣 MUSEUM PRO 3D AI START");

// ======================
// CESIUM INIT
// ======================

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
  animation: false,
  timeline: false
});

// ======================
// LOAD DATA
// ======================

fetch("./data/locations.json")
  .then(r => r.json())
  .then(data => {

    console.log("DATA LOADED:", data.length);

    data.forEach(addEntity);

  });

// ======================
// ADD 3D ENTITIES
// ======================

function addEntity(o) {

  const entity = viewer.entities.add({

    name: o.name,

    position: Cesium.Cartesian3.fromDegrees(o.lng, o.lat, 0),

    point: {
      pixelSize: 10,
      color: Cesium.Color.ORANGE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    }

  });

  entity.description = generateAI(o);

}

// ======================
// AI ENGINE (WHY IT MATTERS)
// ======================

function generateAI(o) {

  return `
    <h3>${o.name}</h3>

    <p><b>Type:</b> ${o.type || "unknown"}</p>
    <p><b>Year:</b> ${o.year || "unknown"}</p>

    <hr>

    <p>
      This location represents a key element in the urban evolution of Chicago.
      It reflects architectural, cultural and historical development patterns.
    </p>

    <p style="color:gray;">
      AI Museum Insight: This structure contributes to the spatial narrative
      of the city’s historical expansion.
    </p>
  `;
}
