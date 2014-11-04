'use strict';

angular.module('brainedIoApp')

.directive('cameraSelect', ['veroldRemote',
  function (veroldRemote) {
    return {
      restrict: 'E',
      scope: {
        'ngModel': '=',
      },
      templateUrl: '/app/ui-components/camera-select.html',
      link: function (scope) {
        scope.cameras = [{
          name: 'Superior (Top)',
          position: 'Top',
          selected: false
        }, {
          name: 'Anterior (Front)',
          position: 'Front',
          selected: false
        }, {
          name: 'Inferior (Bottom)',
          position: 'Bottom',
          selected: false
        }, {
          name: 'Posterior (Back)',
          position: 'Back',
          selected: false
        }, {
          name: 'Right Lateral',
          position: 'Right',
          selected: false
        }, {
          name: 'Left Lateral',
          position: 'Left',
          selected: false
        }];

        // Give default value to ngModel if undefined
        if (typeof (scope.ngModel) === 'undefined') {
          scope.ngModel = scope.cameras[0].position;
          scope.cameras[0].selected = true;
        } else {
          // Otherwise mark selected camera
          angular.forEach(scope.cameras, function (camera) {
            if (scope.ngModel === camera.position) {
              camera.selected = true;
            }
          });
        }

        // Select An Item
        scope.selectCamera = function (index) {
          scope.clearSelection();
          scope.ngModel = scope.cameras[index].position;
          scope.cameras[index].selected = true;
          veroldRemote.moveCameraTo(scope.ngModel);
        };

        // Clear Selections
        scope.clearSelection = function () {
          angular.forEach(scope.cameras, function (item) {
            item.selected = false;
          });
        };
      }
    };
  }
]);