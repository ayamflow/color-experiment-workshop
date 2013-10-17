define(['helpers/Resize'], function(Resize) {
    var TextParticle = function(word) {
        this.particlesNumber = 100;
        this.word = word;
    };

    TextParticle.prototype = {
        init: function() {
            context.font = "bold 128pt Helvetica";
            context.textAlign = "center";
            this.whitePixels = [];
            this.points = [];

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = context.measureText(this.word).width;
            canvas.height = 128;
            context.fillStyle = "#ff8800";
            context.fillText(this.word, Resize.halfScreenWidth, Resize.halfScreenHeight);
            context.closePath();

            this.mask = context.getImageData(0, 0, canvas.width, canvas.height);

            for(var i = 0; i < this.mask.data.length; i+= 4) {
                if(this.mask.data[i] == 255 && this.mask.data[i+1] == 255 && this.mask.data[i+2] == 255 && this.mask.data[i+3] == 255) {
                    this.whitePixels.push()
                }
            }
        },

        // TODO : put it in a imageReader helper
        iToX: function(i, width) {
            return ((i % ( 4)))
        }

        update: function(context) {
            var p;
            for(var i = 0; i < this.points.length; i++) {
                p = this.points[i];
                p.update(context);
                // if(p.position.x >= Resize.screenWidth || p.position.x <= 0 || this.mask.data
            }

            this.draw(context);
        },

        draw: function(context) {

        }
    };

    return TextParticle;
});