'use strict';

angular.module('brainedIoApp')

.directive('loadingSocket', ['appDelegate',
  function (appDelegate) {
    return {
      restrict: 'E',
      template: '<div class="backdrop" ng-if="appDelegate.isBusy"><div class="socket"></div></div>',
      compile: function (element) {

        for (var a = element.find('div'), b = 0; 37 >= b; b++) {
          var c = angular.element('<div />');

          // Verold code.
          c.addClass('gel'),
          c.append(angular.element('<div class="hex-brick h1" />')),
          c.append(angular.element('<div class="hex-brick h2" />')),
          c.append(angular.element('<div class="hex-brick h3" />')),

          0 === b ? c.addClass('center-gel') : (c.addClass('c' + b),

            b > 0 && 7 > b ? c.addClass('r1') : b >= 7 && 18 > b ? c.addClass(
              'r2') : c.addClass('r3')),

          a.append(c);
        }

        return function (scope) {
          scope.appDelegate = appDelegate;
        };
      }
    };
  }
]);