console.log("START HARD DEBUG");

Cesium.Ion.defaultAccessToken = "PASTE_TOKEN";

window.onload = function () {

  const viewer = new Cesium.Viewer("cesiumContainer", {

    animation: false,
    timeline: false

  });

  console.log("VIEWER OK");

  // HUGE RED BILLBOARD
  viewer.entities.add({

    position: Cesium.Cartesian3.fromDegrees(
      -87.6298,
      41.8781,
      0
    ),

    billboard: {

      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Red_circle.svg",

      width: 80,
      height: 80

    }

  });

  console.log("BILLBOARD ADDED");

  // FORCE CAMERA
  viewer.camera.setView({

    destination: Cesium.Cartesian3.fromDegrees(
      -87.6298,
      41.8781,
      5000
    )

  });

  console.log("CAMERA SET");

};
