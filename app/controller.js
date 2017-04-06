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

  MainController.$inject = ['LocalStorage', 'QueryService'];


  function MainController(LocalStorage, QueryService) {

    // 'controller as' syntax
    var self = this;
    var tabMeal = ["Entrée", "Plat", "Dessert"];
    self.current = tabMeal[2];
    self.next = tabMeal[0];
    self.previous = tabMeal[1];

    self.switch = function (){
      if (tabMeal.indexOf(self.current) == 2){
        self.current = tabMeal[0];
      } else {
        self.current = tabMeal[tabMeal.indexOf(self.current)+1];
      }
      if (tabMeal.indexOf(self.next) == 2){
        self.next = tabMeal[0];
      } else {
        self.next = tabMeal[tabMeal.indexOf(self.next)+1];
      }
      if (tabMeal.indexOf(self.previous) == 2){
        self.previous = tabMeal[0];
      } else {
        self.previous = tabMeal[tabMeal.indexOf(self.previous)+1];
      }
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
