;(function() {

  'use strict';

  /**
   * Main navigation, just a HTML template
   * @author Jozef Butko
   * @ngdoc  Directive
   *
   * @example
   * <main-nav><main-nav/>
   *
   */
  angular
    .module('boilerplate')
    .directive('mainNav', ['$rootScope', tinMainNav]);

  function tinMainNav($rootScope) {

    // Definition of directive
    var directiveDefinitionObject = {
      restrict: 'E',
      templateUrl: 'components/directives/main-nav.html',
      scope: {
        selected: "="
      },
      link: function (scope) {
        //$rootScope.test;
        scope.start = false;
        $rootScope.end = false;
        $rootScope.switchMeal = 0;
        $rootScope.turnPlate = {name:"", label:""}

        $rootScope.$watch('turnPlate', function(){
          if ($rootScope.turnPlate.label.indexOf("end")!=-1){
            scope.endLunch();
          } else if ($rootScope.turnPlate.label.indexOf("e")!=-1){
            scope.startStarter();
          } else if ($rootScope.turnPlate.label.indexOf("p")!=-1){
            scope.startMeal();
          } else if ($rootScope.turnPlate.label.indexOf("d")!=-1){
            scope.startDessert();
          }

        });

        scope.incrementSwitch = function (){
          $rootScope.switchMeal++;
        }

        scope.startStarter = function () {
          scope.start = true;
          scope.starter = true;
          scope.meal = false;
          scope.dessert = false;
          scope.step = "starter";
        }

        scope.startMeal = function () {
          scope.starter = false;
          scope.meal = true;
          scope.dessert = false;
          scope.step = "meal";
        }

        scope.startDessert = function () {
          scope.starter = false;
          scope.meal = false;
          scope.dessert = true;
          scope.step = "dessert";
        }

        scope.endLunch = function () {
          scope.starter = false;
          scope.meal = false;
          scope.dessert = false;
          scope.start = false;
          $rootScope.end = true;
        }
      }
    };
    return directiveDefinitionObject;
  }

})();
