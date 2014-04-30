define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/GPParameter.html"
], function(
  declare,
  lang,
  _WidgetBase,
  _TemplatedMixin,
  template
) {
  "option strict";

  var GPParameterConstants = {

    DIRECTION_IN:  "esriGPParameterDirectionInput",
    DIRECTION_OUT: "esriGPParameterDirectionOutput",

    TYPE_REQUIRED: "esriGPParameterTypeRequired",
    TYPE_OPTIONAL: "esriGPParameterTypeOptional",

    // ./ArcGIS/SDK/REST/index.html?gpexecute.html
    DATA_BOOLEAN: "GPBoolean",
    DATA_DOUBLE: "GPDouble",
    DATA_LONG: "GPLong",
    DATA_STRING: "GPString",
    DATA_LINEAR_UNIT: "GPLinearUnit",
    DATA_FEAT_RS_LAYER: "GPFeatureRecordSetLayer",
    DATA_RS: "GPRecordSet",
    DATA_DATE: "GPDate",
    DATA_FILE: "GPDataFile",
    DATA_RASTER: "GPRasterData",
    DATA_RASTER_LAYER: "GPRasterDataLayer",
    DATA_MULTI_VAL: "GPMultiValue"

  };

  var GPParameter = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    category: null,

    choiceList: null,    

    dataType: null,

    defaultValue: null,

    direction: null,

    displayName: null,

    name: null,

    parameterType: null,

    startup: function() {
      this.inherited(arguments);

      require(["gp/dijit/_" + this.dataType], lang.hitch(this, function(Control) {

        this._control = new Control({
          choiceList: this.choiceList,
          defaultValue: this.defaultValue
        }, this.controlNode);
        this._control.startup();

      }));

    },

    validate: function() {

      if (this.parameterType === GPParameterConstants.TYPE_REQUIRED) {
        return true;
      } else {
        return true;
      }

    }

  });

  lang.mixin(GPParameter, GPParameterConstants);

  return GPParameter;

})