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