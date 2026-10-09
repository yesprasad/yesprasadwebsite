---
title: "ng-course : Angular 1.6 beginner course practice :part1"
date: 2017-04-21
section: lab
tags: ["Angular"]
summary: "My angularjs practice sessions after a long time"
---

My angularjs practice sessions after a long time

```js
(function(){
    var app = angular.module('gemstore',[ ]);

    app.controller('panelController', function() {
        this.tab = 1;

        this.selectedTab = function(inputTab) {
            this.tab = inputTab;
        }

        this.isSelected = function(checkTab) {
            return this.tab === checkTab;
        }
    });

    app.controller('storeController', function() {
        this.products = gems;
    });

    const gems =  [
    {
        name: 'White Middleton',
        price: '2', 
        description: `White Middleton, as the name goes is a white diamond that was found by the Middleton family while they were 
        on their family trip to Africa in late 1830s. The colonial family, has since then been in posession of the diamond and so is the name of it`,
        isAvailable: true,
        image: 'http://www.naturallycolored.com/images/colored-diamonds/Fancy-Vivid-Yellow-Orange-diamond-1339.jpg'
    },
    {
        name: 'Orange lady',
        price: '2.95',
        description: 'Orange lady has been dominating the world of diamonds for a long time.',
        isAvailable: true,
        image:'http://royal-fans.com/wp-content/uploads/2014/02/WHITE-TOPAZ-STUD-EARRINGS-01.jpg'
    }
    ]
})();
```

```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="angular.min.js"></script>
        <script type="text/javascript" src="app.js"></script>
      <link rel="stylesheet" href="bootstrap.min.css">
    </head>
    <body ng-app="gemstore">
        <div>
        <h3>welcome to gemStore</h3>
       </div>
       <div ng-controller="storeController as store">
           <div ng-repeat="product in store.products | orderBy: 'name'">
                <b><p>{{product.name | uppercase}}</p></b>
                <p class="price">{{product.price | currency}}</p>
                <img ng-src="{{product.image}}" width="120px" height="120px"/>
                </br>
                <button ng-show="product.isAvailable">Buy Now</button>
           
           <section ng-controller="panelController as panel">
               <ul class="nav nav-pills">
                   <li ng-class="{active:panel.isSelected(1)}">
                       <a href  ng-click="panel.selectedTab(1)">Description</a>
                   </li>
                   <li ng-class="{active:panel.isSelected(2)}">
                       <a href  ng-click="panel.selectedTab(2)">Reviews</a>
                   </li>
                   <li ng-class="{active:panel.isSelected(3)}">
                       <a href  ng-click="panel.selectedTab(3)">Specifications</a>
                   </li>
               </ul>
          
           <div>
               <div ng-show="panel.isSelected(1)">
                   <h5>{{product.description}}</h5>
               </div>
               <div ng-show="panel.isSelected(2)">
                   <h5>Nothing</h5>
               </div>
               <div ng-show="panel.isSelected(3)">
                   <h5>None</h5>
               </div>
           </div>
            </section>
           </br>
           </br>
           </div>
       </div>
    </body>
</html>
```
