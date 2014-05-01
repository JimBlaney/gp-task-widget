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

  var GPTask = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    baseClass: "gp-task",

    loadingImage: require.toUrl("gp/dijit/images/loading.gif"),

    url: null,

    map: null,

    _resource: null,

    _parameters: null,

    startup: function() {
      this.inherited(arguments);

      this._getResource().then(lang.hitch(this, function(resource) {
        
        this._resource = resource;

        this._buildInterface();
        
      }));

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

      this.displayNameNode.innerHTML = this._resource.displayName;

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

      var params = {};

      array.forEach(this._parameters, function(parameter) {

      });

      script("", {
        jsonp: "callback",
        query: params
      }).then(function(data) {

      }, d.reject);

    },

    _doCancel: function() {

      on.emit(this, "cancel", {});

    },

    _validateInputs: function() {

      return true; // TODO

    }

  });

  return GPTask;

});
