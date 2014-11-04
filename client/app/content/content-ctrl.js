'use strict';

angular.module('brainedIoApp')

.controller('ContentCtrl', ['$scope', '$filter', 'appDelegate', 'presentation',
  function ($scope, $filter, appDelegate, presentation) {

    presentation.loadOther();

    $scope.appDelegate = appDelegate;
    $scope.presentation = presentation;
    $scope.ownerFilter = appDelegate.ownerFilter;
    $scope.filterby = 0; // Default filter is none i.e all
    $scope.orderBy = ''; // Default is none 

    // Display the presentations: 0-All, 1-Featured, 2-Latest
    $scope.displayPresentations = function (filterby) {
      $scope.filterby = filterby;
    };

    // Filter the presentation based ont he conditions set return true to
    // allow and false to restrict
    $scope.filterFunction = function (element) {
      $scope.orderBy = 'name';
      if ($scope.filterby === 0) {
        return true;
      } else if ($scope.filterby === 1 && element.featured) {
        return true;
      } else if ($scope.filterby === 2) {
        $scope.orderBy = '-timestamp';
        return true;
      }
      return false;
    };

    // Filter presentations based on ownership
    $scope.filterPres = function (presentation) {
      if ($scope.appDelegate.ownerFilter) {
        return presentation.can.edit;
      } else {
        return presentation.published;
      }
    };
  }
]);