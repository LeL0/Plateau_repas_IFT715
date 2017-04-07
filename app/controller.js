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

  MainController.$inject = ['LocalStorage', 'QueryService', '$rootScope', '$timeout'];


  function MainController(LocalStorage, QueryService, $rootScope, $timeout) {

    // 'controller as' syntax
    var self = this;
    var tabMeal = [{name:"Entrée", label:"e"}, {name:"Plat", label:"p"}, {name:"Dessert", label:"d"}];
    var mealQuantity = {'e': {weight: 10, limit:5}, 'p': {weight: 15, limit:8}, 'd': {weight: 10, limit:5}} // limit permet de savoir le quantité minimum à manger
    self.current = tabMeal[2];
    self.next = tabMeal[0];
    self.previous = tabMeal[1];
    self.disableNext = true;
    self.disablePrevious = true;
    self.glass = 0;
    self.currentMeal = 0;
    self.oldCount = 0;

    /*
     * Plate
     */

    $rootScope.$watch('switchMeal', function(){
      if ($rootScope.switchMeal > 0){
        self.switchNext();
      }
    });

    $rootScope.$watch('end', function(){
      if ($rootScope.end){
        initColor();
      }
    });

    /*
     * Clic du btn pour passer au prochain plat
     */
    self.clickNext = function(){
      $rootScope.turnPlate = self.next;
      self.switchNext();
    }

    /*
     * Clic du btn pour revenir au dernier plat
     */
    self.clickPrevious = function(){
      $rootScope.turnPlate = self.previous;
      self.switchPrevious();
    }

    /*
     * Passage au prochain plat
     */
    self.switchNext = function (){
      self.next = setMealNext(self.next);
      self.current = setMealNext(self.current);
      self.previous = setMealNext(self.previous);
      self.currentMeal = 0;
      self.oldCount = angular.copy(self.currentMeal);
      countWeight(function (){
        if (self.oldCount == self.currentMeal){
          $rootScope.message = 'l'; //l pour too long
        }
      });
      $rootScope.message = self.current.label;
      setColor();
      disableBtn();
    }

    /*
     * Retour au dernier plat
     */
    self.switchPrevious = function (){
      self.next = setMealPrevious(self.next);
      self.current = setMealPrevious(self.current);
      self.previous = setMealPrevious(self.previous);
      self.currentMeal = 0;
      self.oldCount = angular.copy(self.currentMeal);
      countWeight(function (){
        if (self.oldCount == self.currentMeal){
          $rootScope.message = 'l'; //l pour too long
        }
      });
      $rootScope.message = self.current.label;
      setColor();
      disableBtn();
    }

    /*
     * Action de boire
     */
    self.clickGlass = function () {
      self.glass++;
    }

    /*
     * Prendre le couteau
     */
    self.clickKnife = function () {
      if (setCutlery('p')){
        $rootScope.message = 'r';
        self.colorKnife = "white";
      }
    }

    /*
     * Prendre la fourchette
     */
    self.clickFork = function () {
      if (setCutlery('p')){
        $rootScope.message = 'r';
        self.colorFork = "white";
      }
    }

    /*
     * Prendre la petite cuillère
     */
    self.clickTeaspoon = function () {
      if (setCutlery('d')){
        $rootScope.message = 'r';
        self.colorTeaspoon = "white";
      }
    }

    /*
     * Prendre la cuillère
     */
    self.clickSpoon = function () {
      if (setCutlery('e')){
        $rootScope.message = 'r';
        self.colorSpoon = "white";
      }
    }

    /*
     * Manger du plat actuel
     */
    self.clickCurrentMeal = function () {
      self.currentMeal++;
      self.msgToSend = "";
      self.colorCurrent = "white";
      self.oldCount = angular.copy(self.currentMeal);
      if (self.currentMeal >= mealQuantity[self.current.label].limit){
        $rootScope.message = 'n' // n pour next plate
      }
      countWeight(function (){
        if (self.oldCount == self.currentMeal){
          $rootScope.message = 'l'; //l pour too long
        }
      });
    }

    /*
     * Manger du plat suivant
     */
    self.clickNextMeal = function () {
      $rootScope.message = 'w';
    }

    /*
     * Manger du plat précédent
     */
    self.clickPreviousMeal = function () {
      $rootScope.message = 'w';
    }

    function countWeight(cb){
      $timeout(function(){
        cb();
      }, 15000);
    }

    function setCutlery(currentMeal){
      if (self.current.label.indexOf(currentMeal) == -1) {
          $rootScope.message = self.current.label;
        return false;
      } else {
        return true;
      }
    }

    function setColor(){
      initColor();
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
     /* $timeout(function(){
        self.colorCurrent = "white";
      }, 30000);*/
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

    function initColorCutlery(){
      self.colorDrink = "white";
      self.colorTeaspoon = "white";
      self.colorFork = "white";
      self.colorKnife = "white";
      self.colorSpoon = "white";
    }

    /*
     * Screen
     */

    $rootScope.$watch("message", function (){
      switch($rootScope.message){
        case 'e':
          self.msgToSend = "Pour manger l'entrée, prenez la cuillère.";
          break;
        case 'p':
          self.msgToSend = "Pour manger le plat, prenez la fourchette et le couteau.";
          break;
        case 'd':
          self.msgToSend = "Pour manger le dessert, prenez la petite cuillère";
          break;
        case 'w':
          self.msgToSend = "Vous ne devez pas manger dans ce plat, mangez dans le plat mis en couleur";
          setColor();
          $timeout(function(){
            initColorCutlery();
          }, 5000);
          break;
        case 'l':
          self.msgToSend = "Vous n'avez pas touché à votre assiette depuis 5 min, prenez un peu d'eau si nécessaire et mangez un peu de votre plat";
          setColor();
          $timeout(function(){
            initColorCutlery();
          }, 5000);
          self.oldCount = angular.copy(self.currentMeal);
          countWeight(function (){
            if (self.oldCount == self.currentMeal){
              $rootScope.message = 'l'; //l pour too long
            }
          });
          break;
        case 'f':
          self.msgToSend = "Vous devez prendre la fourchette et le couteau et non d'autres ustensils";
          break;
        case 'k':
          self.msgToSend = "Vous devez prendre la fourchette et le couteau et non d'autres ustensils";
          break;
        case 's':
          self.msgToSend = "Vous devez prendre la cuillère et non d'autres ustensils";
          break;
        case 't':
          self.msgToSend = "Vous devez prendre la petite cuillère et non d'autres ustensils";
          break;
        case 'r':
          self.msgToSend = "Vous pouvez commencer à manger";
          break;
        case 'n':
          self.msgToSend = "Vous pouvez passer au plat suivant";
          break;
      }
    });

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
