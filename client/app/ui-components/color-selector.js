'use strict';

angular.module('brainedIoApp')

.directive('colorSelector', ['$position', 'veroldRemote', 'FunctionalAreas',
  'highlightDelta',
  function ($position, veroldRemote, FunctionalAreas, highlightDelta) {
    return {
      restrict: 'E',
      scope: {
        'modelObject': '=',
        'brodmannArea': '=',
        'functionalArea': '=',
        'opacity': '=',
        'sides': '='
      },
      templateUrl: '/app/ui-components/color-selector.html',
      link: function (scope) {
        if (!scope.opacity) {
          scope.opacity = '100';
        }

        if (!scope.sides) {
          scope.sides = {
            leftSelected: true,
            rightSelected: true
          };
        }
        // Hide the picker to begin with
        scope.showPicker = false;
        // List of colours to be used in the picker
        scope.colorList = ['#FA2B31', '#00DCE6', '#C3E91D', '#008C78',
          '#FF5E35', '#BF1D4A', '#FDC312'
        ];
        // If the loaded colour is not in the list pick a default
        scope.$watch('modelObject', function () {
          console.log('aa', scope.modelObject);
          if (scope.modelObject &&
            scope.colorList.indexOf(scope.modelObject) === -1) {
            scope.modelObject = scope.colorList[0];
          }
        });


        // Select Side
        scope.selectSide = function (event, isLeft) {
          if (isLeft) {
            scope.sides.leftSelected = !scope.sides.leftSelected;
          } else {
            scope.sides.rightSelected = !scope.sides.rightSelected;
          }
          event.preventDefault();
          event.stopPropagation();

          if (scope.brodmannArea) {
            veroldRemote.unhighlight([{
              regionName: scope.brodmannArea
            }]);
            veroldRemote.highlight([{
              regionName: scope.brodmannArea,
              color: scope.modelObject,
              opacity: scope.opacity,
              sides: scope.sides
            }]);
          }
        };

        // Show/hide picker
        scope.togglePicker = function (event) {
          scope.showPicker = !scope.showPicker;
          event.preventDefault();
          event.stopPropagation();
        };
        // Pick a colour and hide the picker
        scope.selectColor = function (event, color) {
          event.preventDefault();
          event.stopPropagation();
          scope.modelObject = color;
          if (scope.brodmannArea) {
            veroldRemote.highlight([{
              regionName: scope.brodmannArea,
              color: color,
              opacity: scope.opacity,
              sides: scope.sides
            }]);
          }
          else {
            FunctionalAreas[scope.functionalArea] = highlightDelta.setColourForHighlights(
              color, FunctionalAreas[scope.functionalArea]);
            veroldRemote.highlight(FunctionalAreas[scope.functionalArea]);
          }
        };

        //change the opacity of the current brodmann or functional area
        scope.updateOpacity = function (event) {
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }

          if (scope.brodmannArea) {
            veroldRemote.unhighlight([{
              regionName: scope.brodmannArea
            }]);
            veroldRemote.highlight([{
              regionName: scope.brodmannArea,
              color: scope.modelObject,
              opacity: scope.opacity,
              sides: scope.sides
            }]);
          } else {
            FunctionalAreas[scope.functionalArea] = highlightDelta.setOpacityForHighlights(
              scope.opacity, FunctionalAreas[scope.functionalArea]);
            veroldRemote.highlight(FunctionalAreas[scope.functionalArea]);
          }
        };
      }
    };
  }
]);