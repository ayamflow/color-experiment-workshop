define(['data/Letters', 'entities/Vector', 'entities/LetterPoint', 'entities/MovingParticle', 'helpers/MathHelper'], function(Letters, Vector, LetterPoint, MovingParticle, MathHelper) {
    var Letter = function(letter, x, y, width, height, spacing) {
        this.width = width;
        this.height = height;
        this.spacing = spacing;

        this.position = new Vector(x, y);

        this.letter = Letters[letter];

        this.points = [];
        this.movings = [];
        for(var i = 0; i < this.letter.length; i++) {
            for(var j = 0; j < this.letter[i].length; j++) {
                this.points.push(new LetterPoint(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y, 10));

                this.movings.push(new MovingParticle(x + this.width * this.letter[i][j].x, y + this.height * this.letter[i][j].y, 10));
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
            for(i = 0; i < this.points.length - 1; i++) {
                this.points[i].update(context);
                this.drawLines(context, this.points[i], this.points[i+1], 120);

                // Update movings
                // this.movings[i].path(this.letter[0], 2);
                this.movings[i].seek(this.position);
                this.movings[i].update(context);
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
                    context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - dist / threshold) +')';
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