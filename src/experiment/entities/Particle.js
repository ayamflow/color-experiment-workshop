define(['entities/Vector'], function(Vector) {
    var Particle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.mass = 10;

        this.frictionCoeff = 0.01;
        this.frictionNormal = 1;
    };

    Particle.prototype = {
        applyForce: function(force) {
            this.acceleration = force.divide(this.mass);
        },

        update: function(context) {
            // this.friction = this.velocity.clone().normalize().multiply(-1).multiply(this.frictionNormal * this.frictionCoeff);
            // this.applyForce(this.friction);
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            // this.draw(context);
        },

        draw: function(context) {
            context.fillStyle = '#fff';
            // context.moveTo(this.position.x, this.position.y);
            // context.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI, true);
            // context.fill();
            context.fillRect(this.position.x, this.position.y, 1, 1);
        }
    };

    return Particle;
});