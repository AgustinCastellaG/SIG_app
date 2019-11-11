require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Directions"
], function(Map, MapView, Directions) {

  var map = new Map({
    basemap: "streets-navigation-vector"
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.24532,34.05398],
    zoom: 12,
    padding: {
      right: 320
    }
  });

  // To allow access to the route service and prevent the user from signing in, do the Challenge step in the lab to set up a service proxy

  var directions = new Directions({
    view: view
  });

  var coordsArray = [];

  function showCoordinates(pt) {
    var coords = { x : pt.latitude.toFixed(3), y : pt.longitude.toFixed(3) }
    coordsArray.push(coords);
    console.log(coordsArray)
  }

  view.on(["click"], function(evt) {
    showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
  });

 view.ui.add(directions, "top-right");

    });