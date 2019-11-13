require([
  "esri/widgets/Search"
], function (Search) {

  // Add Search widget
  var search = new Search({
    view: view
  });
  view.ui.add(search, "top-right");





  // searchTemplate.content = "<input type='button' value='Agregar parada' class='btn' onclick='addStop(mapPoint); view.popup.close()'/>"

  // var search = new Search({
  //   popupEnabled: true,
  //   view: view,
  //   resultGraphicEnabled: false
  // }, "search");
  // search.popupTemplate = searchTemplate;

  // search.on("select-result", function (event) {
  //   resultName = event.result.name;
  //   mapPoint = event.result.feature.geometry;
  // })
}
)
