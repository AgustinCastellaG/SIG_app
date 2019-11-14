require([
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/PictureMarkerSymbol"
],

  function (SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol) {

    stopSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../gpsIcon.svg',
      width: "20px",
      height: "25px",
    });

    regularCarSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-solid.svg',
      width: "35px",
      height: "28px",
    });

    stoppedCarSymbol = new SimpleMarkerSymbol({
      style: 'diamond',
      size: 20,
      color: [0, 0, 0, 0.5]
    });

    bufferSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([80, 120, 255, 0.65]), 2
      ),
      new dojo.Color([80, 120, 255, 0.35])
    );

    countySymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([80, 120, 100, 0.65]), 2
      ),
      new dojo.Color([80, 120, 100, 0.35])
    );
  }
)
