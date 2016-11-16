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
