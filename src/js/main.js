var map, view, routeTask, searchTemplate, search, stopSymbol, routeSymbol, carSymbol, currentPoint, simulationRoute;
var counties, countiesLayer, graphicCounties;

var canceled = false;
var paused = false;

var minSpeed = 1;
var maxSpeed = 10;
var startSpeed = 3;

var bufferDistance = 8;

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
      content: "<button type='button' class='bg-gray-800 text-sm text-gray-300 py-1 px-4 mx-1 my-2 rounded-lg shadow-md' onclick='addStop(mapPoint); view.popup.close()'><i class='fas fa-map-marker-alt mr-2'></i>Agregar Parada</button>",
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

  startTravel = async function() {
    document.getElementById('startTravelButton').disabled = true;
    $('#simulationBox').removeClass('hidden');
    $('#boxesContainer').removeClass('justify-end');
    $('#boxesContainer').addClass('justify-between');
    var route = 0;
    canceled = false;
    paused = false;
    var speed = startSpeed;
    carSymbol = regularCarSymbol
    bufferDistance = bufferValue.value;
    document.getElementById("pauseButton").disabled = false;
    document.getElementById("stopButton").disabled = false;
    document.getElementById("minusButton").disabled = false;
    document.getElementById("plusButton").disabled = false;
    while (route < simulationRoute.geometry.paths[0].length) {
      if (!canceled) {
        if (!paused) {
          currentPoint = new Point(simulationRoute.geometry.paths[0][route][0], simulationRoute.geometry.paths[0][route][1])

          bufferParams = new BufferParameters();
          bufferParams.geometries = [currentPoint];
          bufferParams.distances = [bufferDistance];
          bufferParams.unit = GeometryService.UNIT_KILOMETER;
          bufferParams.outSpatialReference = view.spatialReference;

          geometryService.buffer(bufferParams).then(showBuffer);
          route = route + speed;
        }
      } else {
        view.popup.close();
        countiesLayer.removeAll();
        route = 0;
      }
      // await sleep(3000);
    }
    document.getElementById("pauseButton").disabled = false;
    document.getElementById("playButton").disabled = false;
    document.getElementById("stopButton").disabled = false;
    document.getElementById("minusButton").disabled = false;
    document.getElementById("plusButton").disabled = false;
  }

  sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showBuffer = function (geometries) {
    getCounties();

    view.graphics.remove(graphicBuffer);
    graphicBuffer = new Graphic(geometries[0], bufferSymbol);
    view.graphics.add(graphicBuffer);

    view.graphics.remove(carGraphic);
    carGraphic = new Graphic(car, carSymbol);
    view.graphics.add(carGraphic);

    circle = geometries[0];
  }

  getCounties = function () {
    var query = counties.createQuery();
    query.geometry = circle;
    query.returnGeometry = true;
    query.outfields = ["*"];

    counties.queryFeatures(query).then(function (featureSet) {
      var inBuffer = [];
      var areas = [];
      var feat = featureSet.features;
      var circleArea;
      var countiesGeometry = [];
      countiesLayer.removeAll();
      for (var i = 0; i < feat.length; i++) {
        countiesGeometry.push(feat[i].geometry);
        inBuffer.push(feat[i].attributes.OBJECTID);

        graphicCounties = new Graphic(feat[i].geometry, countySymbol);
        if (!canceled) {
          countiesLayer.add(graphicCounties);
        }
      }
      var areasAndLengthParamsCircle = new AreasAndLengthsParameters({
        areaUnit: "square-kilometers",
        lengthUnit: "kilometers",
        polygons: [circle]
      });
      geometryService.areasAndLengths(areasAndLengthParamsCircle).then(function (results) {
        circleArea = results.areas[0];
      });
      geometryService.intersect(countiesGeometry, circle).then(function (intersectionGeometry) {
        var areasAndLengthParams = new AreasAndLengthsParameters({
          areaUnit: "square-kilometers",
          lengthUnit: "kilometers",
          polygons: intersectionGeometry
        });
        geometryService.areasAndLengths(areasAndLengthParams).then(function (results) {
          areas = results.areas;
          var populationValue = calculatePopulation(feat, circleArea, areas);
          view.popup.close();
          if (!canceled) {
            view.popup.open({
              location: car,
              title: "VALOR DE POBLACIÓN PONDERADO",
              alignment: "top-center",
              content: "<b>Total de población en el buffer:</b> " + populationValue.toLocaleString() + " habitantes"
            });
          }
        });
      });
    });
  }

  calculatePopulation = function(features,circleArea,areas) {
    var popTotal = 0;
    for (var x = 0; x < features.length; x++) {
      mult = areas[x] * 100;
      percentage = mult / circleArea;
      fraction = areas[x] / circleArea;
      popCounty = features[x].attributes["TOTPOP_CY"] * fraction;
      popTotal = popTotal + popCounty;
    }
    popTotal = Math.trunc(popTotal);
    return popTotal;
  }

});
