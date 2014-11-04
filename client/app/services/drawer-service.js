/* global $ */

'use strict';

angular.module('brainedIoApp')

.factory('drawer', ['veroldRemote', '$timeout',
  function (veroldRemote, $timeout) {

    var delayedResize = function () {
      $timeout(function () {
        veroldRemote.resize();
      }, 10);
    };
    return {
      // Open the drawer if width greater than 720px
      isOpen: ($(window).width() > 720) ? true : false,

      toggle: function () {
        this.isOpen = !this.isOpen;
        delayedResize();
      },

      close: function () {
        this.isOpen = false;
        delayedResize();
      },

      open: function () {
        this.isOpen = true;
        delayedResize();
      }
    };
  }
]);