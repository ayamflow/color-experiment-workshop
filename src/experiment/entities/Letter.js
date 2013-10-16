define(['data/Letters', 'entities/Vector', 'entities/LetterPoint', 'entities/MovingParticle', 'helpers/MathHelper', 'entities/Triangle', 'helpers/ColorHelper', 'tinycolor', 'entities/Attractor', 'signals'], function(Letters, Vector, LetterPoint, MovingParticle, MathHelper, Triangle, ColorHelper, tinycolor, Attractor, signals) {
    var Letter = function(letter, x, y, width, height, spacing) {
        this.width = width;
        this.height = height;
        this.spacing = spacing;

        this.explodedSignal = new signals.Signal();

        this.colors = ColorHelper.createRBScale("#880066", "#ff8800", 15);
        this.colorCount = 0;
        this.colorsIndex = 0;
        this.color = this.colors[this.colorsIndex];

        this.position = new Vector(x, y);

        this.letter = Letters[letter];
        // console.log('letter', this.letter, letter);

        this.points = [];
        // this.triangles = [];
        for(var i = 0; i < this.letter.length; i++) {
            for(var j = 0; j < this.letter[i].length; j++) {
                this.points.push(new LetterPoint(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y, 5));

                // this.movings.push(new MovingParticle(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y, 10));
                // this.triangles.push(new Triangle(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y, 10));
            }
        }
    };

    Letter.prototype = {

        // drawBatch: function(letters, context, x, y) {
        //     var splitLetters = letters.split('');
        //     for(var i = 0; i < splitLetters.length; i++) {
        //         this.draw(splitLetters[i], context, x + i * (this.width + this.spacing), y);
        //     }
        // },

        morph: function(letter) {

        },

        draw: function(context) {
            /*context.strokeStyle = "#fff";
            context.lineWidth = 1;
            context.beginPath();
            for(var i = 0; i < this.letter.length; i++) {
                for(var j = 0; j < this.letter[i].length; j++) {
                    if(j === 0) {
                        context.moveTo(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y);
                    }
                    else {
                        context.lineTo(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y);
                    }
                }
            }
            context.stroke();
            context.closePath();*/

            // Link points
            for(i = 0; i < this.points.length; i++) {

                if(this.attractor !== undefined) {
                    // this.attractor.draw(context);
                    for(var j = 0; j < this.points[i].particles.length; j++) {
                        this.points[i].particles[j].applyForce(this.attractor.attract(this.points[i].particles[j], -1));
                    }
                }

                this.points[i].update(context);
                if(i < this.points.length - 1) {
                    this.drawLines(context, this.points[i], this.points[i+1], 120);
                }

                // Update movings
                // this.movings[i].path(this.letter[0], 2);
                // this.movings[i].seek(this.position);
                // this.triangles[i].update(context);
            }

            if(this.colorsIndex < this.colors.length - 1) {
                if(this.colorCount++ > 35) {
                    this.colorCount = 0;
                    this.colorsIndex++;
                }
            }
            else if(this.attractor === undefined) {
                this.attractor = new Attractor(this.position.x + this.width, this.position.y + this.height);
                this.attractor.mass = 60;
                setTimeout(function() {
                    this.explodedSignal.dispatch();
                }.bind(this), 1200);
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
                    var color = tinycolor(this.colors[this.colorsIndex]).toRgbString().replace(')', ',' + (1 - dist / threshold) + ')').replace('rgb', 'rgba');
                    context.strokeStyle = color;
                    // context.strokeStyle = 'rgba(136, 0, 102, ' + (1 - dist / threshold) +')';
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