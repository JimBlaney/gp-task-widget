define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/on",
  "esri/toolbars/draw",
  "esri/graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "dojo/_base/Color",
  "./_GPParameter",
  "dojo/text!./templates/_GPFeatureRecordSetLayer.html"
], function(
  declare,
  lang,
  array,
  domAttr,
  domClass,
  domConstruct,
  on,
  Draw,
  Graphic,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  Color,
  _GPParameter,
  template
) {

  var _GPFeatureRecordSetLayerConstants = {

  };

  var _GPFeatureRecordSetLayer = declare([ _GPParameter ], {

    templateString: template,

    baseClass: "gp-feature-rs-layer",

    _deferred: null,

    _toolbar: null,

    _drawEndHandle: null,

    _geoms: null,

    _graphics: null,

    startup: function() {
      this.inherited(arguments);

      this._geoms = [];
      this._graphics = [];

      this._toolbar = new Draw(this.map);

      //HACK -- symbology/map residence shouldn't be controlled here
      this.symbols = {};
      this.symbols["esriGeometryPoint"] = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_SQUARE,
        10,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([255,0,0]),
          1),
        new Color([0,255,0,0.25]));
    },

    _doGeomCapture: function() {

      if (domClass.contains(this.actionNode, "checked")) {

        this._drawEndHandle.remove();
        this._toolbar.deactivate();
        this.map.setMapCursor("default");
        domClass.remove(this.actionNode, "checked");

      } else {

        domClass.add(this.actionNode, "checked");

        var geomType = this.defaultValue.geometryType.toLowerCase().replace("esrigeometry", "");

        this._toolbar.activate(geomType);
        this.map.setMapCursor("crosshair");

        this._drawEndHandle = on(this._toolbar, "draw-end", lang.hitch(this, function(e) {

          this._drawEndHandle.remove();
          this._toolbar.deactivate();
          this.map.setMapCursor("default");
          domClass.remove(this.actionNode, "checked");

          var geomLabel = geomType.substring(0, 1).toUpperCase() + geomType.substring(1);

          this._geoms.push(e.geometry);

          domConstruct.create("li", {
            innerHTML: geomLabel + " " + this._geoms.length
          }, this.geometryListNode);

          var graphic = new Graphic(e.geometry, this.symbols[this.defaultValue.geometryType], {});
          this.map.graphics.add(graphic);
          this._graphics.push(graphic);

        }));

      }

    },

    _getValueAttr: function() {

      var features = array.map(this._geoms, function(geom) {
        return {
          geometry: geom.toJson()
        };
      });

      return {
        geometryType: this.defaultValue.geometryType,
        spatialReference: this.map.spatialReference.toJson(),
        features: features
      };

    }

  });

  lang.mixin(_GPFeatureRecordSetLayer, _GPFeatureRecordSetLayerConstants);

  return _GPFeatureRecordSetLayer;

});
