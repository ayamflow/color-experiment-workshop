define(function() {
    var Pool = function(Class, density, overflowIncrement) {
        this.position = 0;
        this.density = density || 100;
        this.overflowIncrement = overflowIncrement || 100;
        this.pool = [];

        for(var i = 0; i < this.density; i++) {
            this.pool.push(new Class());
        }
        this.position = this.pool.length - 1;
    };

    Pool.prototype = {
        get: function() {
            // if(this.position === 0) {
            //     this.density += this.overflowIncrement;
            // }
            // else {
                return this.pool[--this.position];
            // }
        },

        release: function(poolable) {
            this.pool[this.position++] = poolable;
        }
    };

    return Pool;
});