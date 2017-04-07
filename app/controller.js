/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 *
 */
;(function() {

  angular
    .module('boilerplate')
    .controller('MainController', MainController);

  MainController.$inject = ['LocalStorage', 'QueryService', '$rootScope'];


  function MainController(LocalStorage, QueryService, $rootScope) {

    // 'controller as' syntax
    var self = this;
    var tabMeal = [{name:"Entrée", label:"e"}, {name:"Plat", label:"p"}, {name:"Dessert", label:"d"}];
    self.current = tabMeal[2];
    self.next = tabMeal[0];
    self.previous = tabMeal[1];
    self.disableNext = true;
    self.disablePrevious = true;
    initColor();

    $rootScope.$watch('switchMeal', function(){
      if ($rootScope.switchMeal > 0){
        self.switchNext();
      }
      if (self.current.label.indexOf("e") != -1){
        self.colorSpoon = "red";
        self.colorCurrent = "purple";
      }
      if (self.current.label.indexOf("p") != -1){
        self.colorKnife = "yellow";
        self.colorFork = "blue";
        self.colorCurrent = "green";
      }
      if (self.current.label.indexOf("d") != -1){
        self.colorTeaspoon = "orange";
        self.colorCurrent = "brown";
      }
    });

    self.clickNext = function(){
      $rootScope.turnPlate = self.next;
      self.switchNext();
    }

    self.clickPrevious = function(){
      $rootScope.turnPlate = self.previous;
      self.switchPrevious();
    }

    self.switchNext = function (){
      self.next = setMealNext(self.next);
      self.current = setMealNext(self.current);
      self.previous = setMealNext(self.previous);
      disableBtn();
    }

    self.switchPrevious = function (){
      self.next = setMealPrevious(self.next);
      self.current = setMealPrevious(self.current);
      self.previous = setMealPrevious(self.previous);
      disableBtn();
    }

    function disableBtn(){
      if (self.current.label.indexOf("e") != -1){
        self.disablePrevious = true;
        self.disableNext = false;
      } else if (self.current.label.indexOf("p")!= -1){
        self.disablePrevious = false;
        self.disableNext = false;
      } else if (self.current.label.indexOf("d")!= -1){
        self.disablePrevious = false;
        self.disableNext = true;
      }
    }

    function setMealNext(meal) {
      if (tabMeal.indexOf(meal) == 2){
        meal = tabMeal[0];
      } else {
        meal = tabMeal[tabMeal.indexOf(meal)+1];
      }
      return meal;
    }

    function setMealPrevious(meal) {
      if (tabMeal.indexOf(meal) == 0){
        meal = tabMeal[2];
      } else {
        meal = tabMeal[tabMeal.indexOf(meal)-1];
      }
      return meal;
    }

    function initColor(){
      self.colorCurrent = "white";
      self.colorStarter = "white";
      self.colorMeal = "white";
      self.colorDessert = "white";
      self.colorDrink = "white";
      self.colorTeaspoon = "white";
      self.colorFork = "white";
      self.colorKnife = "white";
      self.colorSpoon = "white";
    }
    ////////////  function definitions


    /**
     * Load some data
     * @return {Object} Returned object
     */
    // QueryService.query('GET', 'posts', {}, {})
    //   .then(function(ovocie) {
    //     self.ovocie = ovocie.data;
    //   });
  }


})();
