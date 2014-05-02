define([
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/request/script",
  "dojo/topic",
  "dojo/query",
  "dojo/Deferred",
  "esri/graphic",
  "esri/SpatialReference",
  "esri/geometry/jsonUtils",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "dojo/_base/Color",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/GPTask.html"
], function(
  declare,
  array,
  lang,
  domAttr,
  domConstruct,
  on,
  script,
  topic,
  query,
  Deferred,
  Graphic,
  SpatialReference,
  jsonUtils,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Color,
  _WidgetBase,
  _TemplatedMixin,
  template
) {
  "option strict";

  (function() {
    var e = document.createElement("link");
    e.rel = "stylesheet";
    e.href = require.toUrl("gp/dijit/styles/GPTask.css");
    document.getElementsByTagName("head")[0].appendChild(e);
  })();

  var GPTaskConstants = {

    EXEC_TYPE_SYNC: "esriExecutionTypeSynchronous",
    EXEC_TYPE_ASYNC: "esriExecutionTypeAsynchronous"

  };

  var GPTask = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    baseClass: "gp-task",

    loadingImage: require.toUrl("gp/dijit/images/loading.gif"),

    url: null,

    map: null,

    symbols: null,

    _resource: null,

    _parameters: null,

    startup: function() {
      this.inherited(arguments);

      this._getResource().then(lang.hitch(this, function(resource) {

        this._resource = resource;

      })).then(lang.hitch(this, this._buildInterface));

      this._graphics = [];

      this.symbols = { };
      this.symbols["esriGeometryPolygon"] = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([255,0,0]), 2),
        new Color([255,255,0,0.25])
      );

    },

    _getResource: function() {

      var d = new Deferred();

      script(this.url, {
        jsonp: "callback",
        query: {
          f: "json"
        }
      }).then(d.resolve, d.reject);

      return d.promise;

    },

    _buildInterface: function() {

      this.labelNode.innerHTML = this._resource.displayName;

      require([
        "gp/dijit/GPParameter"
      ], lang.hitch(this, function(
        GPParameter
      ) {

        domConstruct.empty(this.containerNode);

        this._parameters = [];

        array.forEach(this._resource.parameters, lang.hitch(this, function(parameter) {

          if (parameter.direction !== GPParameter.DIRECTION_IN) {
            return;
          }

          parameter.label = parameter.displayName;
          parameter.map = this.map;

          var gp = new GPParameter(parameter, domConstruct.create("div", {}, this.containerNode));
          gp.startup();

          this._parameters.push(gp);

        }));

      }));

    },

    _doHelp: function() {

      window.open(this._resource.helpUrl, "_blank");

    },

    _doExecute: function() {

      var d = new Deferred();

      on.emit(this, "execute", {
        deferred: d
      });

      // TODO: validate the parameters

      var params = {
        f: "json",
        "env:outSR": this.map.spatialReference.wkid
      };

      array.forEach(this._parameters, function(parameter) {
        params[parameter.name] = parameter.get("value");
      });

      // TODO: add busy indicator

      script(this.url + "/" + this.get("endpoint"), {
        jsonp: "callback",
        query: params
      }).then(lang.hitch(this, function(data) {

        d.resolve(data);

        while (this._graphics.length) {
          this.map.graphics.remove(this._graphics.pop());
        }

        console.log(data.results[0].value);

        var sr = new SpatialReference(data.results[0].value.spatialReference);

        array.forEach(data.results[0].value.features, lang.hitch(this, function(feature) {

          var geom = jsonUtils.fromJson(feature.geometry);
          geom.setSpatialReference(sr);

          var graphic = new Graphic(geom, this.symbols[data.results[0].value.geometryType], feature.attributes);
          this._graphics.push(graphic);
          this.map.graphics.add(graphic);

        }));

      }), d.reject);

    },

    _doCancel: function() {

      on.emit(this, "cancel", {});

    },

    _validateInputs: function() {

      return true; // TODO

    },

    _getEndpointAttr: function() {

      return this._resource.executionType === GPTaskConstants.EXEC_TYPE_SYNC ? "execute" : "submit";

    }

  });

  return GPTask;

});
