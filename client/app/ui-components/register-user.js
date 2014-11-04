'use strict';

angular.module('brainedIoApp')

.directive('registerUser', ['koast', '$log',
  function (koast, $log) {
    return {
      scope: {},
      restrict: 'E',
      templateUrl: '/app/ui-components/register-user.html',
      link: function (scope) {
        scope.showRegistrationForm = koast.user.isAuthenticated && !koast.user
          .meta
          .isRegistered;

        scope.logout = function () {
          koast.user.logout();
        };

        scope.register = function () {
          var username = scope.selectedUsername;
          koast.user.checkUsernameAvailability(username)
            .then(function (isAvailable) {
              if (isAvailable) {
                scope.usernameTaken = false;
                koast.user.registerSocial({
                  username: username
                })
                  .then(function () {
                    scope.showRegistrationForm = false;
                  });
              } else {
                scope.usernameTaken = true;
              }
            })
            .then(null, $log.error);
        };
      }
    };
  }
]);