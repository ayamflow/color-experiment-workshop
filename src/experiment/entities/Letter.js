define(['data/Letters', 'entities/Vector', 'entities/LetterPoint', 'helpers/MathHelper', 'helpers/ColorHelper', 'tinycolor', 'entities/Attractor', 'data/Colors', 'TweenMax', 'data/GlobalSignals'], function(Letters, Vector, LetterPoint, MathHelper, ColorHelper, tinycolor, Attractor, Colors, greensock, GlobalSignals) {
    var Letter = function(letter, x, y, width, height, id) {
        this.width = width;
        this.height = height;
        this.id = id;

        this.letterSign = letter;

        this.position = new Vector(x, y);

        this.lineColor = Colors.PURPLE;
        this.strokeWidth = 1;
        this.opacity = 0;

        this.position = new Vector(x, y);

        this.letter = Letters[letter];
        // console.log('letter', this.letter, letter);

        this.triangulateTl = new TimelineMax({onComplete: function() {
                console.log('trianglesAppeared');
                GlobalSignals.trianglesAppeared.dispatch();
            }
        });

        GlobalSignals.particlesAppeared.addOnce(this.playTl.bind(this));

        this.letterPoints = [];
        // this.triangles = [];
        for(var i = 0; i < this.letter.length; i++) {
            this.letterPoints.push(new LetterPoint(x + this.width * this.letter[i].x, y + this.height * this.letter[i].y, 5, i));

            this.triangulateTl.insert(TweenMax.to(this.letterPoints[i], 4, {opacity: 1, ease: Cubic.easeInOut}), this.id * 0.15 + i * 0.15);
        }

        this.triangulateTl.gotoAndStop(0);
        // this.triangulateTl.play();
    };

    Letter.prototype = {

        playTl: function() {
            this.triangulateTl.play();
        },

        morph: function(letter, newX, newY) {
            this.triangulateTl.clear();
            var oldLength = this.letter.length;
            console.log('old letter:', this.letterSign, 'nex letter:', letter);
            this.letter = Letters[letter];
            this.letterSign = letter;

            GlobalSignals.particlesAppeared.removeAll();
            GlobalSignals.particlesAppeared.addOnce(this.playTl.bind(this));

            var count = 0, point, i;

            this.position.x = newX;
            this.position.y = newY;


            if(oldLength > this.letter.length) { // Hide some point
                console.log('old word was longer');
                for(i = oldLength - 1; i < this.letter.letter; i++) {
                    TweenMax.to(this.letter[i], 1, {opacity: 0, ease: Cubic.easeInOut, onComplete: function() {
                            console.log('completed hiding extra letters');
                            this.letter[i] = null;
                        }.bind(this)
                    });
                }
            }

            for(i = 0; i < this.letter.length; i++) {
                point = this.letterPoints[count];
                if(point) { // morph
                    TweenMax.to(this.letterPoints[count].position, 1.2, {
                        x: this.position.x + this.width * this.letter[i].x,
                        y: this.position.y + this.height * this.letter[i].y
                    });
                }
                else { // create new point
                    this.letterPoints.push(new LetterPoint(this.position.x + this.width * this.letter[i].x, this.position.y + this.height * this.letter[i].y, 5, i));
                }
                count++;
            }
        },

        hide: function() {
            TimelineMax.to(this, 1, {opacity: 0, ease: Cubic.easeInOut});
        },

        draw: function(context) {
            // Link points
            for(i = 0; i < this.letterPoints.length; i++) {
                this.letterPoints[i].update(context);
                context.globalCompositeOperation = "lighter";
                if(i < this.letterPoints.length - 1) {
                    this.drawLines(context, this.letterPoints[i], this.letterPoints[i+1], this.width * 1.4);
                }
                context.globalCompositeOperation = "source-over"; // reset compositing
            }

        },

        drawLines: function(context, point, nextPoint, threshold) {
            var dist, p1, p2;
            for(var i = 0; i < point.particlesNumber; i++) {
                p1 = point.particles[i];
                p2 = nextPoint.particles[i];
                dist = MathHelper.pDist(p1.position, p2.position);
                if(dist <= threshold) {
                    context.beginPath();
                    context.strokeStyle = ColorHelper.toRGBA(this.lineColor, this.opacity);
                    // context.lineWidth = this.strokeWidth;
                    context.moveTo(p1.position.x, p1.position.y);
                    context.lineTo(p2.position.x, p2.position.y);
                    context.stroke();
                    context.closePath();
                }
            }
        }
    };

    return Letter;
});