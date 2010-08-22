# Scaffolding a Buildable Dojo Application

One of the most confusing things about using a toolkit like Dojo can be getting it set up properly to take advantage of all of its features, such as its package management system. Sure, you can use a [CDN-hosted version](http://dojotoolkit.org/download/) of the toolkit, but one of the major reasons I like Dojo is because of the dependency management and build tools it offers, and it's difficult to really take advantage of these when you're only using the library from the CDN. 

If you skip the build step, Dojo's modular nature means you'll end up downloading a whole lot of files, and making a whole lot of HTTP requests in the process. It's fine for development and general messing around, or if your project just requires a few files, but for the kinds of projects where I think Dojo really shines, you're going to want to do your own build. 

My goal in this article is to show how I set up my files to make this easier. This is by no means the only way to do it, nor even necessarily a best way to do it -- just one way to do it that you can hopefully follow along with to get you started.  


## Step 1: Getting Dojo

I like to download two different Dojo packages: 

  * The [toolkit release (2mb .tar.gz)](http://download.dojotoolkit.org/release-1.5.0/dojo-release-1.5.0.tar.gz), which includes compressed versions of all of the Dojo, Dijit, and Dojox modules. 
  * The [SDK release (19mb .tar.gz)](http://download.dojotoolkit.org/release-1.5.0/dojo-release-1.5.0-src.tar.gz), which contains uncompressed, commented versions of all the modules, along with the build tools 
  
I generally don't maintain these files in a project's version control system, but I do document that downloading and extracting them is part of setting up a new development instance. Your exact strategy here may vary, but I do encourage at least the JavaScript developers on a project to have both on hand. The former will be used during development; the latter will be used for reference, and to perform the build step.


## Step 2: Where Do I Put It?

For the sake of this article, let's assume that all of your public, static files are served from a directory `www/`. Here's how I might structure things from there:

* www/
  * dojo-toolkit/ (extracted from toolkit release)
  * dojo-sdk/ (extracted from SDK release)
  * myApp/
  
Easy enough. Next, we need to point to Dojo in our HTML.

    #!html
    <script src="dojo-toolkit/dojo/dojo.js"></script>
    
At this point, we could start writing JavaScript that uses Dojo anywhere after that script tag, but that wouldn't be very exciting, smart, or sustainable. Instead, let's create an initial JavaScript file in our `myApp/` directory, called base.js.

    #!javascript
    dojo.provide('myApp.base');
    
    console.log('you found me!');
    
We could just include this file in our page using a script tag, but again, not very sustainable -- next thing you know we'll have 30 script tags in our page, and the whole point here was to take advantage of dependency management and building, right? We can tell Dojo to find and load our file for us, but first, we have to give Dojo a hint as to look. 


## Step 3: Pointing Dojo in the Right Direction

The one "rule" imposed upon you by using Dojo's package system is a simple mapping of dot-notation strings to file locations. If you say `dojo.require("a.b.c.d.e.f.g")`, Dojo will go looking for a file at `a/b/c/d/e/f/g.js`. By default, Dojo assumes that the directory `a/` is a sibling of the directory that contains `dojo.js`, but you can adjust the location of any namespace. 

There are [a few different ways to do this](http://dojotoolkit.org/reference-guide/djConfig.html); my personal preference is to declare the global djConfig variable, but any of the ways mentioned at the link above is obviously valid. If you go the djConfig variable route, just be sure to declare the variable _before_ you include `dojo.js` in your page if you want Dojo to pay attention to it. 

Here's what it would look like for our little app:

    #!javascript
    <script>
    var djConfig = {
      modulePaths : {
        'myApp' : '../../myApp'
      }
    };
    </script>
    
What's up with the `../../` stuff? As mentioned, Dojo by default assumes that any namespace, such as our `myApp` namespace, is a sibling of the `dojo/` directory by default, just like `dijit/` and `dojox/` are. Problem is, our `myApp/` directory doesn't follow this convention. Namespace locations are specified relative to the location of `dojo.js` itself -- in our case, `dojo.js` is located at `dojo-toolkit/dojo/dojo.js`, and so relative to that, our `myApp/` directory is exactly where we said it was: at `../../myApp`. 

Why don't we just make the `myApp/` directory a sibling of the `dojo/` directory, and skip this whole part? We could, but keeping it external to Dojo itself makes managing those Dojo downloads -- especially within a version control system -- a whole lot easier. This way, we can keep our application code entirely separate from Dojo, and add or remove or upgrade Dojo at will without having to worry about our application files. This makes me happy; if it doesn't make you happy, feel free to put your application code wherever you'd like :)


## Step 4: Hooking it Up

Now that Dojo knows where to find our stuff, we can tell it to start looking. We've already included Dojo on our page. Now, instead of adding more script tags to our HTML, we can start to take advantage of Dojo's dependency management system:

    #!javascript
    <script>
    dojo.require('myApp.base');
    </script>
    
This is the only other script tag you're going to need to add to your page; from here on out, everything can be managed inside the JavaScript itself. 

## Step 5: Writing Your App

This step is mostly up to you. Dojo provides great tools for building large applications -- a solid base library with CSS-based node selection, inheritance, pubsub, effects, events, and various other hotness -- and it also has a great UI toolkit in Dijit, including abstracted base UI functionality in dijit.\_Widget and dijit.\_Templated. It provides patterns, but no real prescriptions, so I can't show you how to build a great Dojo app in three paragraphs or less.

However, let's talk a bit more about this dependency management stuff, because by the end of this article, I want you to be able to leverage that dependency management stuff to create production-ready files, regardless of how you build your app.

So, we have our `myApp/base.js` file, and so far it contains this:

    #!javascript
    dojo.provide('myApp.base');

    console.log('you found me!');

Let's assume our app does more than log to the console:

    #!javascript
    dojo.provide('myApp.base');
    
    // specify the file's dependencies
    dojo.require('myApp.Settings');
    dojo.require('myApp.Thinger');
    dojo.require('myApp.Doohickey');
    
    // run code when the dependencies are met
    // and the DOM is ready
    dojo.ready(function() {
      if (myApp.Settings.isThisThingOn) {
        new myApp.Thinger({ things : [ 'a', 'b', 'c' ]})
          .placeAt(dojo.body());
        new myApp.Doohickey({ awesome : true })
          .placeAt(dojo.body());
      }
    });
    
Now we've said, in code, that our app requires three other pieces: Settings, Thinger, and Doohickey. Dojo looks at those `dojo.require()` statements, and decides that it's going to try to fetch `myApp/Settings.js`, `myApp/Thinger.js` and `myapp/Doohickey.js` to satisfy those dependencies. Once it finds them, we can use them. 

The details of our application here aren't super-important (in fact they're entirely made-up); what's important is to understand that we've specified a dependency, and once it is met, some other code runs. 

Chances are that some of our modules have some dependencies of their own. Let's take a look at the make-believe contents of `myApp/Thinger.js`:

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
    
Why look! We've specified yet more dependencies while keeping our code modular and abstracting away common pieces of behavior. Nifty, eh? Meanwhile, our HTML still only has the single `dojo.require()` statement in it, because all of our dependencies are expressed in our code, where they belong.


## Step 6: Build It

We've seen how to express these dependencies, but if you've been paying attention to Firebug or your development tool of choice, you've noticed there are still a ton of HTTP requests happening. What, exactly, have we gained here? 

Remember how we downloaded that 19mb SDK? Besides the fact that it has uncompressed, commented versions of every single Dojo file, it also includes the build tool, and now we're going to put it to use.

The commands for running a build are, sadly, not something I keep in my brain, so I like to make a tiny shell script in my application directory that looks like this:

    cd ../dojo-sdk/util/buildscripts
    ./build.sh profileFile=../../../myApp/myApp.profile.js releaseDir=../../../release
    
Could this be prettier? Probably, but it does the trick. It puts us in the buildscripts directory, then runs the `build.sh` file that's there with the provided arguments: the location of the profile file for the build, and the location we'd like the build to end up. Both of these locations are relative to the `dojo-sdk/util/buildscripts/build.sh` file, so keep that in mind if you decided you didn't like how I organized my files and did something different.

Now all we have to do is create that profile file. You can look in `dojo-sdk/util/buildscripts/profiles/` for some examples, but here's a good start:

    dependencies = {
      stripConsole : 'all',
      action : 'clean,release',
      optimize : 'shrinksafe',
      releaseName : 'myApp',
      localeList : 'en-us',

      layers: [
        {
          name: "../myApp/base.js",
          resourceName : "myApp.base",
          dependencies: [
            "myApp.base"
          ]
        }
      ],

      prefixes: [
        [ "dijit", "../dijit" ], 
        [ "dojox", "../dojox" ],
        [ "myApp", "../../myApp" ]
      ]
    }
    
OK, seriously, what is _up_ with these relative paths? I will tell you right now that the first time I saw this it was a complete mindf*ck, and the only way I can put together a build for a new project in 10 minutes or less is by referring to a profile file for an old project (which is part of the reason I'm writing this post). Let's take a look at what's going on here, though:

  * The `dependencies` object is the top level object describing the profile. Initially, you can set all of the command-line arguments here as members, e.g.: stripConsole to remove any `console.*` calls in code, a required `action` parameter, and so on. (Note that we could also specify the releaseDir argument here if we wanted; I tend to keep it in the shell script, but not for a particularly good reason.)
  * The `layers` array contains a list of all of the production-ready "layers" you want the build to create. In this case, we're telling the build to create one layer that contains all of our application code (in a minute we'll look at how to specify multiple layers for serious hotness). 
    * The `name` property of each layer tells the build tool where the created layer should be placed relative to `dojo.js` in the destination directory. 
    * The `resourceName` property tells the build tool how we plan to refer to this layer in our code. For the sake of this article, we're going to refer to it in our code exactly how we're already referring to it in our code. 
    * The `dependencies` property is an array of modules that this layer depends on. In this case, the layer sort of depends on itself, causing the build to physically replace the original myApp/base.js file with the result of all the dependencies. 
  * The `prefixes` array is sort of like the `modulePaths` specification in djConfig, which makes sense because the build tool can't see the djConfig settings. It tells the build tool where it's going to find files for a given namespace. Any namespace that you use in your code needs to be specified here. If you aren't using any DojoX modules, feel free to omit the "dojox" prefix to avoid copying the unused code into your built tree. 
  
So! Let's cd into our `myApp/` directory, where we've created our little build script and `myApp.profile.js`, and run that build script.

\[ ... about 30 seconds later ... \]

Sweet. Now we have a `release/` directory next to our `myApp/` directory, and it looks like this:

  * release
    * myApp
      * dijit
      * dojo
      * dojox
      * myApp
      
We can see exactly what the build did by looking at `release/myApp/dojo/build.txt` -- it shows that it created a `dojo.js` file for us, as well as the `myApp/base.js` file we asked it to create, complete with all of our dependencies.

Now, to use our built files, we need to do two things:

  * Remove our djConfig settings; they're not necessary now that the built `myApp/` is a sibling of the `dojo/` directory.
  * Change the script tag in our HTML that includes `dojo.js` to point at `release/myApp/dojo/dojo.js`.
  
We can do this by hand, but once we have this working, we'd be smart to do it with some sort of switch in our application that decides whether we're in development or production mode and outputs the right code accordingly. 


## Step 7: Building it Better

Imagine, if you will, that the `myApp.Doohickey` module is only needed on one page of your application, and that page is used rarely. Not only that, the module has a ton of dependencies that aren't shared by any other modules, and it's seriously stupid to be taking the time to load all that code when it's unlikely it's going to be needed. Our current profile file doesn't make any allowances for this, but two adjustments can separate this functionality from the built files of the core application.

First, let's give the directive in the profile file to build a separate layer for `myApp.Doohickey`. It won't work without `myApp.base`, so we specify that as a layer dependency:

    dependencies = {
      stripConsole : 'all',
      action : 'clean,release',
      optimize : 'shrinksafe',
      releaseName : 'myApp',
      localeList : 'en-us',

      layers: [
        {
          name: "../myApp/base.js",
          resourceName : "myApp.base",
          dependencies: [
            "myApp.base"
          ]
        },
    
        {
          name: "../myApp/Doohickey.js",
          resourceName : "myApp.Doohickey",
          dependencies : [
            "myApp.Doohickey"
          ],
          layerDependencies : [
            "../myApp/base.js"
          ]
        }
      ],

      prefixes: [
              [ "dijit", "../dijit" ], 
              [ "dojox", "../dojox" ],
              [ "myApp", "../../myApp" ]
      ]
    }

Second, we need to make sure the build tool doesn't see `dojo.require('myApp.Doohickey')` and decide it needs to include it in the base layer. This may seem a little weird, but the build tool basically just parses files to figure out which other files they require, and it does this by looking for `dojo.require()` statements. Hiding the Doohickey requirement from the build tool while keeping it in place for development is easy:

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


## Step 8

There is no step 8. There is step 1 through 7, which is way more than "put this script tag (and 20 others!) on your page and GO", I'll give you that. But take heart: not long ago, these steps had me pulling my hair out, and now I can write a blog post about them (with some much-appreciated review from [Ken](http://kennethfranqueiro.com/) and [Pete](http://higginsforpresident.net)). I hope they help you understand the steps you'd take to start taking advantage of the power of Dojo's pacakge system, and I promise that once you've done it once or twice, it won't seem like the roadblock it does at first, especially because the payoff in the long run is huge.


## Further Reading

  * [Documentation of the Dojo build system](http://docs.dojocampus.org/build/index)
  * [dojo.cache](http://docs.dojocampus.org/dojo/cache): Using module paths to specify the location of strings such as templates, which are then interned into your code at build time: `dojo.cache('myApp.templates', 'Thinger.html)`