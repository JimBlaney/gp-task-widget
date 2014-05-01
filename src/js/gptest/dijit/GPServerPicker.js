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

  (function() {
    var e = document.createElement("link");
    e.rel = "stylesheet";
    e.href = require.toUrl("gptest/dijit/styles/GPServerPicker.css");
    document.getElementsByTagName("head")[0].appendChild(e);
  })();

  var GPServerPicker = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    baseClass: "gp-server-picker",

    map: null,

    label: "Servers",

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

        domConstruct.empty(this.containerNode);

        this._gpServer = new GPServer({
          url: value,
          map: this.map
        }, domConstruct.create("div", {}, this.containerNode));
        this._gpServer.startup();

      }));

    }

  });

  return GPServerPicker;

});
