'use strict';

angular.module('brainedIoApp')

.directive('socialLogin', ['appDelegate', 'koast',
  function (appDelegate, koast) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/app/ui-components/social-login.html',
      link: function (scope) {
        scope.appDelegate = appDelegate;
        scope.koast = koast;

        //close the popup window
        scope.close = function () {
          scope.appDelegate.showLogin = false;
        };

        //start the logining through the selected service
        scope.login = function (provider) {
          console.log('login', provider);
          koast.user.initiateOauthAuthentication(provider);
        };
      }
    };
  }
]);