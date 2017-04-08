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
    var timer;
    var glass = 0;
    var currentMeal = 0;
    var oldCount = 0;
    var imageList = [{id:0, src: "images/Fork.png"},
      {id:1, src: "images/Knife.png"},
      {id:2, src: "images/Spoon.png"},
      {id:3, src: "images/Teaspoon.png"}];

    self.current = tabMeal[2];
    self.next = tabMeal[0];
    self.previous = tabMeal[1];
    self.firstCutlery = false;
    self.secondCutlery = false;
    self.msgToSend = "Bienvenue à votre session repas!";
    self.img = new Image();
    self.img2 = new Image();

    $rootScope.disableNext = true;
    $rootScope.disablePrevious = true;

    initCutlery();
    setImg(self.img, 0);

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
      self.firstCutlery = true;
      self.next = setMealNext(self.next);
      self.current = setMealNext(self.current);
      self.previous = setMealNext(self.previous);
      initSwitch();
      $rootScope.disableNext = true;
    }

    /*
     * Retour au dernier plat
     */
    self.switchPrevious = function (){
      self.next = setMealPrevious(self.next);
      self.current = setMealPrevious(self.current);
      self.previous = setMealPrevious(self.previous);
      initSwitch();
    }

    /*
     * Action de boire
     */
    self.clickGlass = function () {
      self.firstCutlery = false;
      glass++;
    }

    /*
     * Prendre le couteau
     */
    self.clickKnife = function () {
      self.firstCutlery = false;
      self.secondCutlery = false;
      self.knife = setCutlery('p');
      if (self.knife){
        if (self.fork){
          $rootScope.message = 'r';
        }
        self.colorKnife = "white";
      }
    }

    /*
     * Prendre la fourchette
     */
    self.clickFork = function () {
      self.firstCutlery = false;
      self.fork = setCutlery('p');
      if (self.fork){
        if (self.knife){
          $rootScope.message = 'r';
        }
        self.colorFork = "white";
      }
    }

    /*
     * Prendre la petite cuillère
     */
    self.clickTeaspoon = function () {
      self.firstCutlery = false;
      self.teaspoon = setCutlery('d');
      if (self.teaspoon){
        $rootScope.message = 'r';
        self.colorTeaspoon = "white";
      }
    }

    /*
     * Prendre la cuillère
     */
    self.clickSpoon = function () {
      self.firstCutlery = false;
      self.spoon = setCutlery('e');
      if (self.spoon){
        $rootScope.message = 'r';
        self.colorSpoon = "white";
      }
    }

    /*
     * Manger du plat actuel
     */
    self.clickCurrentMeal = function () {
      self.firstCutlery = false;
      if ((self.current.label.indexOf('e') != -1 && self.spoon) || (self.current.label.indexOf('d') != -1 && self.teaspoon) || (self.current.label.indexOf('p') != -1 && self.knife && self.fork)) {
        eat();
      } else {
        $rootScope.message = 'c'; // c pour prendre cutlery
      }
    }

    /*
     * Manger du plat suivant
     */
    self.clickNextMeal = function () {
      self.firstCutlery = false;
      $rootScope.message = 'w';
    }

    /*
     * Manger du plat précédent
     */
    self.clickPreviousMeal = function () {
      self.firstCutlery = false;
      $rootScope.message = 'w';
    }

    /*
     * Lorsqu'on change de plat, on initialise les compteurs et les couleurs
     */
    function initSwitch(){
      initCutlery();
      $timeout.cancel(timer);
      currentMeal = 0;
      oldCount = angular.copy(currentMeal);
      countWeight(function (){
        if (oldCount == currentMeal){
          $rootScope.message = 'l'; //l pour too long
        }
      });
      $rootScope.message = self.current.label;
      setColor(false);
      disableBtn();
    }

    /*
     * Quand on clique dans le plat, on mange
     */
    function eat(){
      $timeout.cancel(timer);
      currentMeal++;
      self.colorCurrent = "white";
      oldCount = angular.copy(currentMeal);
      mealQuantity[self.current.label].weight--;
      if (currentMeal >= mealQuantity[self.current.label].limit || currentMeal >= mealQuantity[self.current.label].weight){
        $rootScope.message = 'n' // n pour next plate
        if (self.current.label.indexOf('d') == -1) {
          $rootScope.disableNext = false;
        }
        if (mealQuantity[self.current.label].weight == 0){
          $rootScope.message = 'n' // n pour next plate
          mealQuantity[self.current.label].weight = 0;
          if (self.current.label.indexOf('d') == -1){
            self.clickNext();
          } else {
            $rootScope.turnPlate = {label: "end"};
          }
        }
      } else {
        self.msgToSend = "";
      }
      countWeight(function (){
        if (oldCount == currentMeal){
          $rootScope.message = 'l'; //l pour too long
        }
      });
    }

    /*
     * Aucun couvert n'est sélectionné
     */
    function initCutlery(){
      self.knife = false;
      self.fork = false;
      self.teaspoon = false;
      self.spoon = false;
    }

    /*
     * On mets un compteur de 15s (15000 = 15s) puis on vérifie si l'utilisateur à touché à son plat
     */
    function countWeight(cb){
      timer = $timeout(function(){
        cb();
      }, 15000);
    }

    /*
     * Est-ce que l'utilisateur prend les bons ustensils pour le bon plat
     */
    function setCutlery(currentMeal){
      if (self.current.label.indexOf(currentMeal) == -1) {
        $rootScope.message = self.current.label;
        return false;
      } else {
        return true;
      }
    }

    /*
     * On met en couleur les ustensils et le plat avec esquels il faut intéragir
     */
    function setColor(bool){ //bool pour savoir s'il faut mettre en lumière les ustensils
      initColor();
      if (self.current.label.indexOf("e") != -1){
        if (!bool){
          self.colorSpoon = "red";
        }
        self.colorCurrent = "purple";
      }
      if (self.current.label.indexOf("p") != -1){
        if (!bool){
          self.colorKnife = "yellow";
          self.colorFork = "blue";
        }
        self.colorCurrent = "green";
      }
      if (self.current.label.indexOf("d") != -1){
        if (!bool){
          self.colorTeaspoon = "orange";
        }
        self.colorCurrent = "cyan";
      }
    }

    /*
     * Désactive les boutons pour tourner le plateau selon où l'on en est dans le repas
     */
    function disableBtn(){
      if (self.current.label.indexOf("e") != -1){
        $rootScope.disablePrevious = true;
        $rootScope.disableNext = false;
      } else if (self.current.label.indexOf("p")!= -1){
        if (mealQuantity[self.previous.label].weight > 0){
          $rootScope.disablePrevious = false;
        } else {
          $rootScope.disablePrevious = true;
        }
        $rootScope.disableNext = false;
      } else if (self.current.label.indexOf("d")!= -1){
        if (mealQuantity[self.previous.label].weight > 0){
          $rootScope.disablePrevious = false;
        } else {
          $rootScope.disablePrevious = true;
        }
        $rootScope.disableNext = true;
      }
    }

    /*
     * Passer au prochain plat en tournant le plateau
     */
    function setMealNext(meal) {
      if (tabMeal.indexOf(meal) == 2){
        meal = tabMeal[0];
      } else {
        meal = tabMeal[tabMeal.indexOf(meal)+1];
      }
      return meal;
    }

    /*
     * Revenir au dernier plat en tournant le plateau
     */
    function setMealPrevious(meal) {
      if (tabMeal.indexOf(meal) == 0){
        meal = tabMeal[2];
      } else {
        meal = tabMeal[tabMeal.indexOf(meal)-1];
      }
      return meal;
    }

    /*
     * Au départ, quand le repas n'a pas commencé, rien n'est en couleur
     */
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

    /*
     * Screen
     */

    /*
     * Faire un retour à l'utilisateur selon ses actions
     */

    $rootScope.$watch("message", function (){
      switch($rootScope.message){
        case 'e':
          self.msgToSend = "Pour manger l'entrée, prenez la cuillère:";
          self.firstCutlery = true;
          self.colorSpoon = "red";
          setImg(self.img, 2);
          break;
        case 'p':
          self.msgToSend = "Pour manger le plat, prenez la fourchette et le couteau:";
          self.colorFork = "blue";
          self.colorKnife = "yellow";
          self.firstCutlery = true;
          setImg(self.img, 0);
          setImg(self.img2, 1);
          self.secondCutlery = true;
          break;
        case 'd':
          self.msgToSend = "Pour manger le dessert, prenez la petite cuillère:";
          self.colorTeaspoon = "orange";
          self.firstCutlery = true;
          setImg(self.img, 3);
          break;
        case 'w':
          self.msgToSend = "Vous ne devez pas manger dans ce plat, mangez dans le plat mis en couleur";
          setColor(true);
          break;
        case 'l':
          self.msgToSend = "Vous n'avez pas touché à votre assiette depuis 5 min, prenez un peu d'eau si nécessaire et mangez un peu de votre plat";
          setColor(true);
          oldCount = angular.copy(currentMeal);
          countWeight(function (){
            if (oldCount == currentMeal){
              $rootScope.message = 'l'; //l pour too long
            }
          });
          break;
        case 'f':
          self.msgToSend = "Vous devez prendre la fourchette et le couteau et non d'autres ustensils:";
          self.colorFork = "blue";
          self.colorKnife = "yellow";
          self.firstCutlery = true;
          setImg(self.img, 0);
          setImg(self.img2, 1);
          self.secondCutlery = true;
          break;
        case 'k':
          self.msgToSend = "Vous devez prendre la fourchette et le couteau et non d'autres ustensils:";
          self.colorFork = "blue";
          self.colorKnife = "yellow";
          self.firstCutlery = true;
          setImg(self.img, 0);
          setImg(self.img2, 1);
          self.secondCutlery = true;
          break;
        case 's':
          self.msgToSend = "Vous devez prendre la cuillère et non d'autres ustensils:";
          self.colorSpoon = "red";
          self.firstCutlery = true;
          setImg(self.img, 2);
          break;
        case 't':
          self.msgToSend = "Vous devez prendre la petite cuillère et non d'autres ustensils:";
          self.colorTeaspoon = "orange";
          self.firstCutlery = true;
          setImg(self.img, 3);
          break;
        case 'r':
          self.msgToSend = "Vous pouvez commencer à manger";
          break;
        case 'n':
          self.msgToSend = "Vous pouvez passer au plat suivant";
          break;
        case 'c':
          self.msgToSend = "Vous ne devez pas manger sans ustensil";
          self.firstCutlery = true;
          break;
      }
      $rootScope.message = '';
    });

    function setImg(img, num){
      img.src = imageList[num].src;
      img.width = imageList[num].width;
      self.secondCutlery = false;
    }

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
