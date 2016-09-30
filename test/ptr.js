(function(exports){
    var document = exports.document;

    function PullToRefresh(opts){
        if(!(this instanceof PullToRefresh)){
            return;
        }
        this.onRefresh = null;
        this.initialized = false;
        return this;
    }
    exports.PullToRefresh = PullToRefresh;
    PullToRefresh.prototype = {
        init: function(opts){
            this.locked = false;
            this.paused = false;
            this.page = 1;
            this.max_page = 0;
            this.configure(opts);
            this.initialized || (this.initialized = true, this.initEvent());
            return this;
        },
        initEvent: function(){
            var _this = this;
            exports.addEventListener('scroll', function(){
                if(_this.paused || _this.locked){
                    return;
                }
                if(document.body.scrollHeight - exports.innerHeight - document.body.scrollTop < 50){
                    _this.refresh();
                }
            }, false);
        },
        configure: function(opts){
            if(opts && typeof opts === 'object'){
                if(opts instanceof Object){
                    for(var pro in opts){
                        this[pro] = opts[pro];
                    }
                }
            }
        },
        refresh: function(){
            if(this.page >= this.max_page){
                return;
            }
            if(this.onRefresh && typeof this.onRefresh === 'function'){
                this.locked = true;
                if(this.onRefresh() === true){
                    this.page++;
                }
                this.locked = false;
            }
        },
        pause: function(){
            this.paused = true;
        },
        resume: function(){
            this.paused = false;
        }
    };
})(window);
