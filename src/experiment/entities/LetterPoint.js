define(['entities/Vector', 'entities/Attractor', 'entities/Particle', 'helpers/MathHelper'], function(Vector, Attractor, Particle, MathHelper) {
    var LetterPoint = function(x, y, particlesNumber) {
        this.position = new Vector(x, y);
        this.particlesNumber = particlesNumber;
        this.particles = [];

        var particleDistance = 10;
        for(var i = 0; i < this.particlesNumber; i++) {
            this.particles.push(new Particle(MathHelper.rand(x - particleDistance, x + particleDistance), MathHelper.rand(y - particleDistance, y + particleDistance)));
        }

        this.attractor = new Attractor(x, y);
    };

    LetterPoint.prototype = {
        update: function(context) {
            for(var i = 0; i < this.particlesNumber - 1; i++) {
                this.particles[i].applyForce(this.attractor.attract(this.particles[i]));
                this.drawLines(context, this.particles[i], this.particles[i+1], 15);
                this.particles[i].update(context);
            }
            // console.log(this.particles[0].position.x, this.particles[0].position.y);

            // this.draw(context);
            // this.attractor.draw(context);
        },

        draw: function(context) {
            context.fillStyle = "rgba(120, 120, 255, 0.4)";
            context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, true);
            context.fill();
        },

        drawLines: function(context, p1, p2, threshold) {
            var dist;
            for(var i = 0; i < this.particlesNumber; i++) {
                dist = MathHelper.pDist(p1.position, p2.position);
                if(dist <= threshold) {
                    context.beginPath();
                    context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - dist / threshold) +')';
                    context.moveTo(p1.position.x, p1.position.y);
                    context.lineTo(p2.position.x, p2.position.y);
                    context.stroke();
                    context.closePath();
                }
            }
        }
    };

    return LetterPoint;
});