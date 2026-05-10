console.log("🟣 CESIUM MINIMAL START");

// ======================
// TOKEN
// ======================

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODY0NzU0OC1hOGExLTQ2ZWMtYTMzMC0zMDQ3MzhkMjM5OTAiLCJpZCI6NDI5NjI4LCJpc3MiOiJodHRwczovL2lvbi5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3Nzg0MjYxNTR9.K4dqI6rl15tmHWb9JB49MzZ-BKydnlGNpUnWZ-Wt_QM";

// ======================
// GLOBAL
// ======================

let viewer;

// ======================
// START
// ======================

window.addEventListener("load", start);

function start() {

  console.log("WINDOW READY");

  try {

    // ======================
    // SIMPLE VIEWER
    // ======================

    viewer = new Cesium.Viewer("cesiumContainer", {

      animation: false,
      timeline: false,

      terrain: undefined

    });

    console.log("🗺 VIEWER READY");

    // ======================
    // TEST OBJECT 1
    // ======================

    const e1 = viewer.entities.add({

      name: "Chicago",

      position: Cesium.Cartesian3.fromDegrees(
        -87.6298,
        41.8781,
        0
      ),

      point: {
        pixelSize: 20,
        color: Cesium.Color.RED
      },

      label: {
        text: "CHICAGO",
        font: "20px sans-serif",
        fillColor: Cesium.Color.WHITE,
        showBackground: true
      }

    });

    console.log("✅ TEST ENTITY ADDED");

    // ======================
    // CAMERA FORCE
    // ======================

    viewer.camera.flyTo({

      destination: Cesium.Cartesian3.fromDegrees(
        -87.6298,
        41.8781,
        20000
      )

    });

    console.log("📷 CAMERA MOVED");

  } catch (e) {

    console.error("❌ ERROR:", e);

  }

}
