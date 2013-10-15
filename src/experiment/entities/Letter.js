define(['entities/LetterPoint', 'helpers/MathHelper'], function(LetterPoint, MathHelper) {
    var Letter = function(letter, x, y, width, height, spacing) {
        this.width = width;
        this.height = height;
        this.spacing = spacing;

        this.letters = {
            a: [
                [
                    {x: 0, y: 2},
                    {x: 0, y: 1},
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 1, y: 2}
                ],
                [
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ]
            ],
            b: [
                [
                    {x: 0, y: 2},
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 2},
                    {x: 0, y: 2}
                ],
                [
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ]
            ],
            l: [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: 1, y: 2}
                ]
            ],
            p: [
                [
                    {x: 0, y: 2},
                    {x: 0, y: 1},
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 0, y: 1}
                ]
            ],
            r: [
                [
                    {x: 0, y: 2},
                    {x: 0, y: 1},
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 0, y: 1},
                    {x: 1, y: 2}
                ]
            ],
            u: [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: 1, y: 2},
                    {x: 1, y: 1},
                    {x: 1, y: 0}
                ]
            ],
            f: [
                [
                    {x: 0, y: 2},
                    {x: 0, y: 1},
                    {x: 0, y: 0},
                    {x: 1, y: 0}
                ],
                [
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ]
            ]
        };
        this.letter = this.letters[letter];

        this.points = [];
        for(var i = 0; i < this.letter.length; i++) {
            for(var j = 0; j < this.letter[i].length; j++) {
                this.points.push(new LetterPoint(x + this.width * this.letter[i][j].x, y + this.height * this.letters[letter][i][j].y, 10));
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

            for(i = 0; i < this.points.length - 1; i++) {
                this.points[i].update(context);
                this.drawLines(context, this.points[i], this.points[i+1], 120);
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