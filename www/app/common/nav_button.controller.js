(function () {
  'use strict';

  angular.module('app.core')
    .controller('buttonCtrl', buttonCtrl)

	buttonCtrl.$inject = ['$scope', 'Baymax'];

	function buttonCtrl($scope, Baymax) {

      $scope.$on('$includeContentLoaded', function () {

        var size = 35;
        var circleRatio = 1/2;

        var items = document.querySelectorAll('.circle a');
        console.log('found items', items);
        for(var i = 0, l=items.length; i<l; i++) {
          items[i].style.right = (50 - size*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI*circleRatio)).toFixed(4) + "%";
          items[i].style.top = (50 + size*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI*circleRatio)).toFixed(4) + "%";
        }
      });

      $scope.buttonClick = function (e) {
        console.log('buttonClick', e);
        document.querySelector('.circle').classList.toggle('open');
      }

      $scope.speech = Baymax.speechAssist;

      $scope.textAssist = function() {
        let textPrompt = prompt('How can I help?');

        //TODO : take out, just for testing purposes
        textPrompt = textPrompt || "make a new note to "+(new Date()).getMinutes();

        Baymax.textAssist(textPrompt);
      }

    }
    // .directive("circleFanOut", ["$interval", function($interval) {
    //   return {
    //     restrict: "A",
    //     link: function(scope, elem, attrs) {
	//
    //       var size = 35;
    //       var circleRatio = 1/2;
	//
    //       var items = document.querySelectorAll('.circle a');
    //       console.log('found items', items);
    //       for(var i = 0, l=items.length; i<l; i++) {
    //         items[i].style.right = (50 - size*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI*circleRatio)).toFixed(4) + "%";
    //         items[i].style.top = (50 + size*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI*circleRatio)).toFixed(4) + "%";
    //       }
    //     }
    //   }
    // }]);
})();
