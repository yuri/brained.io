'use strict';

angular.module('brainedIoApp')

.directive('infoModal', ['appDelegate',
  function (appDelegate) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/app/ui-components/info-modal.html',
      link: function (scope) {
        scope.appDelegate = appDelegate;
        scope.toggleInfoModule = function () {
          scope.appDelegate.isInfoModalOpen = !scope.appDelegate.isInfoModalOpen;
        };
      }
    };
  }
]);