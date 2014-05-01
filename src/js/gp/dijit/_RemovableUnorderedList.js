define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin"
], function(
  declare,
  lang,
  domConstruct,
  _WidgetBase,
  _TemplatedMixin
) {

  var _RemovableUnorderedListItem = declare([ _WidgetBase, _TemplatedMixin ], {

      templateString: "<li><span class='item-label'>${label}</span></li>",

      baseClass: "gp-list-item",

      label: null,

      value: null,

      startup: function() {
        this.inherited(arguments);

      }

  });

  var _RemovableUnorderedList = declare([ _WidgetBase, _TemplatedMixin ], {

      templateString: "<ul></ul>",

      baseClass: "gp-list",

      _items: [],

      startup: function() {
        this.inherited(arguments);
        
        this._items = [];

      },

      addItem: function(label, value) {

        var item = new _RemovableUnorderedListItem({
          label: label,
          value: value
        }, domConstruct.create("li", {}, this.domNode));
        item.startup();

        this._items.push(item);

      },

      removeItem: function(item) {

        // TODO: remove the item from this._items

        item.destroyRecursive();

      }

  });

  return _RemovableUnorderedList;

});