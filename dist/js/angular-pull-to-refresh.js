(function () {
  'use strict';

  angular.module('nx.widget', []);

})();

(function() {
  'use strict';

  angular.module('nx.widget').constant('nxPullToRefreshConfig', {
    treshold: 60,
    debounce: 400,
    text: {
      pull: 'pull to refresh',
      release: 'release to refresh',
      loading: 'refreshing...'
    },
    icon: {
      pull: 'fa fa-arrow-down',
      release: 'fa fa-arrow-up',
      loading: 'fa fa-refresh fa-spin'
    }
  });

})();

(function() {

  'use strict';

  angular.module('nx.widget')
    .directive('nxPullToRefresh', function($compile, $timeout, $q, nxPullToRefreshConfig) {
      return {
        scope: true,
        restrict: 'A',
        transclude: true,
        template: '<div class="nx-widget-pull-to-refresh">' +
          '<i ng-class="icon[status]"></i>&nbsp;' +
          '<span ng-bind="text[status]"></span>' +
          '</div>' +
          '<div ng-transclude></div>',
        compile: function compile(tElement, tAttrs, transclude) {

          return function postLink(scope, iElement, iAttrs) {
            var lock, draging;
            var start, end;
            var config = angular.extend({}, nxPullToRefreshConfig, iAttrs);
            var scrollElement = iElement.parent();
            var ptrElement = window.ptr = iElement.children()[0];
            var offset = config.treshold;
            var callback = scope.$eval(iAttrs.pullToRefresh);
            var bodyElement= angular.element(document.body);

console.log(iElement);
            // Initialize isolated scope vars
            scope.text = config.text;
            scope.icon = config.icon;
            scope.status = 'pull';
            iElement.bind('touchstart', function(inEvent) {
              if (iElement[0].scrollTop <= 0 && !lock) {
                lock = true;
                draging = true;
                start = inEvent.touches[0].pageY;
                setTranslition(0);
              }
            });


            bodyElement.bind('touchmove', function(inEvent) {
              if (draging) {
                end = inEvent.touches[0].pageY;
                inEvent.preventDefault();
                setTranslition(0);
                translate(end - start - offset);
              }
            });

            bodyElement.bind('touchend', function(inEvent) {
              if (draging) {
                draging = false;
                if (end - start >= offset) {
                  setTranslition(1);
                  translate(0);
                  if (typeof callback == "function") {
                    callback();
                  }
                } else {
                  reset();
                }
              }
            });

            scope.$on('$destroy', function() {
              iElement.unbind('touchstart');
              bodyElement.unbind('touchmove');
              bodyElement.unbind('touchend');
            });

            function setTranslition(time) {
              iElement.css({
                "-webkit-transition": "all " + time + "s",
                "transition": "all " + time + "s"
              });
            }

            function reset() {
              translate(0 - offset);
              lock = false;
            }

            function translate(inDiff) {
              iElement.css({
                "-webkit-transform": "translate(0," + inDiff + "px)",
                "transform": "translate(0," + inDiff + "px)"
              });
            }


          };
        }
      };
    });
})();
