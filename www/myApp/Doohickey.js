dojo.provide('myApp.Doohickey');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

// we're pretending there are lots of 
// other dependencies for this file
dojo.require('dojox.validate.us');
dojo.require('dojox.charting.Chart2D');

dojo.declare('myApp.Doohickey', [ dijit._Widget, dijit._Templated ], {
  // template for Doohickey
  templateString : '<div></div>',
  
  // what to do after a new Doohickey
  // is on the page
  postCreate : function() {
    dojo.place(
      this.awesome ? '<h1>AWESOME</h1>' : '<h6>sad</h6>', 
      this.domNode, 
      'only'
    );
  }
});