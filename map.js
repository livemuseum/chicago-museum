console.log("MAP JS START SAFE MODE");

// ждём пока Leaflet точно загрузится
function init() {

  if (typeof L === "undefined") {
    console.log("Leaflet not ready, retry...");
    setTimeout(init, 100);
    return;
  }

  console.log("Leaflet OK");

  const map = L.map('map').setView([41.8781, -87.6298], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const test = [
    [41.8781, -87.6298],
    [41.8819, -87.6278],
    [41.885, -87.62]
  ];

  test.forEach(p => {
    L.marker(p).addTo(map)
      .bindPopup("TEST POINT");
  });

  console.log("MAP READY");
}

init();
