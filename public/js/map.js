mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    projection: 'globe',
    zoom: 7, // initial zoom level, 0 is the world view, higher values zoom in
    center: listing.geometry.coordinates, // center the map on this longitude and latitude
});

const marker = new mapboxgl.Marker({
        color: 'red',
        rotation: 45
    })
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({
            offset: 25
        })
        .setHTML(
            `<h4>${listing.title}</h4><p>Exact location after booking</p>`
        ))
    .addTo(map);