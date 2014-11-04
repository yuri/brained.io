'use strict';

angular.module('sirTrevorAngular')
    .directive('stEditor', ['sirTrevorRemote',
        function(sirTrevorRemote) {
            return {
                restrict: 'AE',
                template: '<form><textarea></textarea></form>',
                link: function(scope, element, attrs) {

                    scope.stOptions = {};

                    if (attrs.stOptions) {
                        angular.extend(scope.stOptions, scope.$eval(attrs.stOptions));
                    }

                    scope.stOptions.el = element.find('textarea');

                    angular.extend(scope.stOptions, sirTrevorRemote.globalOptions);

                    // Register a new Sir Trevor Editor with an ID
                    sirTrevorRemote.register(scope.stOptions, scope.$eval(attrs.blocks), scope.$eval(attrs.stId));

                    scope.$on('$destroy', function() {
                        sirTrevorRemote.unregister(scope.$eval(attrs.stId));
                    });

                }
            };
        }
    ]);
