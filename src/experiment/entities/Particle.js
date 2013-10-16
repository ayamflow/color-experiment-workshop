define(['entities/Vector', 'data/Colors', 'helpers/ColorHelper'], function(Vector, Colors, ColorHelper) {
    var Particle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.mass = 10;

        this.fillStyle = Colors.PURPLE;
        this.opacity = 0;
    };

    Particle.prototype = {
        applyForce: function(force) {
            this.acceleration.add(force.divide(this.mass));
        },

        update: function(context) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            this.draw(context);

            this.acceleration.multiply(0);
        },

        draw: function(context) {
            // context.moveTo(this.position.x, this.position.y);
            // context.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI, true);
            // context.fill();
            context.fillStyle = ColorHelper.toRGBA(this.fillStyle, this.opacity);
            context.fillRect(this.position.x, this.position.y, 1, 1);
        }
    };

    return Particle;
});