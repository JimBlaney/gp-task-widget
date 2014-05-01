define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/on",
  "esri/toolbars/draw",
  "./_GPParameter",
  "dojo/text!./templates/_GPFeatureRecordSetLayer.html"
], function(
  declare,
  lang,
  domAttr,
  domClass,
  domConstruct,
  on,
  Draw,
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

    startup: function() {
      this.inherited(arguments);

      this._geoms = [];

      this._toolbar = new Draw(this.map);

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

          this._geoms.push(e.geometry);

          var geomLabel = geomType.substring(0, 1).toUpperCase() + geomType.substring(1);

          domConstruct.create("li", {
            innerHTML: geomLabel + " " + this._geoms.length
          }, this.geometryListNode);

        }));

      }

    }

  });

  lang.mixin(_GPFeatureRecordSetLayer, _GPFeatureRecordSetLayerConstants);

  return _GPFeatureRecordSetLayer;

});