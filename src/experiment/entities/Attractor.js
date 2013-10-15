define(['entities/Vector'], function(Vector) {
    var Attractor = function(x, y) {
        this.position = new Vector(x, y);
        this.mass = 10;
        this.gravityConstant = 0.1;
    };

    Attractor.prototype = {
        attract: function(particle) {
            var force = this.position.clone().subtract(particle.position);
            var distance = force.length();
            distance = Math.max(5, Math.min(10, distance));
            force.normalize();
            var strength = (this.gravityConstant * this.mass * particle.mass) / (distance * distance);
            force.multiply(strength);
            return force;
        },

        draw: function(context) {
            context.fillStyle = "rgba(255, 255, 0, 0.4)";
            context.arc(this.position.x, this.position.y, this.mass, 0, 2 * Math.PI, true);
            context.fill();
        }
    };

    return Attractor;
});