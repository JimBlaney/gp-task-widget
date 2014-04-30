define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/dom-construct",
  "dojo/topic",
  "dojo/Deferred",
  "./_GPParameter",
  "dojo/text!./templates/_GPFeatureRecordSetLayer.html"
], function(
  declare,
  lang,
  domAttr,
  domConstruct,
  topic,
  Deferred,
  _GPParameter,
  template
) {

  var _GPFeatureRecordSetLayerConstants = {

  };

  var _GPFeatureRecordSetLayer = declare([ _GPParameter ], {

    templateString: template,

    _deferred: null,

    _doGeomCapture: function() {

      if (this._deferred !== null) {
        return;
      }

      this._deferred = new Deferred();

      topic.publish("gp.action.geometry", {
        geometryType: "point",
        deferred: this._deferred
      });

      this._deferred.then(lang.hitch(this, function(e) {

        domConstruct.create("li", {
          innerHTML: e.geometry.x + ", " + e.geometry.y
        }, this.geometryListNode);

        this._deferred = null;

      }));

    }

  });

  lang.mixin(_GPFeatureRecordSetLayer, _GPFeatureRecordSetLayerConstants);

  return _GPFeatureRecordSetLayer;

});