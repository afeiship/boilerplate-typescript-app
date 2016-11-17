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
      pull: '下拉刷新',
      release: '释放更新',
      loading: '加载数据',
      complete: '加载完成',
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
        template: '<div class="nx-widget-pull-to-refresh-indecator">' +
          '<span ng-bind="text[status]"></span>' +
          '</div>' +
          '<div ng-transclude></div>',
        compile: function compile(tElement, tAttrs, transclude) {
            return function postLink(scope, iElement, iAttrs) {
              var config = angular.extend({}, nxPullToRefreshConfig, iAttrs);

              var bodyEl = angular.element(document.body);
              var scrollElement = iElement.parent();
              var ptrElement = iElement.children()[0];
              var transElement = ptrElement.nextElementSibling;
              var startY, deltaY, dragOffset;
              var startTime, deltaTime;
              var shouldReload = false;
              var historyY;
              var isDragging = false;
              var scrollTop=0;

              scope.text= config.text;
              scope.status='pull';
              iElement.addClass('nx-widget-pull-to-refresh-wrapper');
              angular.element(transElement).addClass('nx-widget-pull-to-refresh-scroller');

              var setStatus = function(status) {
                scope.$apply(function() {
                  scope.status = status;
                  shouldReload=status==='release';
                });
              };

              var setTranslateY=function(inOffset,inInterval) {
                transElement.style.WebkitTransform = 'translate3d(0,' + inOffset + 'px,0)';
                transElement.style.WebkitTransition = 'all '+inInterval+'s';
              };

              scrollElement.bind('touchstart', function(ev) {
                startY = ev.touches[0].pageY;
                startTime = Date.now();
                setStatus('pull');
              });

              bodyEl.bind('touchmove', function(ev) {
                console.log('move....');
                // ev.preventDefault();
                isDragging= transElement.getBoundingClientRect().top>=0;
                isDragging = isDragging && (historyY < ev.touches[0].pageY);
                if(isDragging){
                  ev.preventDefault();
                  deltaY = ev.touches[0].pageY - startY;
                  deltaTime = Date.now() - startTime;

                  dragOffset = deltaY / 3;
                  console.log(dragOffset);
                  setTranslateY(dragOffset,0);
                  ptrElement.style.WebkitTransform = 'translate3d(0,' + (dragOffset/2-20) + 'px,0)';
                  if (deltaY > 100 && deltaTime > 400) {
                    if (deltaY - dragOffset > 60) {
                      setStatus('release');
                    }
                  }
                }

                historyY=ev.touches[0].pageY;
              });



              bodyEl.bind('touchend', function(ev) {
                if (shouldReload) {
                  shouldReload = false;
                  setStatus('loading');
                  ptrElement.style.WebkitTransform = 'translate3d(0,0,0)';
                  ptrElement.style.WebkitTransition = 'all 0.3s';
                  setTranslateY(40,0.3);
                  $q.when(scope.$eval(iAttrs.nxPullToRefresh)).then(function() {
                    $timeout(function(){
                      scope.status='complete';
                      setTranslateY(0,0.3);
                      ptrElement.style.WebkitTransform = '';
                      ptrElement.style.WebkitTransition = '';
                    },1000);
                  });
                }else{
                  setTranslateY(0,0.3);
                  ptrElement.style.WebkitTransform = '';
                  ptrElement.style.WebkitTransition = '';
                }
              });

              scope.$on('$destroy', function() {
                scrollElement.unbind('touchstart');
                bodyEl.unbind('touchmove');
                bodyEl.unbind('touchend');
              });
            };
          } //end compile
      };
    });
})();
