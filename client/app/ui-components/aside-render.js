/* global marked */

'use strict';

angular.module('brainedIoApp')

.directive('renderSlide', [

  function () {
    return {
      restrict: 'E',
      scope: {
        component: '=component'
      },
      templateUrl: '/app/ui-components/render-slide.html',
    };
  }
])

.directive('markdown', [

  function () {
    return {
      restrict: 'C',
      link: function (scope, iElement) {
        iElement.html(marked(scope.text));
      },
      scope: {
        text: '=text'
      },
    };
  }
])

.directive('video', [

  function () {
    return {
      restrict: 'C',
      scope: {
        url: '=url'
      },
      link: function (scope, iElement) {
        scope.providers = [{
          regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo.com\/(.+)/,
          html: '<iframe src=\"{{protocol}}//player.vimeo.com/video/{{remote_id}}?title=0&byline=0\" width=\"{{width}}\" height=\"{{height}}\" frameborder=\"0\"></iframe>'
        }, {
          regex: /(?:http[s]?:\/\/)?(?:www.)?(?:(?:youtube.com\/watch\?(?:.*)(?:v=))|(?:youtu.be\/))([^&].+)/,
          html: '<iframe src=\"{{protocol}}//www.youtube.com/embed/{{remote_id}}\" width=\"{{width}}\" height=\"{{height}}\" frameborder=\"0\" allowfullscreen></iframe>'
        }];

        var source;
        var videoId;

        for (var x = 0; x < scope.providers.length; x++) {
          var match = scope.url.match(scope.providers[x].regex);
          if (match === null || match[1] === null) {
            continue;
          }

          source = x;
          videoId = match[1];
          break;
        }
        var videoWidth = iElement[0].clientWidth;

        scope.embed_string = scope.providers[source].html
          .replace('{{protocol}}', window.location.protocol)
          .replace('{{remote_id}}', videoId)
          .replace('{{width}}', videoWidth)
          .replace('{{height}}', videoWidth * (9 / 16)); //Standard video aspect ratio of 16 : 9

        iElement.html(scope.embed_string);
      }
    };
  }
]);