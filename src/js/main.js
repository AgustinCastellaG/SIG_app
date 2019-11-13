var map, view, routeTask, searchTemplate, search

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

  searchTemplate = new PopupTemplate();

  const tiled = new TileLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
  map.add(tiled);

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

  view.on("click", function (evt) {
    evt.stopPropagation();
    mapPoint = evt.mapPoint;
    showPopup(mapPoint)

    // view.popup.open({
    //   title: "Posición seleccionada",
    //   location: evt.mapPoint,
    //   content: "<b>X:</b> " + lat + ", <br><b>Y:</b> " + lon
    //     + "<br><br><input type='button' class='btn' value='Agregar parada' onclick='addStop(mapPoint); view.popup.close()'/>"
    // });
  });

  function showPopup(pt) {
    view.popup.open({
      location: pt,
      title: + Math.round(pt.longitude * 100000) / 100000 + ", " + Math.round(pt.latitude * 100000) / 100000,
      content: "<input type='button' value='Agregar parada' class='btn' onclick='addStop(pt); view.popup.close()'/>",      
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
