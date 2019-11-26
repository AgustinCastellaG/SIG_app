require([
  "esri/widgets/Search"
], function (Search) {

  var search = new Search({
    popupEnabled: false,
    view: view,
    resultGraphicEnabled: false
  });
  view.ui.add(search, "top-right");

  search.on("select-result", function (event) {
    address = event.result.name;
    mapPoint = event.result.feature.geometry;
    view.popup.open({
      location: mapPoint,
      title: + Math.round(mapPoint.longitude * 100000) / 100000 + ", " + Math.round(mapPoint.latitude * 100000) / 100000,
      content: address + "<br><br> <button type='button' class='bg-gray-800 text-sm text-gray-300 py-1 px-4 mx-1 my-2 rounded-lg shadow-md' onclick='addStop(mapPoint); view.popup.close()'><i class='fas fa-map-marker-alt mr-2'></i>Agregar Parada</button>",
    });
  })
}
)
