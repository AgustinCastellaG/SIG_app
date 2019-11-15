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

    stoppedTruckSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-stopped.svg',
      width: "35px",
      height: "27px",
    });

    ultraSlowTruckSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-ultraslow.svg',
      width: "35px",
      height: "27px",
    });

    slowTruckSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-slow.svg',
      width: "35px",
      height: "27px",
    });

    regularTruckSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-solid.svg',
      width: "35px",
      height: "27px",
    });

    fastTruckSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-fast.svg',
      width: "35px",
      height: "27px",
    });

    ultraFastTruckSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../truck-ultrafast.svg',
      width: "35px",
      height: "27px",
    });

    bufferSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([0, 0, 255, 0.50]), 2
      ),
      new dojo.Color([0, 0, 255, 0.25])
    );

    countySymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([80, 120, 100, 0.65]), 2
      ),
      new dojo.Color([80, 120, 100, 0.35])
    );

    routeSymbol = new SimpleLineSymbol({
			color: [0, 170, 240, 0.6],
			width: 4
		});
  }
)
