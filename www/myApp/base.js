dojo.provide('myApp.base');

// specify the file's dependencies
dojo.require('myApp.Thinger');
dojo.require('myApp.Doohickey');

// run code when the dependencies are met
// and the DOM is ready
dojo.ready(function() {
  new myApp.Thinger({ things : [ 'a', 'b', 'c' ]})
    .placeAt(dojo.body());
  new myApp.Doohickey({ awesome : true })
    .placeAt(dojo.body());
});

/*
alternate version if we only want to load
doohickey under certain circumstances, 
and don't want it in our base layer
dojo.provide('myApp.base');

dojo.require('myApp.Settings');
dojo.require('myApp.Thinger');

dojo.addOnLoad(function() {
  new myApp.Thinger({ things : [ 'a', 'b', 'c' ]})
    .placeAt(dojo.body());
});

if (pageNeedsDoohickey) {
  dojo["require"]('myApp.Doohickey');
  dojo.addOnLoad(function() {
    new myApp.Doohickey({ awesome : true })
      .placeAt(dojo.body());
  });
}
*/
