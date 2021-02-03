# Project-01: Food Hunt
Group 10: Uyen Nguyen, Rachel Kroetch, Tria Thao

## Deploy link: 
Visit our project [here](https://uyennguyen30696.github.io/food-hunt-project-01/)

## Project Description
An app that allows the user to search for restaurants when they want to try some place new.  The app will use the APIs of Zomato and OpenStreetMap, along with Leaflet and MapQuest to provide information about the restaurants as well as directions to the place of their choice. 

### Important Note

* Please allow location in your device to run the application.

* If you're using Chrome and the map doesn't point to the right location, please update Chrome to the latest version.


## User Story
AS A food enthusiast
I WANT to find local restaurants based on ratings and cuisine type
SO THAT I can try new food in my area

## Acceptance Criteria
- when user opens the app, 
- then it shows the last search or tells the user to try the app
- when user searches city and cuisine type, 
- then given top 5 results and map locations
- when given the top 5 results,
- then the user will see the address, rating, and phone number of each
- when user clicks a restaurant, 
- then given link to menu
- when user clicks "get directions", 
- then given directions to the restaurant
- when user refreshes page,
- then the previous search results stay

## Image
![screenshot](./screenshots/openingPage.png)
![screenshot](./screenshots/searchResult.png)
![screenshot](./screenshots/directions.png)
![screenshot](./screenshots/refreshedPage.png)

## API's and plugin
* [Zomato](https://developers.zomato.com/api) 
* [OpenStreetMap](https://www.openstreetmap.org/#map=2/56.2/10.5)
* [Leaflet](https://leafletjs.com/reference-1.7.1.html)
* [MapQuest](https://developer.mapquest.com/documentation/samples/leaflet/v2.2/routing/options/)

## Breakdown of Tasks
- front end design using new css framework, Foundation
- get api keys
- use local storage to hold past search
- use ajax to call information from the APIs
- display search results dynamically using JavaScript