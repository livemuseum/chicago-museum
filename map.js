// создаём карту (Chicago)
const map = L.map('map').setView([41.8781, -87.6298], 11);

// OpenStreetMap слой (БЕЗ токенов)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// данные (можешь расширять до 1000 объектов)
fetch("locations.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(loc => {
      L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(`
          <b>${loc.name}</b><br>
          ${loc.year || ""}<br>
          ${loc.type || ""}
        `);
    });
  })
  .catch(err => console.error("Error loading data:", err));
