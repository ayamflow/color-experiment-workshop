define(function() {
    var Mouse = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        this.ox = x;
        this.oy = y;

        this.clicks = 0;
        this.isDown = false;

        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
        window.addEventListener("mouseup", this.onMouseUp.bind(this));
        window.addEventListener("click", this.onMouseClick.bind(this));
    };

    Mouse.prototype = {
        onMouseMove: function(e) {
            this.ox = this.x;
            this.oy = this.y;
            this.x = e.clientX;
            this.y = e.clientY;
        },

        onMouseClick: function(e) {
            this.clicks++;
        },

        onMouseDown: function(e) {
            this.isDown = true;
        },

        onMouseUp: function(e) {
            this.isDown = false;
        }
    };

    var MouseSingleton = new Mouse();

    return MouseSingleton;
});