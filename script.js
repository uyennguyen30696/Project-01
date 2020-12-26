// Google map API key
// var APIKey = "AIzaSyC680UklKEr_A2g5vrcu9R1x1ziJir4GBU";

// Restaurant addresses 
var addressArray = [];

var buttonToAddressMapping = {};

var convertedCurrentAddressArray = [];
console.log(convertedCurrentAddressArray);

let storedResultsArray = []

var clearPreviousSearchBtn = $('<button id="clear-previous-search">Clear history</button>');
function init() {
    var storedResults = localStorage.getItem('storedResults');
    // $('.top5picks').html("Previous Search")
    $('.container-top5picks').removeClass('hide');
    $('.clear-button').append(clearPreviousSearchBtn);

    $('#clear-previous-search').on('click', function (event) {
        event.preventDefault();
        localStorage.clear();
        $('.results').addClass("hide");
        $('.top5picks').addClass("hide");
    });

    if (storedResults === null) {
        var noResults = $('<p class="bubble-pastResults"><br><br>Never used <span class="restName">Food Hunt </span>before? <br> Give it a try!</p>')
        console.log(noResults)
        $('.results').append(noResults)
        $('#clear-previous-search').remove();
    }
    else {
        var joinedResults = storedResults.split(",").join("")
        $('.results').append(joinedResults)
    }
}

init();

