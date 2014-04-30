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

  var GPTask = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    url: null,

    taskName: null,

    _resource: null,

    _parameters: null,

    startup: function() {
      this.inherited(arguments);

      this._getResource().then(lang.hitch(this, function(resource) {
        
        this._resource = resource;

        this.displayNameNode.innerHTML = this._resource.displayName;

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

      require([
        "gp/dijit/GPParameter"
      ], lang.hitch(this, function(
        GPParameter
      ) {

        this._parameters = [];

        array.forEach(this._resource.parameters, lang.hitch(this, function(parameter) {

          if (parameter.direction !== GPParameter.DIRECTION_IN) {
            return;
          }

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

      // TODO

    },

    _doCancel: function() {



    },

    _validateInputs: function() {

      return true; // TODO

    }

  });

  return GPTask;

});
