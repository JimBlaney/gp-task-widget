define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "./_GPParameter",
  "dojo/text!./templates/_GPLinearUnit.html"
], function(
  declare,
  lang,
  domAttr,
  _GPParameter,
  template
) {

  var _GPLinearUnitConstants = {

  };

  var _GPLinearUnit = declare([ _GPParameter ], {

    templateString: template,

    "class": "gp-linear-unit",

    startup: function() {

      domAttr.set(this.inputNode, "value", this.defaultValue.distance);

      // TODO: units

    }

  });

  lang.mixin(_GPLinearUnit, _GPLinearUnitConstants);

  return _GPLinearUnit;

});