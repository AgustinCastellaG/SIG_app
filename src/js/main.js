var map, view, searchTemplate, search, circle;
var stopSymbol, routeSymbol, carSymbol, bufferSymbol;

var counties, countiesLayer;

// chequear si se pueden sacar
var graphicCounties, currentPoint;

var routeTask, routeParams, simulationRoute;

var stops = [];
var stopsLength = 0;
var features = [];

// simulation variables
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
  "esri/layers/GraphicsLayer",
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

  map.add(new TileLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"));

  circle = new Circle();
  circle.spatialReference = map.spatialReference;

  geometryService = new GeometryService("http://tasks.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");

  countiesLayer = new GraphicsLayer();
  map.add(countiesLayer);

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
      features.push(res.addFeatureResults[0].objectId);
      if (stopsLength > 1) {
        document.getElementById("findRouteButton").disabled = false;
        console.log("Stop saved");
      }
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
    // if (stopsLength > 1) {
    //   document.getElementById("findRouteButton").disabled = false;
    // }
  }

  startTravel = async function () {
    document.getElementById('startTravelButton').disabled = true;
    $('#simulationBox').removeClass('hidden');
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
      await sleep(3000);
    }
    document.getElementById("pauseButton").disabled = true;
    document.getElementById("playButton").disabled = true;
    document.getElementById("stopButton").disabled = true;
    document.getElementById("minusButton").disabled = true;
    document.getElementById("plusButton").disabled = true;
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

    // clear stop list
    document.getElementById("stops-list").innerHTML = "";

    $('#simulationBox').addClass('hidden');
    $('#boxesContainer').addClass('justify-end');
    $('#boxesContainer').removeClass('justify-between');
    // document.getElementById("routes").hidden = true;
    // document.getElementById("routes-list").hidden = true;
    console.log('buttons reset')
  }

  calculateRoute = function () {
    // lock stops position
    const upButtons = document.querySelectorAll('.fa-chevron-up');
    for (const elem of upButtons) {
      elem.remove()
    }

    const downButtons = document.querySelectorAll('.fa-chevron-down');
    for (const elem of downButtons) {
      elem.remove()
    }

    const removeButtons = document.querySelectorAll('.fa-times');
    for (const elem of removeButtons) {
      elem.remove()
    }

    var stopsQuery = savedStops.createQuery();
    stopsQuery.objectIds = features;
    savedStops.queryFeatures(stopsQuery).then(function (featSet) {
      var set = new FeatureSet({
        features: featSet.features
      });
      routeParams.stops = set;
      routeTask.solve(routeParams).then(res => {
        // draw route
        const route = res.routeResults[0].route;
        route.symbol = routeSymbol;
        view.graphics.add(route);

        lastRoute = route;
        simulationRoute = lastRoute;

        document.getElementById("saveRouteButton").disabled = false;
        document.getElementById("startTravelButton").disabled = false;
      });
    })

    document.getElementById("findRouteButton").disabled = true;
  }

  saveRoute = function() {
    const name = prompt("Ingrese el nombre de la ruta");
    if (name != null && name != '') {
      lastRoute.attributes = {
        "notes" : 'myRouteG7' + name
      };
      routes.applyEdits({
        addFeatures: [lastRoute]
      }).then(function (res) {
        alert(`Ruta ${name} guardada correctamente`);
      });
    }
  }

  loadRoute = function(id) {
    view.graphics.removeAll();
    const routeQuery = routes.createQuery();
    routeQuery.where = "objectid = " + id.toString();
    routes.queryFeatures(routeQuery).then(function(res) {
      // draw route
      const loadedRoute = res.features[0];
      loadedRoute.symbol = routeSymbol;
      view.graphics.add(loadedRoute);

      simulationRoute = res.features[0];

      document.getElementById("clearMapButton").disabled = false;
      document.getElementById("startTravelButton").disabled = false;
    });
  }

  fetchRoutes = function() {
    const queryAll = routes.createQuery();
    queryAll.where = "notes LIKE 'myRouteG7%'";
    queryAll.outFields = [ "objectid" ];
    routes.queryFeatures(queryAll).then(function(objectIds) {
      console.log(objectIds)
      // document.getElementById("routes-list").innerHTML = "";
      // document.getElementById("routes-list").hidden = false;
      // document.getElementById("routes").hidden = false;
      // document.getElementById("getSavedRoutes").hidden = true;
      // ol = document.getElementById("routes-list");
      for (const elem of objectIds.features) {
        var query = routes.createQuery();
        query.where = `objectid = ${elem.attributes.objectid}`;
        routes.queryFeatures(query).then(function(route) {
          name = route.features[0].attributes.notes.replace('myRouteG7', '');
          li = document.createElement("li");
          li.appendChild(document.createTextNode(name));
        })

      }
      for (index = 0; index < objectIds.features.length; index++) {
        (function() {
          var routeName = "";
          var routy = objectIds.features[index].attributes.objectid;

          var queryId = savedRoutes.createQuery();
          queryId.where = "objectid = " + routy.toString();
          savedRoutes.queryFeatures(queryId).then(function(route) {
            routeName = route.features[0].attributes.notes.slice(10);
            routy = route.features[0].attributes.objectid;
            li = document.createElement("li");
            li.appendChild(document.createTextNode(routeName));
            useRouteButton = document.createElement('cantSavedRoutes');
            useRouteButton.setAttribute('id',routy);
            useRouteButton.setAttribute('class', 'fas fa-route showRoute-icon');
            useRouteButton.setAttribute('onclick', 'showRoute(id)');
            li.appendChild(useRouteButton);
            cantSavedRoutes++;
            ol.appendChild(li);
          })
        })();
      }
    });
  }

});
