dependencies = {
    stripConsole: 'all',
    action: 'clean,release',
    optimize: 'shrinksafe',
    releaseName: 'myApp',
    localeList: 'en-us',

    layers: [
      {
          name: "../myApp/base.js",
          resourceName: "myApp.base",
          dependencies: [
            "myApp.base"
          ]
      }

      /*
      if we want a separate layer for the Doohickey
      module, we can create one by adding this
      section below
      */
    
      /*
      ,

      {
          name: "../myApp/Doohickey.js",
          resourceName: "myApp.Doohickey",
          dependencies: [
            "myApp.Doohickey"
          ],
          layerDependencies: [
            "../myApp/base.js"
          ]
      }
      */
    ],

    prefixes: [
      ["dijit", "../dijit"],
      ["dojox", "../dojox"],
      ["myApp", "../../myApp"]
    ]
}