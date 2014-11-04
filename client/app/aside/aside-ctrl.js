'use strict';

angular.module('brainedIoApp')

.controller('AsideCtrl', ['$scope', 'appDelegate', 'presentation',
  function ($scope, appDelegate, presentation) {
    $scope.appDelegate = appDelegate;
    $scope.presentation = presentation;
    $scope.active = $scope.appDelegate.activeSlideId();
  }
]);