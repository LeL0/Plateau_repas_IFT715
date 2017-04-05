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
    .directive('mainNav', tinMainNav);

  function tinMainNav() {

    // Definition of directive
    var directiveDefinitionObject = {
      restrict: 'E',
      templateUrl: 'components/directives/main-nav.html',
      scope: {
        selected: "="
      },
      link: function (scope) {
        scope.start = false;
        scope.end = false;

        scope.startStarter = function () {
          scope.start = true;
          scope.starter = true;
          scope.step = "starter";
        }

        scope.startMeal = function () {
          scope.starter = false;
          scope.meal = true;
          scope.step = "meal";
        }

        scope.startDessert = function () {
          scope.meal = false;
          scope.dessert = true;
          scope.step = "dessert";
        }

        scope.endLunch = function () {
          scope.dessert = false;
          scope.start = false;
          scope.end = true;
        }
      }
    };
    return directiveDefinitionObject;
  }

})();
