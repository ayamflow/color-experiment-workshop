define(['data/Letters', 'entities/Vector', 'entities/LetterPoint', 'helpers/MathHelper', 'helpers/ColorHelper', 'tinycolor', 'entities/Attractor', 'data/Colors', 'TweenMax', 'data/GlobalSignals', 'data/GuiConstants'], function(Letters, Vector, LetterPoint, MathHelper, ColorHelper, tinycolor, Attractor, Colors, greensock, GlobalSignals, GuiConstants) {
    var Letter = function(letter, x, y, width, height, id) {
        this.width = width;
        this.height = height;
        this.id = id;

        this.letterSign = letter;

        this.position = new Vector(x, y);

        this.lineColor = Colors.PURPLE;
        this.strokeWidth = 1;
        this.opacity = 0;
        this.threshold = this.width > this.height ? this.width * 0.6 : this.height * 0.6;

        this.position = new Vector(x, y);

        this.letter = Letters[letter];
        // console.log('letter', this.letter, letter);

        this.triangulateTl = new TimelineMax({onComplete: function() {
                // console.log('trianglesAppeared');
                GlobalSignals.trianglesAppeared.dispatch();
            }
        });

        GlobalSignals.particlesAppeared.addOnce(this.playTl.bind(this));
        GlobalSignals.letterWidthChanged.add(this.onLetterWidthChanged.bind(this));
        GlobalSignals.letterHeightChanged.add(this.onLetterHeightChanged.bind(this));

        this.letterPoints = [];
        // this.triangles = [];
        for(var i = 0; i < this.letter.length; i++) {
            this.letterPoints[i] = this.addPoint(this.position.x + this.width * this.letter[i].x, this.position.y + this.height * this.letter[i].y, 5, i);

            this.triangulateTl.insert(TweenMax.to(this.letterPoints[i], 1.5, {opacity: 1, ease: Cubic.easeInOut}), this.id * 0.15 + i * 0.15);
        }

        this.determineShowingTriangles();

        if(GuiConstants.debug) this.triangulateTl.timeScale(GuiConstants.timeScale);
        this.triangulateTl.gotoAndStop(0);
        // this.triangulateTl.play();
    };

    Letter.prototype = {
        onLetterWidthChanged: function() {
            this.width = GuiConstants.letterWidth;
            this.threshold = this.width > this.height ? this.width * 0.6 : this.height * 0.6;

            for(var i = 0; i < this.letterPoints.length; i++){
                this.letterPoints[i].position.x = this.position.x + this.width * this.letter[i].x;
                for(var j = 0; j < this.letterPoints[i].particles.length; j++) {
                    this.letterPoints[i].particles[j].position.x = this.letterPoints[i].position.x;
                }
            }
        },

        onLetterHeightChanged: function() {
            this.height = GuiConstants.letterHeight;
            this.threshold = this.width > this.height ? this.width * 0.6 : this.height * 0.6;

            for(var i = 0; i < this.letterPoints.length; i++){
                this.letterPoints[i].position.y = this.position.y + this.height * this.letter[i].y;
                for(var j = 0; j < this.letterPoints[i].particles.length; j++) {
                    this.letterPoints[i].particles[j].position.y = this.letterPoints[i].position.y;
                }
            }
        },

        determineShowingTriangles: function() {
            var showingNumber = this.letterPoints.length >> 1,
            index;
            console.log('[determineShowingTriangles]', showingNumber);
            for(i = 0; i < showingNumber; i++) {
                index = ~~(Math.random() * (this.letterPoints.length - 2));
                this.letterPoints[index].showing = true;
            }
        },

        playTl: function() {
            this.triangulateTl.play();
        },

        morph: function(letter, newX, newY) {
            // console.log('[morph]', letter, newX, newY);

            this.triangulateTl.clear();
            var oldLength = this.letter.length;
            // console.log('old letter:', this.letterSign, 'new letter:', letter);
            this.letter = Letters[letter];
            this.letterSign = letter;

            GlobalSignals.particlesAppeared.removeAll();
            GlobalSignals.particlesAppeared.addOnce(this.playTl.bind(this));

            this.position.x = newX;
            this.position.y = newY;

            this.removeUselessPoints(oldLength);
            this.addMissingPoints(oldLength, 5);

            // this.determineShowingTriangles();

            this.translatePoints();
        },

        translatePoints: function() {
            var count = 0;
            for(var i = 0; i < this.letter.length; i++) {
                if(this.letterPoints[count]) {
                    this.letterPoints[count].morphing = true;
                    TweenMax.to(this.letterPoints[count].position, 2, {
                        x: this.position.x + this.width * this.letter[i].x,
                        y: this.position.y + this.height * this.letter[i].y,
                        // delay: this.id * 0.2,
                        // ease: Quad.easeInOut,
                        onStart: function(index) {
                            // this.letterPoints[index].morphing = true;
                        }.bind(this),
                        onComplete: function(index) {
                            this.letterPoints[index].morphing = false;
                            GlobalSignals.morphingCompleted.dispatch();
                        }.bind(this), onCompleteParams: [count], onStartParams: [count]
                    });
                }
                count++;
            }
        },

        removeUselessPoints: function(oldLength) {
            for(var i = oldLength - 1; i > this.letter.length - 1; i--) {
                this.removePoint(i);
            }
        },

        addMissingPoints: function(oldLength, nbParticles) {
            for(var i = oldLength; i < this.letter.length; i++) {
                    this.letterPoints[i] = this.addPoint(this.position.x + this.width * this.letter[i].x, this.position.y + this.height * this.letter[i].y, nbParticles, i);
                }
        },

        reset: function(letter) {

        },

        addPoint: function(x, y, nbParticles, index) {
            return new LetterPoint(x, y, nbParticles, index);
        },

        removePoint: function(index) {
            // console.log('[removePoint]', index, this.letterPoints[index]);
            TweenMax.to(this.letterPoints[index], 1, {opacity: 0, ease: Expo.easeInOut, onComplete: function() {
                    this.letterPoints.splice(index, 1);
                }.bind(this)
            });
        },

        draw: function(context) {
            // Link points
            for(var i = 0; i < this.letterPoints.length; i++) {
                this.letterPoints[i].update(context);
                context.globalCompositeOperation = "lighter";
                if(i < this.letterPoints.length - 1) {
                    this.drawLines(context, this.letterPoints[i], this.letterPoints[i+1], 150);
                }
                context.globalCompositeOperation = "source-over"; // reset compositing
            }

            if(this.letterSign == "e") {
                // console.log(this.letterPoints[0].position);
                // console.log(this.letterPoints[1].position);
                // for(var i = 0; i < this.letterPoints.length) {
                    // console.log(this.letterPoints[i].position);
                // }
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