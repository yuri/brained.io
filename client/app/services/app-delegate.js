'use strict';

/*
  ------------------------
    APP DELEGATE SERVICE
  ------------------------

  - This service tracks the state of the app – active route (from ui-
    router),presentation, slide;

  - It loads the required resources on state change: Presentation,
    Presentation Lists and Explorer.

  - On state chage it checks to make sure that the state is valid.

  - It sets up the Verold3D Service and triggers updates on state change.

*/

angular.module('brained-appDelegate', ['koast', 'brained-presentation'])

.factory('appDelegate', ['$rootScope', '$state', '$stateParams', 'presentation',
  'drawer', '$q', '$timeout', 'veroldRemote', '$log',
  function ($rootScope, $state, $stateParams, presentation,
    drawer, $q, $timeout, veroldRemote, $log) {

    var appDelegate = {
      // if a presentation is being edited
      isEditing: false,
      // enable/disable the verold3D component
      enable3D: true,
      // boolean used to show the loading animations
      // used when initially loading verold3D or when making
      // a new presentation, etc.
      isBusy: this.enable3D,
      //show/hide the new presentation form
      isCreatingPresentation: false,
      isInfoModalOpen: false,
      showLogin: false
    };

    // The drawer service
    // It's used to toggle drawer visibility in the views
    appDelegate.drawer = drawer;

    // Load the Verold API and once complete hide the loading animation
    appDelegate.load3DContent = function () {
      if (appDelegate.enable3D) {
        veroldRemote.load()
          .then(function () {
            appDelegate.updateVerold();
            appDelegate.isBusy = false;
          });
      }
    };

    // Used to track which Explorer presentation is currently acitve
    // and highlights the active presentation in the drawer
    appDelegate.isExpPresActive = function (slug) {
      return $state.includes('explorer.detail', {
        slug: slug
      });
    };
    // Currently Active slide Id starts from 0 and matches
    // the array index
    appDelegate.activeSlideId = function () {
      return (parseInt($stateParams.slideId) || 1) - 1;
    };
    // Currently Active slide No. starts from 1 to make
    // it easier for the users
    appDelegate.activeSlideNo = function () {
      return parseInt($stateParams.slideId) || 1;
    };
    // Hide the 3D content if on the presentations list route
    appDelegate.hide3D = function () {
      return $state.current.url === '/presentations';
    };
    // Mocks the creation of a new presentaion
    // @TODO: implement actual logic when hooking up to the backend
    appDelegate.createNewPres = function () {

    };
    // Update the state of Verold 3D
    appDelegate.updateVerold = function () {
      var slide = presentation.data.slides[appDelegate.activeSlideId()];

      if (appDelegate.enable3D && slide /*&& !appDelegate.isStateInvalid()*/ ) {
        veroldRemote.clearAndHighlight(slide.highlights);
        if (slide.cameraPos) {
          veroldRemote.moveCameraTo(slide.cameraPos);
        }
      }
    };
    // Check if the current state is in-valid:
    // if presentation doesn't exists or the slide doesn't exists
    appDelegate.isStateInvalid = function () {
      return (!presentation.data || typeof presentation.data.slides[
        appDelegate.activeSlideId()] === 'undefined');
    };

    // On State Change Start
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        // If in editing mode, poll Sir Trevor Data update the presentation
        if (appDelegate.isEditing) {
          presentation.updateAside(appDelegate.activeSlideId());
        }
      });
    // On State Change Sucess update the state of the app
    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        // Enable/Disable edit mode
        if (toState.name.indexOf('edit') !== -1) {
          appDelegate.isEditing = true;
        } else {
          appDelegate.isEditing = false;
        }

        switch (toState.name) {
        case 'presentations.detail':
          $stateParams.slideId = '1';
          //fall through
        case 'presentations.detail.slide':
          presentation.load($stateParams.owner, $stateParams.slug)
            .then(function () {
              appDelegate.updateVerold();
            })
            .then(null, $log.error);
          break;
        case 'explorer':
          $state.go('explorer.detail.slide', {
            slug: presentation.other[0].slug,
            slideId: 1
          });
          break;
        case 'explorer.detail':
          $stateParams.slideId = '1';
          //fall through
        case 'explorer.detail.slide':
          presentation.load('verold', $stateParams.slug)
            .then(function () {
              appDelegate.updateVerold();
            });
          break;
        case 'presentations.edit':
        case 'presentations.edit.slide':
          if (!presentation.data.slides) {
            presentation.load($stateParams.owner, $stateParams.slug)
              .then(function () {
                appDelegate.updateVerold();
              });
          } else {
            appDelegate.updateVerold();
          }
          break;
        }

        // if slide ID doesn't exist, re-direct to list of presentations
        //   if($state.current.name !== 'presentations' && appDelegate.isStateInvalid()){
        //  console.log ($state.current.name);
        // $state.go('presentations');
        //}
      });

    return appDelegate;
  }
])

.run(['koast', 'presentation', '$timeout', '$location', '$log',
  function (koast, presentation, $timeout, $location, $log) {

    var baseUrl = $location.absUrl().split('/').slice(0, 3).join('/');

    koast.init({
      siteTitle: 'BrainEd.io',
      baseUrl: baseUrl
    });

    koast.setApiUriPrefix('/api/');
    koast.addEndpoint('presentations', ':owner/:slug', {
      useEnvelope: true
    });

    presentation.loadOther();
    koast.user.getStatusPromise()
      .then(function () {
        presentation.loadOther();
      }, $log.error);

  }
]);