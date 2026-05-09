const map = L.map('map').setView([41.8781, -87.6298], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

let markers = [];
let dataGlobal = [];

// загрузка данных
fetch("locations.json")
  .then(r => r.json())
  .then(data => {
    dataGlobal = data;
    render(data);
  });

function render(data) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng])
      .addTo(map)
      .bindPopup(`<b>${loc.name}</b><br>${loc.year}<br>${loc.type}`);

    markers.push(marker);
  });
}

// фильтр по типу
function filterType(type) {
  let filtered = dataGlobal;

  if (type !== 'all') {
    filtered = dataGlobal.filter(l => l.type === type);
  }

  render(filtered);
}

// поиск
document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();

  const filtered = dataGlobal.filter(l =>
    l.name.toLowerCase().includes(val)
  );

  render(filtered);
});

// таймлайн
document.getElementById("yearRange").addEventListener("input", e => {
  const year = parseInt(e.target.value);
  document.getElementById("yearLabel").innerText = "Year: " + year;

  const filtered = dataGlobal.filter(l => (l.year || 0) <= year);

  render(filtered);
});
