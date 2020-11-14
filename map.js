// Restaurant addresses 
// var addressArray = [];
// console.log(addressArray);

// Current coords global
// var currentLocationArray = [];
// console.log(currentLocationArray);

// var currentLatArray = [];
// console.log(currentLatArray);
// var currentLonArray = [];
// console.log(currentLonArray);

var convertedCurrentAddressArray = [];
console.log(convertedCurrentAddressArray);

navigator.geolocation.getCurrentPosition(function (currentPosition) {

    console.log(currentPosition);
    // currentLocationArray.push(currentPosition);


    var currentLat = currentPosition.coords.latitude;
    console.log("user current lat " + currentLat);
    currentLocationArray.push(currentLat);

    var currentLon = currentPosition.coords.longitude;
    console.log("user current lon " + currentLon);
    currentLocationArray.push(currentLon);

    // Convert user current coordinates to address
    var mapQuestAPIKey = "MFvntZWuvS2jATIO4K9Rwvvg9TnAi8u3";
    var queryMQURL = "http://www.mapquestapi.com/geocoding/v1/reverse?key=" + mapQuestAPIKey + "&location=" + currentLat + "," + currentLon + "&includeRoadMetadata=true&includeNearestIntersection=true";
    $.ajax({
        url: queryMQURL,
        method: "GET"
    }).then(function (coordsToAddress) {
        console.log(coordsToAddress);

        var convertedAddress = coordsToAddress.results[0].locations[0].street;
        convertedCurrentAddressArray.push(convertedAddress);
        console.log(coordsToAddress.results[0].locations[0].street);

        // var latLng = L.latLng(currentLat, currentLon);

        var map = L.map('restaurant-map', {
            center: [currentLat, currentLon],
            zoom: 12
        });

        L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=1cDoXwZ3HkYYDyqg9QkZ", {
            attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        }).addTo(map);

        // Add direction from current location to restaurant
        dir = MQ.routing.directions();
        // var latlng = L.latLng(currentLat, currentLon)
        dir.route({
            locations: [
                // '37.421056,-121.8445312',
                // (currentLocationArray),
                // console.log((currentLocationArray)),
                // (currentLatArray) + (currentLonArray),
                // console.log((currentLatArray) + (currentLonArray)),
                // (currentLat).toString(), (currentLon).toString(),
                // console.log((currentLat).toString(), (currentLon).toString()),
                // currentLocationArray.toString(),
                // console.log(currentLocationArray.toString()),
                // center.toString(),
                // console.log(center.toString()),
                // convertedAddressArray,
                // console.log(convertedAddressArray),
                // convertedAddress,
                JSON.stringify(convertedCurrentAddressArray),
                '37.3359861111,-121.8941333333'
            ],
            options: { avoids: ['toll road'] }
        });

        CustomRouteLayer = MQ.Routing.RouteLayer.extend({
            createStopMarker: function (location, stopNumber) {
                var custom_icon,
                    marker;

                custom_icon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                marker = L.marker(location.latLng, { icon: custom_icon })
                    // .bindPopup()
                    .openPopup()
                    .addTo(map);

                return marker;
            }
        });

        map.addLayer(new CustomRouteLayer({
            directions: dir,
            fitBounds: true,
            ribbonOptions: {
                ribbonDisplay: { color: '#0085CC' },
            }
        }));
    });
});


