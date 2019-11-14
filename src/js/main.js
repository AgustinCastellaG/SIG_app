var map, view, routeTask, searchTemplate, search, stopSymbol, routeSymbol, carSymbol, currentPoint, simulationRoute;
var counties, countiesLayer, graphicCounties;

var canceled = false;
var paused = false;

var minSpeed = 1;
var maxSpeed = 10;
var startSpeed = 3;

var bufferDistance = 8;

var stops = [];
var stopsLength = 0;
var features = [];

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


  addStop = function (mapPoint) {
    let newStop = new Graphic(mapPoint, stopSymbol);
    view.graphics.add(newStop);

    newStopLongitude = Math.round(mapPoint.longitude * 100000) / 100000;
    newStopLatitude = Math.round(mapPoint.latitude * 100000) / 100000;
    newStopCoords = webMercatorUtils.xyToLngLat(mapPoint.x, mapPoint.y);
    console.log(mapPoint.latitude)
    stops[stopsLength] = newStopCoords;

    var feature = new Graphic({
      geometry: mapPoint,
      attributes: {
        "Id": 'stop' + stopsLength.toString()
      }
    });

    savedStops.applyEdits({
      addFeatures: [feature]
    }).then(function (res) {
      console.log("Stop saved");
      features.push(res.addFeatureResults[0].objectId);
      console.log(features)
    });

    ol = document.getElementById("stops-list");

    li = document.createElement("li");
    li.setAttribute('id', stopsLength);

    div = document.createElement("div");
    div.setAttribute('class', 'flex justify-between');

    textWrapper = document.createElement("div");

    i = document.createElement("i");
    i.setAttribute('class', 'fas fa-map-marker-alt text-xs mr-2');

    divIcons = document.createElement("div");

    up = document.createElement('i');
    up.setAttribute('class', 'fas fa-chevron-up text-xs ml-2 btnicon');
    up.setAttribute('onclick', 'moveUp(this)');


    down = document.createElement('i');
    down.setAttribute('class', 'fas fa-chevron-down text-xs ml-2 btnicon');
    down.setAttribute('onclick', 'moveDown(this)');

    remove = document.createElement('i');
    remove.setAttribute('class', 'fas fa-times text-xs ml-2 btnicon');
    remove.setAttribute('onclick', 'deleteStop(this)');

    textWrapper.appendChild(i);
    textWrapper.appendChild(document.createTextNode('x: ' + newStopLatitude + ' y: ' + newStopLongitude));
    divIcons.appendChild(up);
    divIcons.appendChild(down);
    divIcons.appendChild(remove);
    div.appendChild(textWrapper);
    div.appendChild(divIcons)
    li.appendChild(div);
    ol.appendChild(li);
    stopsLength++;

    document.getElementById("resetButton").disabled = false;
    if (stopsLength > 1) {
      document.getElementById("findRouteButton").disabled = false;
    }
  }

  startTravel = async function () {
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

  calculatePopulation = function (features, circleArea, areas) {
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
  
  deleteStop = function (elem) {
    const stopIndex = parseInt(elem.parentElement.parentElement.parentElement.id, 10);
    view.graphics.remove(view.graphics.items[stopIndex]);

    const queryStops = savedStops.createQuery();
    queryStops.objectIds = [features[stopIndex]];
    savedStops.queryFeatures(queryStops).then(function (featureSet) {
      console.log('Obteniendo parada...');
      savedStops.applyEdits({
        deleteFeatures: [featureSet.features[0]]
      }).then(function (e) {
        console.log("Parada eliminada");
      })
    });

    features.splice(stopIndex, 1);
    stops.splice(stopIndex, 1);
    stopsLength -= 1;

    // remove html div with id= stopIndex
    $(`#${stopIndex}`).remove();

    //modify other elements position
    for (let i = stopsLength; i > stopIndex; i--) {
      $(`#${i}`).attr('id', i - 1);
    }

    if (stopsLength < 2) {
      document.getElementById("findRouteButton").disabled = true;
      document.getElementById("startTravelButton").disabled = true;
      if (stopsLength == 0) {
        // clearMap();
      }
    } else {
    }
  }

  clearMap = function () {
    view.graphics.removeAll();
    view.popup.close();

    const queryStops = savedStops.createQuery();
    queryStops.objectIds = features;
    savedStops.queryFeatures(queryStops).then(function (featureSet) {
      savedStops.applyEdits({
        deleteFeatures: featureSet.features
      }).then(function (e) {
        console.log("stops removed");
      })
    });

    // routeParams.stops = [];
    features = []
    stopsLength = 0;
    stops = [];
    console.log('variables initialized');

    document.getElementById("findRouteButton").disabled = true;
    document.getElementById("saveRouteButton").disabled = true;
    document.getElementById("startTravelButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
    $('#simulationBox').addClass('hidden');
    $('#boxesContainer').addClass('justify-end');
    $('#boxesContainer').removeClass('justify-between');
    // document.getElementById("routes").hidden = true;
    // document.getElementById("routes-list").hidden = true;
    console.log('buttons reset')
}

});
