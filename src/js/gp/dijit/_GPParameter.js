define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin"
], function(
  declare,
  lang,
  _WidgetBase,
  _TemplatedMixin
) {

  var _GPParameterConstants = {

  };

  var _GPParameter = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: "<div></div>",

    baseClass: "gp-parameter-input",

    map: null,

    choiceList: null,

    defaultValue: null,

    startup: function() {
      this.inherited(arguments);

      

    }

  });

  lang.mixin(_GPParameter, _GPParameterConstants);

  return _GPParameter;

});