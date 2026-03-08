const mapDiv = document.getElementById("map");

if (mapDiv) {

   const listing = JSON.parse(mapDiv.dataset.coordinates);
   maptilersdk.config.apiKey = mapToken;
    

    const map = new maptilersdk.Map({
      container: 'map', // container id
      style: maptilersdk.MapStyle.STREETS,
      center: listing.geometry.coordinates, // starting position [lng, lat]
      zoom: 10 // starting zoom

      
    });

    new maptilersdk.Marker({color: 'red'})
    .setLngLat( listing.geometry.coordinates)//listing.geometry.coordinates m save karaye hai
    .setPopup(
         new maptilersdk.Popup({ offset: 25 })
         .setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`)
      )
    .addTo(map);
}