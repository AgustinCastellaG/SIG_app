require([
	"esri/tasks/RouteTask",
	"esri/tasks/support/RouteParameters"
	],

	function(RouteTask, RouteParameters) {

		routeTask = new RouteTask("https://utility.arcgis.com/usrsvcs/appservices/j6C4TuegXs4Ov2ZZ/rest/services/World/Route/NAServer/Route_World/solve");

    routeParams = new RouteParameters();

	}
)
