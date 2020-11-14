
// Google map API key
// var APIKey = "AIzaSyC680UklKEr_A2g5vrcu9R1x1ziJir4GBU";
// var APIMapKey = "5b3ce3597851110001cf624823016920625e4e46933015e7a19f69e6";
// var queryDirectionURL = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + APIMapKey + "&start=" + "37.421056,-121.844531" + "&end=" + "37.335986,-121.894133";

// $.ajax({
//     url: queryDirectionURL,
//     method: "GET"
// }).then(function (directionResponse) {
//     console.log(directionResponse);
// });

// Global variables
// User current location
// var currentLatArray = [];
// console.log(currentLatArray);
// var currentLonArray = [];
// console.log(currentLonArray);

// Restaurant addresses 
var addressArray = [];
console.log(addressArray);

// Function to determine user current location
//check if geolocation is available
navigator.geolocation.getCurrentPosition(function (currentPosition) {

    console.log(currentPosition);

    var currentLat = currentPosition.coords.latitude;
    console.log("user current lat " + currentLat);
    // currentLatArray.push(currentLat);

    var currentLon = currentPosition.coords.longitude;
    console.log("user current lon " + currentLon);
    // currentLonArray.push(currentLon);

    // var map = L.map("map").setView([0, 0], 1); (If want the map to be in full screen)
    var map = L.map('map', {
        center: [currentLat, currentLon],
        zoom: 11
    });

    L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=1cDoXwZ3HkYYDyqg9QkZ", {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);

    // Add marker for user current location
    markerUser = L.marker([currentLat, currentLon]).addTo(map);
    // Add pop up on top of the user current location marker
    L.marker([currentLat, currentLon]).addTo(map)
        .bindPopup('You are here')
        .openPopup();

    // function openRouteMap() {
    var APIKey = "5b3ce3597851110001cf624823016920625e4e46933015e7a19f69e6";
    var queryURL = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + APIKey + "&start=8.681495,49.41461" + "&end=8.687872,49.420318";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });

    // }
    // openRouteMap();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var cityInput = document.querySelector('.cityInput')
    var cuisineInput = document.querySelector('.cuisineInput')
    var zomatoAPI = 'c61ed7f7b90c2b61c273faede7a9d47c'


    var markers = []
    var markerGroup = L.layerGroup(markers).addTo(map)

    $('.searchBtn').on('click', function (event) {
        event.preventDefault()

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });

        // }
        // openRouteMap();
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var cityInput = document.querySelector('.cityInput')
        var cuisineInput = document.querySelector('.cuisineInput')
        var zomatoAPI = 'c61ed7f7b90c2b61c273faede7a9d47c'


        var restArray = []

        var markers = []
        var markerGroup = L.layerGroup(markers).addTo(map)


        // when search button is clicked
        $('.searchBtn').on('click', function (event) {
            event.preventDefault()

            // This will clear the old markers and the new markers are added after the user search again (followed by the code down the for loop)
            if (markers.length) {
                markers = []
                markerGroup.clearLayers()
            }


            // This will clear the old markers and the new markers are added after the user search again (followed by the code down the for loop)
            if (markers.length) {
                markers = []
                markerGroup.clearLayers()
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

                    // gets cuisine id
                    $.ajax({
                        url: searchUrl,
                        method: 'GET',
                        headers: {
                            "user-key": zomatoAPI
                        }
                    }).then(function (searchResponse) {
                        console.log(searchResponse)

                        $('.results').empty()

                        for (var i = 0; i < searchResponse.restaurants.length; i++) {
                            console.log(searchResponse.restaurants[i].restaurant.name)

                            // Pass address to empty array
                            addressArray.push(searchResponse.restaurants[i].restaurant.location.address);

                            var restName = "<div class='restName'>" + searchResponse.restaurants[i].restaurant.name + "</div>"
                            var restAddress = "<div>Address: " + searchResponse.restaurants[i].restaurant.location.address + "</div>"
                            var restRating = "<div>Rating: " + searchResponse.restaurants[i].restaurant.user_rating.aggregate_rating + "</div>"
                            var restPhone = "<div>Phone: " + searchResponse.restaurants[i].restaurant.phone_numbers + "</div><hr>"

                            // Add get direction clickable for each restaurant
                            var getDirectionButton = "<a class='get-direction'>";
                            $(".get-direction").text("Get direction");
                            $(".get-direction").css("textDecoration", "underline");
                            $(".get-direction").attr("href", "map.html");

                            var eachresult = $('<div class="card-restaurant">')
                            $(eachresult).append(restName, restAddress, restRating, restPhone, getDirectionButton)
                            $('.results').append(eachresult)

                            $('.restaurant').on('click', function (event) {
                                event.stopPropagation()
                                console.log($(this).text())

                                // doesnt work
                                // console.log(searchResponse.$(this).restaurant.menu_url)

                            })

                            // Map start here
                            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                            // Pinpoint the restaurant locations on the map (end point or point B) (now in console)
                            var APIMapKey = "5b3ce3597851110001cf624823016920625e4e46933015e7a19f69e6";

                            var address = searchResponse.restaurants[i].restaurant.location.address;
                            var queryLocalityURL = "https://api.openrouteservice.org/geocode/search?api_key=" + APIMapKey + "&text=" + address;

                            $.ajax({
                                url: queryLocalityURL,
                                method: "GET"
                            }).then(function (localityResponse) {
                                console.log(localityResponse);
                            }).catch(function (error) {
                                console.log(error)
                            })

                            // Direction from start point, user current location (or point A) to end point, restaurant address (or point B) 
                            // Doesn't work yet
                            // Get user current location (point A)
                            var startLat = currentLat;
                            console.log(startLat)
                            var startLon = currentLon;
                            console.log(startLon)

                            // Get coordinates (lat and lon) of restaurant from Zomato (point B)
                            var endLat = searchResponse.restaurants[i].restaurant.location.latitude;
                            console.log("restaurant lat " + endLat);
                            var endLon = searchResponse.restaurants[i].restaurant.location.longitude;
                            console.log("restaurant lon " + endLon);

                            /* var queryDirectionURL = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + APIMapKey + "&start=" + startLat + "," + startLon + "&end=" + endLat + "," + endLon;
    
                             $.ajax({
                                url: queryDirectionURL,
                                method: "GET"
                            }).then(function (directionResponse) {
                                console.log(directionResponse);
                            }); */


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
                            markerRestaurant = L.marker([endLat, endLon], { icon: redIcon });

                            markers.push(markerRestaurant)
                            markerGroup = L.layerGroup(markers).addTo(map)

                            // Add pop up on top of the restaurant marker
                            // L.marker([endLat, endLon]).addTo(map)
                            //     .bindPopup(searchResponse.restaurants[i].restaurant.name)
                            //     .openPopup();
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

                            // gets info from response to put on each card
                            for (var i = 0; i < searchResponse.restaurants.length; i++) {
                                console.log(searchResponse.restaurants[i].restaurant.name)
                                restArray.push(searchResponse.restaurants[i])

                                var restName = "<div class='restName'>" + searchResponse.restaurants[i].restaurant.name + "</div>"
                                var restAddress = "<div>Address: " + searchResponse.restaurants[i].restaurant.location.address + "</div>"
                                var restRating = "<div>Rating: " + searchResponse.restaurants[i].restaurant.user_rating.aggregate_rating + "</div>"
                                var restPhone = "<div>Phone: " + searchResponse.restaurants[i].restaurant.phone_numbers + "</div>"


                                var eachresult = $('<div class="card restaurant">')
                                eachresult.attr("data-restaurantName", searchResponse.restaurants[i].restaurant.name)
                                $(eachresult).append(restName, restAddress, restRating, restPhone)
                                $('.results').append(eachresult)


                                console.log(restArray)

                                // Map start here
                                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                // Pinpoint the restaurant locations on the map (end point or point B) (now in console)
                                var APIMapKey = "5b3ce3597851110001cf624823016920625e4e46933015e7a19f69e6";

                                var address = searchResponse.restaurants[i].restaurant.location.address;
                                var queryLocalityURL = "https://api.openrouteservice.org/geocode/search?api_key=" + APIMapKey + "&text=" + address;

                                $.ajax({
                                    url: queryLocalityURL,
                                    method: "GET"
                                }).then(function (localityResponse) {
                                    console.log(localityResponse);
                                }).catch(function (error) {
                                    console.log(error)
                                })


                                // Direction from start point, user current location (or point A) to end point, restaurant address (or point B) 
                                // Doesn't work yet
                                // Get user current location (point A)
                                var startLat = currentLat;
                                console.log(startLat)
                                var startLon = currentLon;
                                console.log(startLon)

                                // Get coordinates (lat and lon) of restaurant from Zomato (point B)
                                var endLat = searchResponse.restaurants[i].restaurant.location.latitude;
                                console.log("restaurant lat " + endLat);
                                var endLon = searchResponse.restaurants[i].restaurant.location.longitude;
                                console.log("restaurant lon " + endLon);

                                var queryDirectionURL = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + APIMapKey + "&start=" + startLat + "," + startLon + "&end=" + endLat + "," + endLon;

                                $.ajax({
                                    url: queryDirectionURL,
                                    method: "GET"
                                }).then(function (directionResponse) {
                                    // console.log(directionResponse);
                                });


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
                                markerRestaurant = L.marker([endLat, endLon], { icon: redIcon })
                                    .bindPopup(searchResponse.restaurants[i].restaurant.name)
                                    .openPopup();

                                markers.push(markerRestaurant)
                                markerGroup = L.layerGroup(markers).addTo(map)

                            }


                            // click event for each result card
                            $('.restaurant').on('click', function (event) {
                                event.stopPropagation()
                                console.log($(this).data("restaurantname"))
                                $('.menu').remove()


                                for (var i = 0; i < restArray.length; i++) {

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

                                }







                            })

                        })


                    })

                })

            })

        })
    });
});

// {"coordinates":[[37.421056,-121.8445312],[37.3359861111,-121.8941333333]],"radiuses":[500,500]}

