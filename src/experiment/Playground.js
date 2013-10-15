define(['helpers/Resize', 'helpers/Mouse', 'helpers/MathHelper', 'entities/Letter', 'entities/Attractor', 'entities/Particle', 'Stats', 'dat', 'entities/Triangle', 'helpers/ColorHelper'], function(Resize, Mouse, MathHelper, Letter, Attractor, Particle, Stats, dat, Triangle, ColorHelper) {

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
            this.words = ["purple", "means", "disorder"];
            this.wordIndex = 0;
            this.letterGroups = [];
            this.onExploded();


            this.particles = [];
            this.particlesNumber = 200;

            window.addEventListener('resize', this.onResize.bind(this));
        },

        createWord: function(word) {
            var splitWord = word.split('');
            var letters = [];
            var startX = Resize.halfScreenWidth - (splitWord.length * 100) / 2;
            var startY = Resize.halfScreenHeight - 70;
            for(var i = 0; i < splitWord.length; i++) {
                letters[i] = new Letter(splitWord[i], i * 100 + startX, startY, 70, 70, 50);
            }
            letters[0].explodedSignal.add(this.onExploded.bind(this));

            return letters;
        },

        onExploded: function() {
            console.log('[onExploded]', this.wordIndex + "/" + this.words.length);
            if(this.wordIndex >= this.words.length) return;
            if(this.letterGroups[this.wordIndex]) {
                this.letterGroups[this.wordIndex][0].explodedSignal.removeAll();
                this.letterGroups[this.wordIndex].length = 0;
            }
            this.letterGroups.push(this.createWord(this.words[this.wordIndex]));
            this.letterGroups[this.wordIndex++][0].explodedSignal.add(this.onExploded.bind(this));
        },

        onResize: function() {
            // Update size singleton
            Resize.onResize();

        },

        animate: function()
        {
            this.context.clearRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            // this.context.fillStyle = "rgba(0, 0, 0, 0.05";
            // this.context.fillRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            if(this.isDebug)
            {
                this.stats.update();
            }

            // EXPERIMENT LOGIC
            // this.letters.drawBatch("abf", this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
            for(var i = 0; i < this.letterGroups.length; i++) {
                for(var j = 0; j < this.letterGroups[i].length; j++) {
                    this.letterGroups[i][j].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
                }
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

            requestAnimationFrame(this.animate.bind(this));
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