define(['helpers/Resize', 'helpers/Mouse', 'helpers/MathHelper', 'entities/Letter', 'entities/Attractor', 'entities/Particle', 'Stats', 'dat', 'helpers/ColorHelper', 'data/GlobalSignals', 'data/GuiConstants'], function(Resize, Mouse, MathHelper, Letter, Attractor, Particle, Stats, dat, ColorHelper, GlobalSignals, GuiConstants) {

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
            this.mouse = Mouse;//new Mouse(Resize.screenWidth, Resize.screenHeight);

            // Renderer init
            this.canvas = document.createElement('canvas');
            this.canvas.width = Resize.screenWidth;
            this.canvas.height = Resize.screenHeight;
            this.context = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);

            Resize.enableSmoothing(false);

            // Variables
            this.words = ["purple", "means", "disorder"];
            this.letterWidth = this.letterHeight = 90;
            this.letterSpacing = 80;
            this.wordIndex = 0;
            this.letterGroups = [];
            this.showNextWord();

            // this.particles = [];
            // this.particlesNumber = 200;

            // this.fluid = new Fluid(Resize.screenWidth, Resize.screenHeight, 5000);


            GlobalSignals.trianglesAppeared.addOnce(this.showText.bind(this));

            window.addEventListener('resize', this.onResize.bind(this));
        },

        showText: function() {
            this.wordsTl.play();
        },

        createWord: function(word) {
            var splitWord = word.split('');
            var letters = [];
            var startX = Resize.halfScreenWidth - (splitWord.length * (this.letterWidth + this.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - this.letterHeight;
            this.wordsTl = new TimelineMax({onComplete: this.onWordsTlComplete.bind(this)});
            for(var i = 0; i < splitWord.length; i++) {
                letters[i] = new Letter(splitWord[i], i * (this.letterWidth + this.letterSpacing) + startX, startY, this.letterWidth, this.letterHeight, i);
                this.wordsTl.insert(TweenMax.to(letters[i], 2, {opacity: 1, ease: Cubic.easeInOut}), 0.55 * i);
                // this.wordsTl.insert(TweenMax.to(letters[i], 2, {strokeWidth: 3, ease: Cubic.easeInOut}), 0.55 * i);
            }
            this.wordsTl.gotoAndStop(0);
            console.log(letters[0]);

            return letters;
        },

        onWordsTlComplete: function() {
            console.log('fadeIn Complete');
            var word = this.words[++this.wordIndex];
            var splitWord = word.split('');

            var startX = Resize.halfScreenWidth - (splitWord.length * (this.letterWidth + this.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - this.letterHeight;

            console.log('MORPHING', this.letterGroups[0].length, splitWord.length);
            for(var i = 0; i < this.letterGroups[0].length; i++) {
                if(i < splitWord.length) {
                    this.letterGroups[0][i].morph(word[i], startX + i * (this.letterWidth + this.letterSpacing), startY);
                }
            }

            if(this.letterGroups[0].length < splitWord.length) {
                var diff = splitWord.length - this.letterGroups[0].length;
                for(i = this.letterGroups[0].length; i < splitWord.length; i++) {
                    this.letterGroups[0][i] = new Letter(splitWord[i], i * (this.letterWidth + this.letterSpacing) + startX, startY, this.letterWidth, this.letterHeight, i);
                }
            }
            else if(this.letterGroups[0].length > splitWord.length) {
                for(i = this.letterGroups[0].length; i < splitWord.length; i++) {
                    TweenMax.to(this.letterGroups[0][i], 1, {opacity: 0, ease: Cubic.easeInOut, delay: i * 0.2});
                }
            }

            // Morph existing letter
            // Create missing
            // Hide not used anymore
        },

        showNextWord: function() {
            if(this.wordIndex >= this.words.length) return;
            console.log('[showNextWord]', this.wordIndex + 1 + "/" + this.words.length);
            if(this.letterGroups[this.wordIndex]) {
                this.letterGroups[this.wordIndex][0].explodedSignal.removeAll();
                this.letterGroups[this.wordIndex].length = 0;
            }
            this.letterGroups.push(this.createWord(this.words[this.wordIndex], 90, 90, 50));
        },

        onResize: function() {
            // Update size singleton
            Resize.onResize();

            this.canvas.width = Resize.screenWidth;
            this.canvas.height = Resize.screenHeight;
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
            for(var i = 0; i < this.letterGroups.length; i++) {
                for(var j = 0; j < this.letterGroups[i].length; j++) {
                    this.letterGroups[i][j].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
                }
            }

            requestAnimationFrame(this.animate.bind(this));
        },

        createGUI: function() {
            this.gui = new dat.GUI();
            this.gui.add(GuiConstants, 'debug');
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