// Function to determine user current location
navigator.geolocation.getCurrentPosition(function (currentPosition) {

    console.log(currentPosition);

    var currentLat = currentPosition.coords.latitude;
    console.log("user current lat " + currentLat);

    var currentLon = currentPosition.coords.longitude;
    console.log("user current lon " + currentLon);

    // var map = L.map("map").setView([0, 0], 1); (If want the map to be in full
    // initMap(currentPosition.coords);
    var map = L.map('map', {
        center: [currentLat, currentLon],
        zoom: 11
    });

    L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=1cDoXwZ3HkYYDyqg9QkZ", {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);

    // Add marker for user current location
    L.marker([currentLat, currentLon]).addTo(map);
    // Add pop up on top of the user current location marker
    L.marker([currentLat, currentLon]).addTo(map)
        .bindPopup('You are here')
        .openPopup()

    // Convert user current coordinates to address
    var mapQuestAPIKey = "MFvntZWuvS2jATIO4K9Rwvvg9TnAi8u3";
    var queryMQURL = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + mapQuestAPIKey + "&location=" + currentLat + "," + currentLon + "&includeRoadMetadata=true&includeNearestIntersection=true";
    $.ajax({
        url: queryMQURL,
        method: "GET"
    }).then(function (coordsToAddress) {
        console.log(coordsToAddress);

        var convertedAddress = coordsToAddress.results[0].locations[0].street;
        convertedCurrentAddressArray.push(convertedAddress);
        console.log(coordsToAddress.results[0].locations[0].street);
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var cityInput = document.querySelector('.cityInput')
    var cuisineInput = document.querySelector('.cuisineInput')
    var zomatoAPI = 'c61ed7f7b90c2b61c273faede7a9d47c'

    var restArray = []

    var markers = []
    var markerGroup = L.layerGroup(markers).addTo(map)

    var routeLayers = []
    var routeGroup = L.layerGroup(routeLayers).addTo(map)

    // when search button is clicked
    $('.searchBtn').on('click', function (event) {
        event.preventDefault()
        console.log(map)

        $('.top5picks').removeClass("hide");
        $('.results').removeClass('hide');
        $('.clear-button').append(clearPreviousSearchBtn);
        $('#clear-previous-search').on('click', function (event) {
            event.preventDefault();
            localStorage.clear();
            $('.results').addClass("hide");
            $('.top5picks').addClass("hide");
        });

        // This will clear the old markers and the new markers are added after the user search again (followed by the code down the for loop)
        if (markers.length) {
            markers = []
            markerGroup.clearLayers()

            routeLayers = []
            routeGroup.clearLayers()

        }

        var citySearch = cityInput.value
        var cuisineSearch = cuisineInput.value
        var capitalCuisineSearch = cuisineSearch.charAt(0).toUpperCase() + cuisineSearch.slice(1)

        var cityUrl = "https://developers.zomato.com/api/v2.1/cities?q=" + citySearch

        $.ajax({
            url: cityUrl,
            method: 'GET',
            headers: {
                "user-key": zomatoAPI
            }
        }).then(function (cityResponse) {
            console.log(cityResponse)
            console.log(cityResponse.location_suggestions[0].id)
            var cityId = cityResponse.location_suggestions[0].id

            var cuisineUrl = "https://developers.zomato.com/api/v2.1/cuisines?city_id=" + cityId

            // gets users city
            $.ajax({
                url: cuisineUrl,
                method: 'GET',
                headers: {
                    "user-key": zomatoAPI
                }
            }).then(function (cuisineResponse) {
                console.log(cuisineResponse)

                for (var i = 0; i < cuisineResponse.cuisines.length; i++) {
                    if (cuisineResponse.cuisines[i].cuisine.cuisine_name === capitalCuisineSearch) {
                        var cuisineId = cuisineResponse.cuisines[i].cuisine.cuisine_id
                        console.log(cuisineId)
                    }
                }

                var searchUrl = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityId + "&entity_type=city&count=5" + "&lat=" + currentLat + "&lon=" + currentLon + "&cuisines=" + cuisineId

                // combines city and cuisine id for restaurant search
                $.ajax({
                    url: searchUrl,
                    method: 'GET',
                    headers: {
                        "user-key": zomatoAPI
                    }
                }).then(function (searchResponse) {
                    console.log(searchResponse)

                    $('.results').empty()
                    $('.top5picks').html("Top 5 Picks")

                    storedResultsArray = []

                    // gets info from response to put on each card
                    for (var i = 0; i < searchResponse.restaurants.length; i++) {
                        console.log(searchResponse.restaurants[i].restaurant.name)
                        restArray.push(searchResponse.restaurants[i])

                        var restName = "<div class='restName'>" + searchResponse.restaurants[i].restaurant.name + "</div>"
                        var restAddress = "<div>Address: " + searchResponse.restaurants[i].restaurant.location.address + "</div>"
                        var restRating = "<div>Rating: " + searchResponse.restaurants[i].restaurant.user_rating.aggregate_rating + "</div>"
                        var restPhone = "<div>Phone: " + searchResponse.restaurants[i].restaurant.phone_numbers.substring(0, 14) + "</div>"

                        // Add get direction clickable for each restaurant
                        var getDirectionButton = $("<button class='get-direction'>");
                        getDirectionButton.text("Get direction");
                        getDirectionButton.css("textDecoration", "underline");
                        // $(".get-direction").attr("href", "map.html");
                        getDirectionButton.attr("data-address", searchResponse.restaurants[i].restaurant.location.address);

                        // Assign id for each get direction button (direction-1 to direction-5)
                        var customID = "direction-" + String(i);
                        getDirectionButton.attr("id", customID);
                        // Assign id for each get direction button (direction-1 to direction-5)
                        // var i = 0;
                        // $(".get-direction").each(function () {
                        // $(this).attr("id", customID);
                        // i++;

                        console.log(this);
                        buttonToAddressMapping[customID] = searchResponse.restaurants[i].restaurant.location.address;
                        console.log("KeyValue: " + JSON.stringify(buttonToAddressMapping));

                        // Make restaurant addresses global
                        addressArray.push(searchResponse.restaurants[i].restaurant.location.address);

                        var eachresult = $('<div class="card restaurant">')
                        eachresult.attr("data-restaurantName", searchResponse.restaurants[i].restaurant.name)
                        $(eachresult).append(restName, restAddress, restRating, restPhone, getDirectionButton);
                        $('.results').append(eachresult)

                        console.log(restArray)

                        storedResultsArray.push("<div class='card pastResults'>" + restName + restAddress + restRating + restPhone + '</div>')
                        localStorage.setItem('storedResults', storedResultsArray);

                        // storedResultsArray.push(JSON.stringify(eachresult))
                        // localStorage.setItem('storedResults', storedResultsArray)

                        // Map start here
                        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

                        // Restaurants' lat and lon
                        var restLat = searchResponse.restaurants[i].restaurant.location.latitude;
                        console.log("restaurant lat " + restLat);
                        var restLon = searchResponse.restaurants[i].restaurant.location.longitude;
                        console.log("restaurant lon " + restLon);

                        // Marker color is changed thanks to an open source project from https://awesomeopensource.com/project/pointhi/leaflet-color-markers
                        var redIcon = new L.Icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });

                        // This add new markers after user hit search again, the old markers are cleared from the code under the onclick function of the search button
                        markerRestaurant = L.marker([restLat, restLon], { icon: redIcon })
                            .bindPopup(searchResponse.restaurants[i].restaurant.name)
                            .openPopup()

                        markers.push(markerRestaurant)
                        markerGroup = L.layerGroup(markers).addTo(map)
                    }

                    // When get direction button is clicked
                    $(".get-direction").on("click", function (event) {
                        event.preventDefault();

                        // Jump to map view
                        window.location = "#map";

                        routeLayers = []
                        routeGroup.clearLayers()
                        console.log("ButtonId is: " + this.id);
                        console.log("Address is: " + buttonToAddressMapping[this.id]);
                        event.preventDefault();
                        var restaurantAddress = buttonToAddressMapping[this.id];

                        if (map) {
                            map.remove();
                            getRoute();
                        }

                        // Add direction from current location to each restaurant corresding to each get direction button
                        function getRoute() {

                            // Recreating new map layer
                            map = L.map('map', {
                                center: [currentLat, currentLon],
                                zoom: 11
                            });
                            L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=1cDoXwZ3HkYYDyqg9QkZ", {
                                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                            }).addTo(map);

                            // Add marker for user current location
                            L.marker([currentLat, currentLon]).addTo(map);
                            // Add pop up on top of the user current location marker
                            L.marker([currentLat, currentLon]).addTo(map)
                                .bindPopup('You are here')
                                .openPopup()

                            var start = JSON.stringify(convertedCurrentAddressArray);
                            var end = restaurantAddress;

                            dir = MQ.routing.directions();
                            // var latlng = L.latLng(currentLat, currentLon)
                            dir.route({
                                locations: [
                                    start,
                                    end
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

                            var routeLayer = new CustomRouteLayer({
                                directions: dir,
                                fitBounds: true,
                                ribbonOptions: {
                                    ribbonDisplay: { color: '#0085CC' },
                                }
                            })
                            // map.addLayer(routeLayer);
                            routeLayers.push(routeLayer);
                            routeGroup.addLayer(routeLayer).addTo(map)
                        }
                    });

                    // click event for each result card
                    $('.restaurant').on('click', function (event) {
                        event.stopPropagation()
                        console.log($(this).data("restaurantname"))
                        $('.menu').remove()

                        // Future development
                        /* for (var i = 0; i < restArray.length; i++) {

                            if ($(this).data("restaurantname") === restArray[i].restaurant.name) {

                                // gets error, not sure if its possible to do --> photos
                                console.log(restArray[i].restaurant.photos_url)

                                // var photos = restArray[i].restaurant.photos_url
                                // var photosEl = $('<img>')
                                // photosEl.attr('src', photos)
                                // $(this).append(photosEl)

                                // link to menu --> open in new tab 
                                console.log(restArray[i].restaurant.menu_url)
                                var menu = $('<a class="menu" href=' + restArray[i].restaurant.menu_url + ' target="_blank">Link to menu</a>')

                                $(this).append(menu)

                            }
                        } */
                    })
                })

            })
        })

    })

});
