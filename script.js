
// Google map API key
// var APIKey = "AIzaSyC680UklKEr_A2g5vrcu9R1x1ziJir4GBU";

// Openrouteservice API key

function openRouteMap() {
    var APIKey = "5b3ce3597851110001cf624823016920625e4e46933015e7a19f69e6";
    var queryURL = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + APIKey + "&start=8.681495,49.41461" + "&end=8.687872,49.420318";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
      });
  
}
openRouteMap();

var cityInput = document.querySelector('.cityInput')
var cuisineInput = document.querySelector('.cuisineInput')
var zomatoAPI = 'c61ed7f7b90c2b61c273faede7a9d47c'


$('.searchBtn').on('click', function(event) {
    event.preventDefault()
    var citySearch = cityInput.value
    var cuisineSearch = cuisineInput.value
    // console.log(searched)

    var cityUrl = "https://developers.zomato.com/api/v2.1/cities?q=" + citySearch

    
    $.ajax({
        url: cityUrl,
        method: 'GET',
        headers: {
            "user-key": zomatoAPI
        }
    }).then(function(cityResponse){
        console.log(cityResponse)
        console.log(cityResponse.location_suggestions[0].id)
        var cityId = cityResponse.location_suggestions[0].id
        
        var cuisineUrl = "https://developers.zomato.com/api/v2.1/cuisines?city_id="+ cityId

        $.ajax({
            url: cuisineUrl,
            method: 'GET',
            headers: {
                "user-key": zomatoAPI
            }
        }).then(function(cuisineResponse){
            console.log(cuisineResponse)

            for (var i = 0; i < cuisineResponse.cuisines.length; i++) {
                if (cuisineResponse.cuisines[i].cuisine.cuisine_name === cuisineSearch) {
                    // works if uppercase first letter
                    var cuisineId = cuisineResponse.cuisines[i].cuisine.cuisine_id
                    console.log(cuisineId)
                }
            }
            
            var searchUrl = "https://developers.zomato.com/api/v2.1/search?entity_id="+cityId+ "&entity_type=city&count=5&cuisines="+cuisineId
    
            $.ajax({
                url: searchUrl,
                method: 'GET',
                headers: {
                    "user-key": zomatoAPI
                }
            }).then(function(searchResponse){
                console.log(searchResponse)
                for (var i = 0; i < searchResponse.restaurants.length; i++) {
                    console.log(searchResponse.restaurants[i].restaurant.name)
                    
                    $('.results').append(
                        // "<div class=card"+
                        "<div class='name'>Name: "+searchResponse.restaurants[i].restaurant.name+"</div>"+
                        "<div class='name'>Address: "+searchResponse.restaurants[i].restaurant.location.address+"</div>"+
                        "<div class='name'>Rating: "+searchResponse.restaurants[i].restaurant.user_rating.aggregate_rating+"</div>"+
                        "<div class='name'>Phone: "+searchResponse.restaurants[i].restaurant.phone_numbers+"</div>"+
                        "<hr>"
                        // "</div>"
                    )

                }
            })    
            
        })

    })
})

