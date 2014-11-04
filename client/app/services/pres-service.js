'use strict';

/*
  ------------------------
    PRESENTATION SERVICE
  ------------------------
*/

angular.module('brained-presentation', [
  'koast',
  'sirTrevorAngular'
])

.factory('presentation', ['koast', 'sirTrevorRemote', '$q', '$log',
  function (koast, sirTrevorRemote, $q, $log) {

    var service = {};
    var slides = []; // just a shortcut
    service.data = {
      slides: slides
    };

    service.other = [];
    service.explorer = [];

    service.load = function (owner, slug) {
      console.log(owner, slug);
      return koast.getResource('presentations', {
          owner: owner,
          slug: slug
        })
        .then(function (presentationResource) {
          console.log('Loaded the presentation.');
          service.data = presentationResource;
          slides = service.data.slides;
        })
        .then(null, $log.error);
    };

    service.loadOther = function () {
      koast.queryForResources('presentations', {})
        .then(function (allPresentations) {
          service.other = allPresentations;
        })
        .then(null, $log.error);
    };

    var defaultSlide = function () {
      return {
        name: 'new slide',
        cameraPos: 'Origin',
        camera: 'Origin',
        aside: {
          'data': [{
            'type': 'heading',
            'data': {
              'text': 'Slide Title'
            }
          }, {
            'type': 'text',
            'data': {
              'text': 'Slide content goes here....'
            }
          }]
        },
        highlights: []
      };
    };

    service.addNewSlide = function () {
      slides.push(defaultSlide());
    };

    service.createNewPresentation = function (owner, name, slug) {
      var presData = {
        slug: slug,
        name: name,
        owner: owner,
        screenshot: '',
        description: '',
        featured: false,
        icon: '/app/img/icon-somatosensory.svg',
        slides: [defaultSlide()]
      };
      return koast.createResource('presentations', presData)
        .then(function () {
          return service.load(owner, slug);
        });
    };

    // Delete the currently active slide
    service.deleteSlide = function (slideId) {
      if (slides.length > 1) {
        slides.splice(slideId, 1);
      }
    };

    // Update and save the active presentation
    service.updateAside = function (id) {
      // Sir Trevor doesn't automatically update the model.
      // Therefore, we need to call this function to specifically
      // update the JSON data
      sirTrevorRemote.update();
      // Pass this updated data to the presentation

      slides[id].aside = sirTrevorRemote.getData();
    };

    // Toggle the presentation's pusblished status
    service.publish = function (status) {
      service.data.published = status;
      return service.data.save();
    };

    // Toggle the presentation as featured status
    service.markFeatured = function (featured) {
      service.data.featured = featured;
      return service.data.save();
    };

    // Update and save the active presentation
    service.updateAndSave = function (id) {
      service.updateAside(id);
      return service.data.save(); // This is Koast's save method
    };

    //delete the currently selected presentation
    service.delete = function () {
      return service.data.delete();
    };

    return service;
  }
]);