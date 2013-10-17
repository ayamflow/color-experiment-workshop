define(['entities/Vector', 'entities/Particle', 'helpers/MathHelper'], function(Vector, Particle, MathHelper) {
    var Triangle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();

        this.angle = new Vector(MathHelper.rand(x - variant, x + variant), MathHelper.rand(y - variant, y + variant));

        this.points = [];
        var variant = 10;
        this.pointsNumber = 2;
        for(var i = 0; i < this.pointsNumber; i++) {
            this.points[i] = new Particle(MathHelper.rand(x - variant, x + variant), MathHelper.rand(y - variant, y + variant));
        }
    };

    Triangle.prototype = {
        seek: function(point) {
            this.acceleration.add(point.clone().subtract(this.position).normalize().multiply(this.maxSpeed).subtract(this.velocity));
        },

        update: function(context) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);

            for(var i = 0; i < this.pointsNumber; i++) {
                // this.points[i].applyForce(this.attractor.attract(this.points[i]));
                var dist = MathHelper.dist(this.points[i].position, this.position);
                // this.points[i].position.add()
                this.points[i].update(context);
            }
            this.drawLines(context, this, this.points[0], 120);
            this.drawLines(context, this.points[0], this.points[1], 120);
            this.drawLines(context, this.points[1], this, 120);

            this.draw(context);
            this.acceleration.multiply(0);
        },

        draw: function(context) {
            context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, true);
        },

        drawLines: function(context, p1, p2, threshold) {
            var dist = MathHelper.pDist(p1.position, p2.position);
            context.beginPath();
            context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - dist / threshold) +')';
            context.moveTo(p1.position.x, p1.position.y);
            context.lineTo(p2.position.x, p2.position.y);
            context.stroke();
            context.closePath();
        }
    };

    return Triangle;
});