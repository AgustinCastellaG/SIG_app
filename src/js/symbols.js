require([
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/PictureMarkerSymbol"
	], 

	function(SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol) {

		stopSymbol = new PictureMarkerSymbol({
      type: "picture-marker",
      url: '../gpsIcon.png',
      width: "28px",
      height: "28px"
		})
		
		routeSymbol = new SimpleLineSymbol({
			color: [0, 0, 255, 0.5],
			width: 5
		});

		regularCarSymbol = new SimpleMarkerSymbol({
			style: 'diamond',
			size: 20,
			color: [255, 0, 255, 0.5]
		});

		fastCarSymbol = new SimpleMarkerSymbol({
			style: 'diamond',
			size: 20,
			color: [160, 0, 0, 0.5]
		});

		fastestCarSymbol = new SimpleMarkerSymbol({
			style: 'diamond',
			size: 20,
			color: [255, 0, 0, 0.5]
		});

		slowCarSymbol = new SimpleMarkerSymbol({
			style: 'diamond',
			size: 20,
			color: [0, 180, 0, 0.5]
		});

		slowestCarSymbol = new SimpleMarkerSymbol({
			style: 'diamond',
			size: 20,
			color: [0, 255, 0, 0.5]
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
				new dojo.Color([80,120,255,0.65]), 2
			),
			new dojo.Color([80,120,255,0.35])
		);

		countySymbol = new SimpleFillSymbol(
			SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([80,120,100,0.65]), 2
			),
			new dojo.Color([80,120,100,0.35])
		);
	}
)