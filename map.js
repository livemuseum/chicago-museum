mapboxgl.accessToken = "pk.eyJ1IjoiZ2VuYW94YW5hOCIsImEiOiJjbW95M2tvYW8wNm81MnNvcG80cjh4Mmh6In0.em6KIlaTIceoYthHG5Ar6A";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-87.6298, 41.8781],
  zoom: 11
});

let locations = [];

fetch("locations.json")
  .then(r => r.json())
  .then(data => {
    locations = data;
    render(locations);
  });

function render(data) {
  data.forEach(loc => {
    new mapboxgl.Marker()
      .setLngLat([loc.lng, loc.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<b>${loc.name}</b><br>${loc.year}`
        )
      )
      .addTo(map);
  });
}
