dojo.provide('myApp.Thinger');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('myApp.Thinger', [ dijit._Widget, dijit._Templated ], {
  // template for Thinger
  templateString : '<ul></ul>',
  
  // what to do after a new Thinger 
  // is on the page
  postCreate : function() {
    // create a new list item for each item in things
    dojo.forEach(this.things, function(thing) {
      dojo.place('<li>' + thing + '</li>', this.domNode, 'last');
    }, this);
  }
});