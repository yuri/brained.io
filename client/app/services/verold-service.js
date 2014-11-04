/* global verold */

'use strict';

angular.module('brainedIoApp')

.factory('veroldRemote', ['$q', '$timeout',
  function ($q, $timeout) {

    var veroldRemote = {};
    veroldRemote.prevHighlights = {};
    var isReady = function () {
      return verold && verold.veroldEvents;
    };

    veroldRemote.load = function () {
      var deferred = $q.defer();
      verold.load('#brain3d', 'http://vrld.co/sdtyyg.json');

      //replace this with a callback once available + bring the loading hex
      //thing back
      $timeout(function () {
        // app.defaultScene.listenToOnce(app.defaultScene, "load", function () {
        verold.veroldEvents.trigger('reset');
        deferred.resolve();
        // });
      }, 3000);
      return deferred.promise;
    };

    //clear all highlights from the brain and hightlight the given areas
    veroldRemote.clearAndHighlight = function (highlights) {
      if (!isReady()) {
        return;
      }
      veroldRemote.unhighlight(veroldRemote.prevHighlights);
      $timeout(function () {
        veroldRemote.highlight(highlights);
      }, 250);
    };

    //resize the brain
    veroldRemote.resize = function () {
      if (!isReady()) {
        return;
      }
      verold.veroldEvents.trigger('viewport_resize'); //note requires verold api version >= 8
    };

    //unhighlight the given areas and remove (if present) from list of
    //prevHighlights
    veroldRemote.unhighlight = function (areasToUnhighlight) {
      if (!isReady() || !areasToUnhighlight) {
        return;
      }

      angular.forEach(areasToUnhighlight, function (highlight) {
        verold.veroldEvents.trigger('unhighlight',
          transformRegionNameToRegionAreas(highlight.regionName), {});
        delete veroldRemote.prevHighlights[highlight.regionName];
      });
    };

    //highlight the given areas and add to list of prevHighlights
    veroldRemote.highlight = function (areasToHighlight) {
      if (!isReady() || !areasToHighlight) {
        return;
      }

      angular.forEach(areasToHighlight, function (highlight) {
        console.log(highlight);
        var options = {
          color: highlight.color,
          opacity: highlight.opacity ? (parseFloat(highlight.opacity) /
            100) : 1.0
        };
        verold.veroldEvents.trigger('highlight',
          transformRegionNameToRegionAreas(highlight.regionName, highlight.sides),
          options);
        veroldRemote.prevHighlights[highlight.regionName] = highlight;
      });
    };

    //move the camera to the given position
    veroldRemote.moveCameraTo = function (cameraPosition) {
      if (!isReady()) {
        return;
      }
      verold.veroldEvents.trigger('moveCameraTo', cameraPosition);
    };

    //transforms the presentation's region names to the 2 corresponding region
    //names for the brain diagram
    var transformRegionNameToRegionAreas = function (regionName, sides) {
      var veroldRegionName = regionName.replace('brodmann', 'Area');
      var regions = [];
      if (sides) {
        if (sides.leftSelected) {
          regions.push(veroldRegionName + '_L');
        }
        if (sides.rightSelected) {
          regions.push(veroldRegionName + '_R');
        }
      } else {
        regions.push(veroldRegionName + '_L');
        regions.push(veroldRegionName + '_R');
      }
      console.log(regions);
      return regions;
    };
    return veroldRemote;
  }
]);


/**
  Brained.io API
  ==============
  last updated February 18, 2014 */


/**
 * Reset brain to original state (unhighlight all parts and change camera position to "Origin").
 * @param {Function} callback - Optional callback function called after reset has completed.
 */
// --- resetBrain = function (callback) {}

/**
 * Highlight all brain parts specified in array of part names.
 * @param {Array}    names - List of brain part names to be highlighted ("brodmann1"..."brodmann52").
 *   Note that parts 13, 14, 15, 16, 48, 49, 50, and 51 are not currently implemented in the 3D model.
 * @param {Object}   options - Optional settings to affect the look and transition to the new highlight.
 * @param {String}   options.color - Hexidecimal RGB color value for highlight in CSS style (e.g., "#ff0000").
 * @param {Integer}  options.time - Positive value representing interval in milliseconds for highglight to fade in.
 * @param {Float}    options.opacity - Value between 0 and 1.0 representing the percent opacity of the highlight.
 * @param {Function} callback - Optional callback function called after highlighting has been completed.
 */
// --- highlight = function (names, options, callback) {}

/**
 * Unhighlight all brain parts specified in array of part names.
 * @param {Array}    names - List of brain part names to be unhighlighted ("brodmann1"..."brodmann52").
 * @param {Object}   options - Optional settings to affect the look and transition of unhighlighting.
 * @param {Integer}  options.time - Positive value representing interval in milliseconds for highlight to fade out.
 * @param {Function} callback - Optional callback function called after unhighlighting has been completed.
 */
// --- unhighlight = function (names, options, callback) {}

/**
 * Move camera to new position corresponding to name.
 * @param {String}   name - Name of new camera position. Can be one of:
 *   "Origin", "Top", "Front", "Side", "SomatosensoryNode", "MotorNode", "LanguageNode",
 *   "MemoryNode", "ExecutiveNode", "LimbicNode", or "SpatialOrientNode".
 * @param {Object}   options - Optional settings to affect the look and transition of the camera movement.
 * @param {Integer}  options.time - Positive value representing interval in milliseconds for camera movement.
 * @param {Function} callback - Optional callback function called after camera movement has been completed.
 */
// --- moveCameraTo = function (name, options, callback) {}

// verold.veroldEvents.trigger('moveCameraTo', event.names, event.options);