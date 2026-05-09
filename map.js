document.body.innerHTML = "MAP JS IS RUNNING";
console.log("MAP.JS STARTED");
console.log("MAP LOADED OK");

const map = L.map('map').setView([41.8781, -87.6298], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// TEST MARKERS (ДОЛЖНЫ ПОЯВИТЬСЯ)
const test = [
  [41.8781, -87.6298],
  [41.8819, -87.6278],
  [41.885, -87.62]
];

test.forEach(p => {
  L.marker(p).addTo(map)
    .bindPopup("TEST POINT");
});
