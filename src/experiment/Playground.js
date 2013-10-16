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
            this.letterGroup = [];

            // Create & animate the first word
            this.createWord(this.words[this.wordIndex], 90, 90, 50);

            GlobalSignals.trianglesAppeared.addOnce(this.showText.bind(this));

            window.addEventListener('resize', this.onResize.bind(this));
        },


        createWord: function(word) {
            var splitWord = word.split('');
            var startX = Resize.halfScreenWidth - (splitWord.length * (this.letterWidth + this.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - this.letterHeight;
            this.wordsTl = new TimelineMax({onComplete: this.onWordsTlComplete.bind(this)});


            for(var i = 0; i < splitWord.length; i++) {
                this.letterGroup[i] = this.addLetter(splitWord[i], i, i * (this.letterWidth + this.letterSpacing) + startX, startY);
                // letters[i] = new Letter(splitWord[i], i * (this.letterWidth + this.letterSpacing) + startX, startY, this.letterWidth, this.letterHeight, i);
                this.wordsTl.insert(TweenMax.to(this.letterGroup[i], 2, {opacity: 1, ease: Cubic.easeInOut}), 0.55 * i);
                // this.wordsTl.insert(TweenMax.to(letters[i], 2, {strokeWidth: 3, ease: Cubic.easeInOut}), 0.55 * i);
                console.log(this.letterGroup[i]);
            }
            // Speed up things for debug
            if(GuiConstants.debug) this.wordsTl.timeScale = GuiConstants.timeScale;
            this.wordsTl.gotoAndStop(0);
        },

        addLetter: function(letter, index, x, y) {
            return new Letter(letter, x, y, this.letterWidth, this.letterHeight, index);
        },

        removeLetter: function(index) {
            TweenMax.to(this.letterGroup[index], 1, {opacity: 0, ease: Expo.easeInOut, onComplete: function() {
                    this.letterGroup.splice(index, 1);
                }
            });
        },

        showText: function() {
            this.wordsTl.play();
        },

        onWordsTlComplete: function() {
            console.log('fadeIn Complete');
            var word = this.words[++this.wordIndex];
            var splitWord = word.split('');

            var startX = Resize.halfScreenWidth - (splitWord.length * (this.letterWidth + this.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - this.letterHeight;

            console.log('MORPHING', word, this.letterGroup.length, splitWord.length);
            for(var i = 0; i < this.letterGroup.length; i++) {
                if(i < splitWord.length) {
                    this.letterGroup[i].morph(word[i], startX + i * (this.letterWidth + this.letterSpacing), startY);
                }
            }

            if(this.letterGroup.length < splitWord.length) { // Need to create more letters
                console.log('CREATING LETTER');
                for(i = this.letterGroup.length; i < splitWord.length; i++) {
                    console.log('create letter', splitWord[i]);
                    this.letterGroup[i] = new Letter(splitWord[i], i * (this.letterWidth + this.letterSpacing) + startX, startY, this.letterWidth, this.letterHeight, i);
                    this.letterGroup[i].opacity = 1;
                }
            }
            else if(this.letterGroup.length > splitWord.length) { // Need to hide some letters
                console.log('HIDING LETTER');
                for(i = this.letterGroup.length - 1; i < splitWord.length; i++) {
                    console.log('hide letter', this.words[this.wordIndex - 1].split('')[i]);
                    this.letterGroup[i].hide();
                }
            }

            // Morph existing letter
            // Create missing
            // Hide not used anymore
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
            for(var i = 0; i < this.letterGroup.length; i++) {
                for(var j = 0; j < this.letterGroup[i].length; j++) {
                    this.letterGroup[i][j].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
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