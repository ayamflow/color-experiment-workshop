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
            var word = "prpl".split('');
            this.letters = [];
            for(var i = 0; i < word.length; i++) {
                this.letters[i] = new Letter(word[i], i * 100 + Resize.halfScreenWidth, Resize.halfScreenHeight, 70, 70, 50);
            }

            this.particles = [];
            this.particlesNumber = 200;
            // for(var i = 0; i < this.particlesNumber; i++) {
            //     this.particles.push(new Particle(MathHelper.rand(0, Resize.screenWidth), MathHelper.rand(0, Resize.screenHeight)));
            // }

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
            }

            // this.attractor.position.x = this.mouse.x;
            // this.attractor.position.y = this.mouse.y;
            // this.attractor.draw(this.context);

            // for(var i = 0; i < this.particlesNumber; i++) {
                // for(var a = 0; a < this.letters.attractors.length; a++) {
                    // this.particles[i].applyForce(this.letters.attractors[a].attract(this.particles[i]));
                // }
                // this.particles[i].applyForce(this.letters.attractors[0].attract(this.particles[i]));
                // this.particles[i].applyForce(this.attractor.attract(this.particles[i]));
                // console.log(i, this.particles[i].position.x, this.particles[i].position.y);
                // this.particles[i].update(this.context);

                // this.drawLines(i, this.particles[i], 30);
            // }

            requestAnimationFrame(this.animate.bind(this));
        },

        drawLines: function(i, particle, threshold) {
            var dist, particle2;
            for(j = i + 1; j < this.particlesNumber; j++) {
                particle2 = this.particles[j];
                dist = MathHelper.pDist(particle.position, particle2.position);
                if(dist <= threshold) {
                    this.context.beginPath();
                    this.context.strokeStyle = 'rgba(255, 255, 255, ' + (1-dist/threshold) +')';
                    this.context.moveTo(particle.position.x, particle.position.y);
                    this.context.lineTo(particle2.position.x, particle2.position.y);
                    this.context.stroke();
                    this.context.closePath();
                }
            }
        },

        createGUI: function() {
            this.gui = new dat.GUI();
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