require([
	"esri/tasks/RouteTask",
	"esri/tasks/support/RouteParameters"
	], 

	function(RouteTask, RouteParameters) {

		routeTask = new RouteTask("https://utility.arcgis.com/usrsvcs/appservices/pVLaz9HCiifTrv79/rest/services/World/Route/NAServer/Route_World/solve");
    
    routeParams = new RouteParameters();

	}
)
