'use strict';

/*
  ------------------------
    NAV SERVICE
  ------------------------

  A service which allows us to navigate to/within a presentation.

*/

angular.module('brained-nav', ['brained-presentation'])

.factory('navService', ['$rootScope', '$state', '$stateParams', 'appDelegate',
  'presentation',
  function ($rootScope, $state, $stateParams, appDelegate, presentation) {

    var navService = {};
    // Go to list of presentations
    navService.goToPresentationsList = function () {
      $state.go('presentations');
    };

    // Go to a prsentation with a specified ID
    navService.goToPresentation = function (owner, slug, slideId) {
      navService.goToPreview(owner, slug, slideId);
      presentation.load($stateParams.owner, $stateParams.slug);

    };

    //go to the presentation without loading it from the backend (ie. view unsaved changes)
    navService.goToPreview = function (owner, slug, slideId) {
      $state.go('presentations.detail.slide', {
        owner: owner,
        slug: slug,
        slideId: slideId ? slideId : 1
      });
    };

    //go to the presentation editor for a new unsaved presentation
    navService.goToEditNewPresentation = function (owner, slug) {
      $state.go('presentations.edit.slide', {
        owner: owner,
        slug: slug,
        slideId: 1
      });
    };

    //go to the presentations list (home screen currently)
    navService.goHome = function () {
      $state.go('presentations');
    };

    // Get the base state Explorer/Presentation
    // The .detail and .detail.slide pattern is used for both
    // so, this allows us to keep things a little DRY
    navService.getBaseState = function () {
      return $state.includes('explorer') ? 'explorer' : 'presentations';
    };

    // Build the slide URL based on whether the user is in
    // Explorer or Presentations route and whether editing or not
    navService.getSlideUrl = function () {
      var url = navService.getBaseState();
      if (appDelegate.isEditing && url !== 'explorer') {
        url += '.edit.slide';
      } else {
        url += '.detail.slide';
      }
      return url;
    };

    // Go to the next slide
    navService.nextSlide = function () {
      var stateUrl = navService.getSlideUrl();
      if (!navService.isLastSlide()) {
        $state.go(stateUrl, {
          //id : $stateParams.id,
          slideId: appDelegate.activeSlideNo() + 1
        });
      }
    };

    // Go to the prev slide
    navService.prevSlide = function () {
      var stateUrl = navService.getSlideUrl();
      if (!navService.isFirstSlide()) {
        $state.go(stateUrl, {
          //id : $stateParams.id,
          slideId: appDelegate.activeSlideNo() - 1
        });
      }
    };

    // Check if the currently active slide is the last slide
    // used to disable the 'next' navigation arrow
    navService.isLastSlide = function () {
      return appDelegate.activeSlideNo() === presentation.data.slides.length;
    };

    // Check if the currently active slide is the first slide
    // used to disable the 'prev' navigation arrow
    navService.isFirstSlide = function () {
      return appDelegate.activeSlideNo() === 1;
    };

    // Go to a slide by specified ID – in the active presentation
    navService.goToSlide = function (slideId) {
      $state.go('presentations.edit.slide', {
        owner: $stateParams.owner,
        slug: $stateParams.slug,
        slideId: slideId
      });
    };

    return navService;
  }
]);