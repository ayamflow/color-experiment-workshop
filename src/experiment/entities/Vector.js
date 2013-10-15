define(function() {
    var Vector = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    Vector.prototype = {
        invert: function() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        },

        add: function(vector) {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        },

        subtract: function(vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        },

        multiply: function(value) {
            this.x *= value;
            this.y *= value;
            return this;
        },

        divide: function(value) {
            this.x /= value;
            this.y /= value;
            return this;
        },

        equals: function(vector) {
            return this.x == vector.x && this.y == vector.y;
        },

        dot: function(vector) {
            return this.x * vector.x + this.y * vector.y;
        },

        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        cross: function(vector) {

        },

        normalize: function() {
            return this.divide(this.length());
        },

        angle: function() {
            return Math.atan(this.y, this.x);
        },

        toArray: function(n) {
            return [this.x, this.y].slice(0, n || 2);
        },

        clone: function() {
            return new Vector(this.x, this.y);
        },

        init: function(x, y) {
            this.x = x;
            this.y = y;
         return this;
        }
    };

    return Vector;
});