require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/Graphic"
], function (Map, MapView, Search, Graphic) {

  var map = new Map({
    basemap: "streets"
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-74.00713, 40.71455],
    zoom: 12
  });

  // Add Search widget
  var search = new Search({
    view: view
  });
  view.ui.add(search, "top-right"); // Add to the map

  // Find address

  var coordsArray = [];

  search.on("select-result", function (event) {
    var coords = { x: event.result.feature.geometry.latitude, y: event.result.feature.geometry.longitude }
    coordsArray.push(coords);

    var pointGraphic = new Graphic({
      geometry: { type: "point", latitude: coords.x, longitude: coords.y },
      symbol: simpleMarkerSymbol
    });

    view.graphics.add(pointGraphic);
  });

  var coordsArray = [];

  function saveCoordinates(pt) {
    var coords = { x: pt.latitude.toFixed(3), y: pt.longitude.toFixed(3) }
    coordsArray.push(coords);

    var pointGraphic = new Graphic({
      geometry: { type: "point", latitude: coords.x, longitude: coords.y },
      symbol: simpleMarkerSymbol
    });

    view.graphics.add(pointGraphic);
    console.log(view.graphics)
  }

  // Find address

  view.on("click", function (evt) {
    search.clear();
    view.popup.clear();
    if (search.activeSource) {
      var geocoder = search.activeSource.locator; // World geocode service
      var params = {
        location: evt.mapPoint
      };
      geocoder.locationToAddress(params)
        .then(function (response) { // Show the address found
          var address = response.address;
          showPopup(address, evt.mapPoint);
          saveCoordinates(view.toMap({ x: evt.x, y: evt.y }));
          console.log(coordsArray)
        }, function (err) { // Show no address found
          showPopup("No address found.", evt.mapPoint);
        });
    }
  });

  function showPopup(address, pt) {
    view.popup.open({
      title: + Math.round(pt.longitude * 100000) / 100000 + ", " + Math.round(pt.latitude * 100000) / 100000,
      content: address,
      location: pt
    });
  }

  var simpleMarkerSymbol = {
    type: "simple-marker",
    color: [0, 102, 204],  // blue
    outline: {
      color: [255, 255, 255], // white
      width: 1
    }
  };
});
