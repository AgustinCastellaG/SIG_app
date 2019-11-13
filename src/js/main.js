var map, view, routeTask, searchTemplate, search, stopSymbol, routeSymbol;

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/geometry/Point",
  "esri/layers/TileLayer",
  "esri/PopupTemplate",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "dojo/on",
  "dojo/dom",
  "esri/geometry/support/webMercatorUtils",
  "esri/tasks/support/FeatureSet",
  "esri/tasks/support/Query",
  "esri/tasks/GeometryService",
  "esri/tasks/support/BufferParameters",
  "esri/geometry/SpatialReference",
  "dojo/domReady!",
  "esri/geometry/Circle",
  "esri/tasks/support/AreasAndLengthsParameters",
  "esri/layers/GraphicsLayer"
], function (
  Map,
  MapView,
  Point,
  TileLayer,
  PopupTemplate,
  Graphic,
  FeatureLayer,
  on,
  dom,
  webMercatorUtils,
  FeatureSet,
  Query,
  GeometryService,
  BufferParameters,
  SpatialReference,
  domReady,
  Circle,
  AreasAndLengthsParameters,
  GraphicsLayer
) {

  var map = new Map();

  view = new MapView({
    map: map,
    container: "viewDiv",
    center: new Point(-73.935242, 40.730610),
    zoom: 9
  });


  const tiled = new TileLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
  map.add(tiled);

  view.on("click", function (evt) {
    evt.stopPropagation();
    mapPoint = evt.mapPoint;
    view.popup.open({
      location: mapPoint,
      title: + Math.round(mapPoint.longitude * 100000) / 100000 + ", " + Math.round(mapPoint.latitude * 100000) / 100000,
      content: "<button type='button' class='bg-gray-800 text-sm text-gray-100 py-1 px-4 mx-1 my-2 rounded-lg shadow-md' onclick='addStop(mapPoint); view.popup.close()'><i class='fas fa-map-marker-alt mr-2'></i>Agregar Parada</button>",      
    });
  });


  addStop = function(mapPoint) {
    console.log('verga');
    let stopGraphic = new Graphic(mapPoint, stopSymbol);
    view.graphics.add(stopGraphic);

    possibleStop = webMercatorUtils.xyToLngLat(mapPoint.x,mapPoint.y);
    stops[cantStops] = possibleStop;

    newStop = new Graphic({
      geometry: new Point(stops[cantStops][0], stops[cantStops][1]),
      symbol: stopSymbol,
    });

    var feature = new Graphic();
    var geometry = mapPoint;
    feature.geometry = geometry;
    feature.attributes = {
      "Id": 'sig2018g4-' + cantStops.toString()
    };

    savedStops.applyEdits({
      addFeatures: [feature]
    }).then(function (res) {
      console.log("Parada guardada");
      features.push(res.addFeatureResults[0].objectId);
    });

    ol = document.getElementById("stops-list");
    li = document.createElement("li");
    li.setAttribute('id',cantStops);
    li.appendChild(document.createTextNode(possibleStop));
    up = document.createElement('cantStops');
    up.setAttribute('class', 'fas fa-chevron-up stop-icon');
    up.setAttribute('onclick', 'moveUp(this)');
    li.appendChild(up);
    down = document.createElement('cantStops');
    down.setAttribute('class', 'fas fa-chevron-down stop-icon');
    down.setAttribute('onclick', 'moveDown(this)');
    li.appendChild(down);
    cross = document.createElement('cantStops');
    cantStops++;
    cross.setAttribute('class', 'fas fa-times stop-icon');
    cross.setAttribute('onclick', 'deleteStop(this)');
    li.appendChild(cross);
    ol.appendChild(li);

    document.getElementById("clearMap").disabled = false;
    if (cantStops > 1) {
      document.getElementById("findRoute").disabled = false;
    }
    if (document.getElementById("stops").hidden) {
      document.getElementById("stops").hidden = false;
      document.getElementById("stops-list").hidden = false;
    }
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
