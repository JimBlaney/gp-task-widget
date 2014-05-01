# gp-task-widget

A set of widgets for dynamically building a user interface for a GPServer/GPTask endpoint.

## Usage

    require([
      "gp/dijit/GPTask"
    ], function(
      GPTask
    ) {

      //var map = ...

      var taskWidget = new GPTask({
        url: "//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed",
        map: map
      }, "task-placeholder");
      taskWidget.startup();

    });
