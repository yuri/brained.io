'use strict';

angular.module('brainedIoApp', [
  // custom modules
  'sirTrevorAngular',
  // external modules
  'ui.router',
  'ui.bootstrap',
  'brained-appDelegate',
  'brained-nav',
  'brained-drawer'
])

.config(['sirTrevorRemoteProvider',
  function (sirTrevorRemoteProvider) {
    sirTrevorRemoteProvider.setDefaults({
      uploadUrl: '/api/uploadImage'
    });
    sirTrevorRemoteProvider.globalOptions = {
      blockTypes: ['Heading', 'Text', 'List', 'Image', 'Video']
    };
    sirTrevorRemoteProvider.DEFAULT_SIR_TREVOR_ID = '__ASIDE_ST_EDITOR__';
  }
])

.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/presentations');

    $stateProvider
      .state('explorer', {
        url: '/explorer',
        views: {
          'drawer@': {
            templateUrl: '/app/drawer/exp-drawer.html',
            controller: 'DrawerCtrl'
          }
        }
      })
      .state('explorer.detail', {
        url: '/{slug:[A-Za-z0-9-_]{1,}}',
        views: {
          'aside@': {
            templateUrl: '/app/aside/slide.html',
            controller: 'AsideCtrl'
          }
        }
      })
      .state('explorer.detail.slide', {
        url: '/{slideId:[0-9]{1,}}',
        views: {
          'aside@': {
            templateUrl: '/app/aside/slide.html',
            controller: 'AsideCtrl'
          }
        }
      })
      .state('presentations', {
        url: '/presentations',
        views: {
          'drawer@': {
            templateUrl: '/app/drawer/pres-list-drawer.html',
            controller: 'DrawerCtrl'
          },
          'content@': {
            templateUrl: '/app/content/pres-list.html',
            controller: 'ContentCtrl'
          }
        }
      })
      .state('presentations.detail', {
        url: '/{owner:[A-Za-z0-9-_]{1,}}/{slug:[A-Za-z0-9-_]{1,}}',
        views: {
          'content@': {},
          'drawer@': {
            templateUrl: '/app/drawer/pres-drawer.html',
            controller: 'DrawerCtrl'
          },
          'aside@': {
            templateUrl: '/app/aside/slide.html',
            controller: 'AsideCtrl'
          }
        }
      })
      .state('presentations.detail.slide', {
        url: '/{slideId:[0-9]{1,}}',
        views: {
          'aside@': {
            templateUrl: '/app/aside/slide.html',
            controller: 'AsideCtrl'
          }
        }
      })
      .state('presentations.edit', {
        url: '/edit/{owner:[A-Za-z0-9-_]{1,}}/{slug:[A-Za-z0-9-_]{1,}}',
        views: {
          'content@': {},
          'drawer@': {
            templateUrl: '/app/drawer/edit-pres-drawer.html',
            controller: 'DrawerCtrl'
          }
        }
      })
      .state('presentations.edit.slide', {
        url: '/{slideId:[0-9]{1,}}',
        views: {
          'content@': {},
          'aside@': {
            templateUrl: '/app/aside/edit-slide.html',
            controller: 'AsideCtrl'
          }
        }
      });
  }
])

.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
]);