/* global _ */
'use strict';

angular.module('brainedIoApp')

.factory('highlightDelta', ['veroldRemote',
  function (veroldRemote) {
    var service = {};

    //returns the resulting array of highlights that represent the current state of the brain after
    //adding the list of highlights
    service.calculateApply = function (highLightsToApply, currentHighlights) {
      var result = currentHighlights;
      angular.forEach(highLightsToApply, function (functionalAreaBA) {
        angular.forEach(currentHighlights, function (ba) {
          if (ba.regionName === functionalAreaBA.regionName) {
            veroldRemote.unhighlight([ba]);
            result = _.without(result, ba);
          }
        });
        result.push(functionalAreaBA);
      });
      veroldRemote.highlight(result);

      return result;
    };

    //returns the resulting array of highlights that represent the current state of the brain after
    //removing the list of highlights
    service.calculateRemove = function (highLightsToRemove, currentHighlights) {
      veroldRemote.unhighlight(highLightsToRemove);

      var result = currentHighlights;
      angular.forEach(highLightsToRemove, function (rm) {
        angular.forEach(currentHighlights, function (ba) {
          if (ba.regionName === rm.regionName) {
            result = _.without(result, ba);

          }
        });
      });
      return result;
    };

    service.isFunctionalAreaSelected = function (functionArea,
      currentHighlights) {
      var result = true;

      angular.forEach(functionArea, function (_name) {
        if (!result) {
          return;
        }
        if (!_.find(currentHighlights, function (i) {
          return i.regionName === _name.regionName;
        })) {
          result = false;
        }
      });

      return result;
    };

    service.isBrodmannAreaSelected = function (regionName, currentHighlights) {
      return _.find(currentHighlights, function (i) {
          return i.regionName === regionName;
        }) ?
        true : false;
    };

    service.initAllBrodmannAreas = function (currentHighlights) {
      var brodmannAreas = {};
      for (var i = 1; i <= 52; i++) {
        brodmannAreas['brodmann' + i] = {
          regionName: 'brodmann' + i,
          color: '#FA2B31',
          opacity: '100',
          sides: {
            leftSelected: true,
            rightSelected: true
          }
        };
      }

      angular.forEach(currentHighlights, function (region) {
        brodmannAreas[region.regionName].sides = region.sides;
        brodmannAreas[region.regionName].color = region.color;
        brodmannAreas[region.regionName].opacity = region.opacity ? region.opacity :
          '100';
      });
      return brodmannAreas;
    };

    service.setColourForHighlights = function (colour, highlights) {
      return _.map(highlights, function (highlight) {
        highlight.color = colour;
        return highlight;
      });
    };

    service.setOpacityForHighlights = function (opacity, highlights) {
      return _.map(highlights, function (highlight) {
        highlight.opacity = opacity;
        return highlight;
      });
    };

    return service;
  }
]);