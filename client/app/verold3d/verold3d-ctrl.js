'use strict';

angular.module('brainedIoApp')

.controller('Verold3dCtrl', ['$scope', 'appDelegate', 'presentation',
  'navService',
  function ($scope, appDelegate, presentation, navService) {
    $scope.appDelegate = appDelegate;
    $scope.navService = navService;
    $scope.presentation = presentation;
    $scope.appDelegate.load3DContent();
  }
]);