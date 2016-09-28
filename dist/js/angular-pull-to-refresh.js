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

            var config = angular.extend({}, nxPullToRefreshConfig, iAttrs);
            var scrollElement = iElement.parent();
            var ptrElement = window.ptr = iElement.children()[0];

            // Initialize isolated scope vars
            scope.text = config.text;
            scope.icon = config.icon;
            scope.status = 'pull';

            var setStatus = function(status) {
              shouldReload = status === 'release';
              scope.$apply(function() {
                scope.status = status;
              });
            };

            var shouldReload = false;
            iElement.bind('touchmove', function(ev) {
              var top = scrollElement[0].scrollTop;
              if (top < -config.treshold && !shouldReload) {
                setStatus('release');
              } else if (top > -config.treshold && shouldReload) {
                setStatus('pull');
              }
            });

            iElement.bind('touchend', function(ev) {
              if (!shouldReload) return;
              ptrElement.style.webkitTransitionDuration = 0;
              ptrElement.style.margin = '0 auto';
              setStatus('loading');

              var start = +new Date();
              $q.when(scope.$eval(iAttrs.nxPullToRefresh))
                .then(function() {
                  var elapsed = +new Date() - start;
                  $timeout(function() {
                    ptrElement.style.margin = '';
                    ptrElement.style.webkitTransitionDuration = '';
                    scope.status = 'pull';
                  }, elapsed < config.debounce ? config.debounce - elapsed : 0);
                });
            });

            scope.$on('$destroy', function() {
              iElement.unbind('touchmove');
              iElement.unbind('touchend');
            });

          };
        }
      };
    });
})();
