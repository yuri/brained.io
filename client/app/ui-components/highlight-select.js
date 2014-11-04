/* global _ */

'use strict';

angular.module('brainedIoApp')

.filter('brodmannlabels', function () {
  return function (input) {
    var num = input.substr(8, input.length - 7);
    var output = 'Brodmann Area ' + num;
    return output;
  };
})

.directive('highlightSelect', ['FunctionalAreas', 'veroldRemote',
  'highlightDelta',
  function (FunctionalAreas, veroldRemote, highlightDelta) {
    return {
      restrict: 'E',
      scope: {
        'ngModel': '=',
      },
      templateUrl: '/app/ui-components/highlight-select.html',
      link: function (scope) {

        if (typeof (scope.ngModel) === 'undefined') {
          scope.ngModel = {};
          scope.ngModel.highlights = {};
          console.log('no presentation loaded');
        }
        scope.transparencies = [];
        for (var i = 10; i >= 0; i--) {
          scope.transparencies.push(i * 10 + '%');
        }

        scope.isCollapsed = true;
        scope.disable = true;
        scope.brodmannAreas = highlightDelta.initAllBrodmannAreas(scope.ngModel
          .highlights);
        scope.funcAreas = FunctionalAreas;
        scope.$watch('ngModel.highlights', function (newVal) {
          scope.brodmannAreas = highlightDelta.initAllBrodmannAreas(newVal);
        });

        // Check if the Brodmann Area is selected
        scope.isBASelected = function (name) {
          return highlightDelta.isBrodmannAreaSelected(name, scope.ngModel.highlights);
        };

        // Toggle the selection of a Brodmann Area
        scope.toggleBA = function (name) {
          if (scope.isBASelected(name)) {
            angular.forEach(scope.ngModel.highlights, function (area) {
              if (area.regionName === name) {
                console.log('unhighlight ' + name);
                veroldRemote.unhighlight([area]);
                scope.ngModel.highlights = _.without(scope.ngModel.highlights,
                  area);
              }
            });
          } else {
            console.log(scope.brodmannAreas[name]);
            scope.ngModel.highlights.push(scope.brodmannAreas[name]);
            veroldRemote.highlight([scope.brodmannAreas[name]]);
          }
        };

        //sr todo: encapsulate the hightligh/unhighlight sections
        scope.updateBAOpacity = function (name, opacity) {
          //clear old highlight
          angular.forEach(scope.ngModel.highlights, function (area) {
            if (area.regionName === name) {
              veroldRemote.unhighlight([area]);
              scope.ngModel.highlights = _.without(scope.ngModel.highlights,
                area);
            }
          });

          //push new opacity on the highlight
          scope.brodmannAreas[name].opacity = opacity;
          scope.ngModel.highlights.push(scope.brodmannAreas[name]);
          veroldRemote.highlight([scope.brodmannAreas[name]]);
        };

        scope.updateFAOpacity = function (name, opacity) {
          highlightDelta.calculateRemove(scope.funcAreas[name], scope.ngModel
            .highlights);
          scope.funcAreas[name] = highlightDelta.setOpacityForHighlights(
            opacity, FunctionalAreas[name]);
          highlightDelta.calculateApply(scope.funcAreas[name], scope.ngModel.highlights);
        };

        // Check if the Brodmann Area is selected
        //if everything in the function area is selected
        scope.isFASelected = function (name) {
          return highlightDelta.isFunctionalAreaSelected(FunctionalAreas[name],
            scope.ngModel.highlights);
        };

        // Toggle the selection of a functional Area
        scope.toggleFA = function (name) {
          scope.ngModel.highlights = scope.isFASelected(name) ?
            highlightDelta.calculateRemove(scope.funcAreas[name], scope.ngModel
              .highlights) :

          highlightDelta.calculateApply(scope.funcAreas[name], scope.ngModel.highlights);
        };
      }
    };
  }
]);