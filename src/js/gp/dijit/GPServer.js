define([
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/request/script",
  "dojo/query",
  "dojo/Deferred",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/GPServer.html"
], function(
  declare,
  array,
  lang,
  domAttr,
  domConstruct,
  on,
  script,
  query,
  Deferred,
  _WidgetBase,
  _TemplatedMixin,
  template
) {
  "option strict";

  var GPServer = declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: template,

    url: null,

    _resource: null,

    _gpTask: null,

    startup: function() {
      this.inherited(arguments);

      this._getResource().then(lang.hitch(this, function(resource) {
        
        this._resource = resource;

        domAttr.set(this.selectNode, "size", this._resource.tasks.length + 1);

        array.forEach(this._resource.tasks, lang.hitch(this, function(task) {

          domConstruct.create("option", {
            value: task,
            innerHTML: task
          }, this.selectNode);

        }));

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

    _onChange: function(e) {

      if (this._gpTask !== null) {
        this._gpTask.destroyRecursive();
        this._gpTask = null;
      }

      var selectedOptions = query("option:checked", e.target);
      if (selectedOptions.length < 1) {
        return;
      }

      var value = domAttr.get(selectedOptions[0], "value");
      if (value === "-1") {
        return;
      }

      var url = this.url + "/" + value;

      on.emit(this, "change", {
        url: url
      });

      var label = domAttr.get(selectedOptions[0], "innerHTML");

      require(["gp/dijit/GPTask"], lang.hitch(this, function(GPTask) {

        this._gpTask = new GPTask({
          url: url,
          taskName: label
        }, domConstruct.create("div", {}, this.containerNode));
        this._gpTask.startup();

      }));

    }

  });

  return GPServer;

});
