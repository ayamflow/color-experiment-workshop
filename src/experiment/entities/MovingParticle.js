define(['entities/Vector', 'helpers/MathHelper'], function(Vector, MathHelper) {
    var MovingParticle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();

        this.center = this.position.clone();
        this.angle = new Vector(Math.random(), Math.random());
        this.angleIncrement = new Vector(MathHelper.rand(0.01, 0.09), MathHelper.rand(0.01, 0.09));

        this.mass = 1;
        this.maxSpeed = 5;
        this.size = 10;
        this.pathIndex = 0;
        this.pathIncrement = 1;
        this.pathThreshold = 20;
        this.steeringForce = new Vector();
    };

    MovingParticle.prototype = {
        path: function(points, loop) {
            // Loop = 0 (no), 1(yes), 2(reverse)
            loop = loop || 0;
            var tempPoint = points[this.pathIndex];
            if(tempPoint === null) return;
            var point = new Vector(tempPoint.x, tempPoint.y);

            if(this.position.dist(point) < this.pathThreshold) {
                if(this.pathIndex >= path.length -1) {
                    if(loop == 1) {
                        this.pathIncrement = 1;
                        this.pathIndex = 0;
                    }
                }
                else if(this.pathIndex < 0 && loop == 2) {
                    this.pathIncrement = 1;
                    this.pathIndex = 0;
                }
                else {
                    this.pathIndex++;
                }
            }
            if(this.pathIndex >= points.length && loop === 0) {
                this.arrive(point);
            }
            else {
                this.seek(point);
            }
        },

        seek: function(position) {
            this.steeringForce.add(position.clone().subtract(this.position).normalize().multiply(this.maxSpeed).subtract(this.velocity));
        },

        arrive: function(position) {
            var desiredVelocity = position.clone().subtract(this.position).normalize();
            var dist = this.position.dist(position);
            if(dist > this.arrivalThreshold) {
                desiredVelocity.multiply(this.maxSpeed);
            } else {
                desiredVelocity.multiply(this.maxSpeed * dist / this.arrivalThreshold);
            }
            this.steeringForce.add(desiredVelocity.subtract(this.velocity));
        },

        update: function(context) {
            this.steeringForce.truncate(this.maxForce).divide(this.mass);
            this.velocity.add(this.steeringForce);
            this.steeringForce.zero();

            this.velocity.truncate(this.maxSpeed);
            this.position.add(this.velocity);

            /*this.center.x += 0.3;

            this.position.x = this.center.x + Math.cos(this.angle.x) * 10;
            this.position.y = this.center.y + Math.sin(this.angle.y) * 10;

            this.angle.x += this.angleIncrement.x;
            this.angle.y += this.angleIncrement.y;*/

            this.draw(context);
        },

        draw:  function(context) {
            // context.fillStyle = '#0000FF';
            // context.fillRect(this.position.x, this.position.y, 10, 10);
            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(this.velocity.angle());
            context.beginPath();
            context.moveTo(this.size, 0);
            context.lineTo(-this.size, this.size / 2);
            context.lineTo(-this.size, -this.size / 2);
            context.lineTo(this.size, 0);
            context.fill();
            context.restore();
        },
    };

    return MovingParticle;
});