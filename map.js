console.log("ABSOLUTE TEST START");

Cesium.Ion.defaultAccessToken = "PASTE_TOKEN_HERE";

window.onload = async function () {

  // CREATE VIEWER
  const viewer = new Cesium.Viewer("cesiumContainer", {

    animation: false,
    timeline: false,

    terrain: undefined

  });

  console.log("VIEWER OK");

  // DISABLE DEPTH TEST
  viewer.scene.globe.depthTestAgainstTerrain = false;

  // HUGE ENTITY
  viewer.entities.add({

    name: "GIANT TEST",

    position: Cesium.Cartesian3.fromDegrees(
      -87.6298,
      41.8781,
      1000
    ),

    ellipsoid: {

      radii: new Cesium.Cartesian3(
        3000,
        3000,
        3000
      ),

      material: Cesium.Color.RED.withAlpha(0.9)

    }

  });

  console.log("ENTITY ADDED");

  // FORCE CAMERA VERY CLOSE
  viewer.camera.setView({

    destination: Cesium.Cartesian3.fromDegrees(
      -87.6298,
      41.8781,
      15000
    )

  });

  console.log("CAMERA SET");

};
