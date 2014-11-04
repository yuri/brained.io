'use strict';

angular.module('brainedIoApp')

.controller('ToolbarCtrl', ['$scope', 'koast', 'appDelegate', 'presentation',
  'drawer',
  function ($scope, koast, appDelegate, presentation, drawer) {

    $scope.appDelegate = appDelegate;
    $scope.presentation = presentation;
    $scope.drawer = drawer;
    $scope.user = koast.user;

    // Add sign in and sign out functions.
    $scope.signIn = function () {
      // Maybe do something before starting sign in.
      $scope.appDelegate.showLogin = true;
    };
    $scope.signOut = function () {
      // Maybe do something before signing the user out.
      koast.user.logout();
    };
    $scope.toggleInfoModule = function () {
      $scope.appDelegate.isInfoModalOpen = !$scope.appDelegate.isInfoModalOpen;
    };
  }
]);