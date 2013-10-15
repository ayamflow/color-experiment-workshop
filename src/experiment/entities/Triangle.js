define(['entities/Vector'], function(Vector) {
    var Triangle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();
    };

    Triangle.prototype = {
        seek: function(point) {
            this.acceleration.add(point.clone().subtract(this.position).normalize().multiply(this.maxSpeed).subtract(this.velocity));
        },

        update: function(context) {
            this.acceleration.multiply(0);

            this.draw(context);
        },

        draw: function(context) {

        }
    };

    return Triangle;
});