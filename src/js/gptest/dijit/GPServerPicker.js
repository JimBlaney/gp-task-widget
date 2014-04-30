define([
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/query",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/GPServerPicker.html"
], function(
  declare,
  array,
  lang,
  domAttr,
  domConstruct,
  on,
  query,
  _WidgetBase,
  _TemplatedMixin,
  template
) {
  "option strict";

  var GPServerPicker = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    _gpServer: null,

    startup: function() {
      this.inherited(arguments);

      require([
        "gptest/fixtures"
      ], lang.hitch(this, function(
        fixtures
      ) {

        array.forEach([].concat(fixtures.GP_SERVERS), lang.hitch(this, function(gpServer) {

          domConstruct.create("option", {
            value: gpServer,
            innerHTML: gpServer
          }, this.selectNode);

        }));

      }));
    },

    _onChange: function(e) {

      if (this._gpServer !== null) {
        this._gpServer.destroyRecursive();
        this._gpServer = null;
      }

      var selectedOptions = query("option:checked", e.target);
      if (selectedOptions.length < 1) {
        return;
      }

      var value = domAttr.get(selectedOptions[0], "value");
      if (value === "-1") {
        return;
      }

      on.emit(this, "change", {
        url: value
      });

      require(["gp/dijit/GPServer"], lang.hitch(this, function(GPServer) {

        this._gpServer = new GPServer({
          url: value
        }, domConstruct.create("div", {}, this.containerNode));
        this._gpServer.startup();

      }));

    }

  });

  return GPServerPicker;

});
