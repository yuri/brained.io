'use strict';

// By finalclass (https://github.com/finalclass)
// From https://github.com/angular/angular.js/issues/1286
angular.module('brainedIoApp')

.filter('toArray', function () {
  return function (obj) {
    if (!(obj instanceof Object)) {
      return obj;
    }
    return Object.keys(obj).map(function (key) {
      return Object.defineProperty(obj[key], '$key', {
        __proto__: null,
        value: key
      });
    });
  };
});