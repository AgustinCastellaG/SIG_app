require([
	"esri/tasks/PrintTask",
	"esri/tasks/support/PrintTemplate",
	"esri/tasks/support/PrintParameters"
],

	function (PrintTask, PrintTemplate, PrintParameters) {

		printMap = function () {
			var printTask = new PrintTask({
				url: "http://sampleserver5.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
			});

			var template = new PrintTemplate({
				format: "pdf",
        layout: "a4-landscape",
        exportOptions: {
          dpi: 200
        },
			});

			var params = new PrintParameters({
				view: view,
				template: template
			});

			printTask.execute(params).then(result => {
				var win = window.open(result.url, '_blank');
				win.focus();
			}).catch(error => {
				alert('Error al exportar Mapa')
				console.log(error.toString());
			});
		};
	}
)