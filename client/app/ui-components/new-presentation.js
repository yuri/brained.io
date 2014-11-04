'use strict';

angular.module('brainedIoApp')

.directive('newPresentation', ['appDelegate', 'presentation', 'navService',
  'koast', '$log',
  function (appDelegate, presentation, navService, koast, $log) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/app/ui-components/new-presentation.html',
      transclude: true, //todo: needed?

      compile: function () {
        return function (scope) {
          scope.appDelegate = appDelegate;

          scope.validateSlug = function (slug) {
            //todo
          };

          scope.validateTitle = function (title) {
            //todo
          };

          //close the new presentation form and go to the presentation editor with an
          //empty presentation ready
          scope.create = function (title, slug) {
            var owner = koast.user.data.username;
            console.log(koast.user.data);
            appDelegate.isCreatingPresentation = true;
            presentation.createNewPresentation(owner, title, slug)
              .then(function () {
                navService.goToEditNewPresentation(owner, slug);
                appDelegate.isCreatingPresentation = false;
              })
              .then(null, $log.error);


            appDelegate.isCreatingPresentation = false;
          };

          //discard changes and go home
          scope.cancel = function () {
            appDelegate.isCreatingPresentation = false;
            navService.goHome();
          };
        };
      }
    };
  }
]);