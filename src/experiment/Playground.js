define(['helpers/Resize', 'helpers/Mouse', 'helpers/MathHelper', 'entities/Letter', 'entities/Attractor', 'entities/Particle', 'Stats', 'dat'], function(Resize, Mouse, MathHelper, Letter, Attractor, Particle, Stats, dat) {

    var Playground = function()
    {
        this.isDebug = true;
        if(this.isDebug)
        {
            this.debug();
        }

        // Kick it !
        this.init();
        this.createGUI();
        this.animate();
    };

    Playground.prototype = {
        init: function()
        {
            // Mouse init
            this.mouse = new Mouse(Resize.screenWidth, Resize.screenHeight);

            // Renderer init
            this.canvas = document.createElement('canvas');
            this.canvas.width = Resize.screenWidth;
            this.canvas.height = Resize.screenHeight;
            this.context = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);

            Resize.enableSmoothing(false);

            // Variables
            this.enableRepel = false;
            var word = "coucou".split('');
            this.letters = [];
            var startX = Resize.halfScreenWidth - (word.length * 100) / 2;
            for(var i = 0; i < word.length; i++) {
                this.letters[i] = new Letter(word[i], i * 100 + startX, Resize.halfScreenHeight, 70, 70, 50);
            }

            this.particles = [];
            this.particlesNumber = 200;

            this.repeller = new Attractor(Resize.screenWidth, Resize.screenHeight);

            window.addEventListener('resize', this.onResize.bind(this));
        },

        onResize: function() {
            // Update size singleton
            Resize.onResize();

        },

        animate: function()
        {
            this.context.clearRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            if(this.isDebug)
            {
                this.stats.update();
            }

            // EXPERIMENT LOGIC
            // this.letters.drawBatch("abf", this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
            for(var i = 0; i < this.letters.length; i++) {
                this.letters[i].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
                /*if(this.enableRepel) {
                    if(dist <= 100) {
                        for(var j = 0; j < this.letters[i].points.length; j++) {
                            for(var k = 0; k < this.letters[i].points[j].particles.length; k++) {
                                this.letters[i].points[j].particles[k].applyForce(this.repeller.attract(this.letters[i].points[j].particles[k]));
                            }
                        }
                    }
                }*/
            }

            this.repeller.position.x = this.mouse.x;
            this.repeller.position.y = this.mouse.y;
            this.repeller.draw(this.context);

            requestAnimationFrame(this.animate.bind(this));
        },

        explode: function() {
            this.enableRepel = true;
        },

        createGUI: function() {
            this.gui = new dat.GUI();
            this.gui.add(this, 'enableRepel');
        },

        debug: function() {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            this.stats.domElement.style.zIndex = '100';
            document.body.appendChild(this.stats.domElement);
        }
    };

    return Playground;
});