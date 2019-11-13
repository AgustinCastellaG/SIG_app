require([
  "esri/widgets/Search"
], function (Search) {


  // search.on("select-result", function (event) {
  //   var coords = { x: event.result.feature.geometry.latitude, y: event.result.feature.geometry.longitude }
  //   coordsArray.push(coords);

  //   var pointGraphic = new Graphic({
  //     geometry: { type: "point", latitude: coords.x, longitude: coords.y },
  //     symbol: simpleMarkerSymbol
  //   });

  //   view.graphics.add(pointGraphic);
  // });

  var search = new Search({
    popupEnabled: false,
    view: view,
    resultGraphicEnabled: false
  });
  view.ui.add(search, "top-right");

  search.on("select-result", function (event) {
    address = event.result.name;
    mapPoint = event.result.feature.geometry;
    showPopup(address, mapPoint)
  })

  function showPopup(address, pt) {
    view.popup.open({
      title: + Math.round(pt.longitude * 100000) / 100000 + ", " + Math.round(pt.latitude * 100000) / 100000,
      content: address + "<br><br> <input type='button' value='Agregar parada' class='btn' onclick='addStop(pt); view.popup.close()'/>",
      location: pt
    })
  }
}
)
