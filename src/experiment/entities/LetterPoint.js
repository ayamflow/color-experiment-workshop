define(['entities/Vector', 'entities/Attractor', 'entities/Particle', 'helpers/MathHelper', 'data/Colors', 'TweenMax', 'helpers/ColorHelper', 'data/GlobalSignals', 'data/GuiConstants'], function(Vector, Attractor, Particle, MathHelper, Colors, greensock, ColorHelper, GlobalSignals, GuiConstants) {
    var LetterPoint = function(x, y, particlesNumber, id) {
        this.position = new Vector(x, y);
        this.particlesNumber = particlesNumber;
        this.particles = [];

        this.lineColor = Colors.WHITE;
        this.opacity = 0;

        var particleDistance = 10;
        var pointsTl = new TimelineMax({onComplete: function() {
                console.log('particlesAppeared');
                GlobalSignals.particlesAppeared.dispatch();
            }
        });

        for(var i = 0; i < this.particlesNumber; i++) {
            this.particles.push(new Particle(MathHelper.rand(x - particleDistance, x + particleDistance), MathHelper.rand(y - particleDistance, y + particleDistance)));
            pointsTl.insert(TweenMax.to(this.particles[i], 0.6, {opacity: 1, ease: Expo.easeInOut}), id * 0.5 + i * 0.6);
        }

        this.attractor = new Attractor(x, y);
        this.attractor.mass = 1;

        if(GuiConstants.debug) pointsTl.timeScale = GuiConstants.timeScale;
        // pointsTl.gotoAndStop(0);
        pointsTl.play();

        // TweenMax.to(this, 2.4, {opacity: 1, ease: Cubic.easeInOut, delay: 1});
    };

    LetterPoint.prototype = {
        update: function(context) {
            this.attractor.position.x = this.position.x;
            this.attractor.position.y = this.position.y;

            for(var i = 0; i < this.particlesNumber - 1; i++) {

                // if(GuiConstants.debug) {
                    this.particles[i].position = this.position;
                // }
                // else {
                    // this.particles[i].applyForce(this.attractor.attract(this.particles[i]));
                // }
                this.drawLines(context, this.particles[i], this.particles[i+1], 15);
                this.particles[i].update(context);
            }

            if(GuiConstants.debug) this.draw(context);
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
                    // context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - dist / threshold) +')';
                    context.strokeStyle = ColorHelper.toRGBA(this.lineColor, this.opacity);
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