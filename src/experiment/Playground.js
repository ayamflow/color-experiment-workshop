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
            GuiConstants.letterWidth = GuiConstants.letterHeight = 90;
            GuiConstants.letterSpacing = 60;
            this.wordIndex = 0;
            this.letterGroup = [];

            // Map signal of letter morph completion
            this.addEvents();

            // Kick it
            this.createWord(this.words[this.wordIndex]);

            window.addEventListener('resize', this.onResize.bind(this));
        },

        resetEvents: function() {
            GlobalSignals.morphingCompleted.removeAll();
            GlobalSignals.trianglesAppeared.removeAll();
            GlobalSignals.textTransformCompleted.removeAll();
        },

        addEvents: function() {
            // Listen for word change
            GlobalSignals.morphingCompleted.addOnce(this.changeWord.bind(this));
            GlobalSignals.trianglesAppeared.addOnce(this.showText.bind(this));

            // Listen for word changing done
            GlobalSignals.textTransformCompleted.addOnce(this.explodeText.bind(this));
        },

        showText: function() {
            this.wordsTl.play();
        },

        createWord: function(word) {
            var splitWord = word.split('');
            var startX = Resize.halfScreenWidth - (splitWord.length * (GuiConstants.letterWidth + GuiConstants.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - GuiConstants.letterHeight;
            this.wordsTl = new TimelineMax({onComplete: this.changeWord.bind(this)});

            for(var i = 0; i < splitWord.length; i++) {
                this.letterGroup[i] = this.addLetter(splitWord[i], i, i * (GuiConstants.letterWidth + GuiConstants.letterSpacing) + startX, startY);
                this.wordsTl.insert(TweenMax.to(this.letterGroup[i], 2, {opacity: 1, ease: Cubic.easeInOut}), 0.55 * i);
            }

            // Speed up things a bit in debug mode
            if(GuiConstants.debug) this.wordsTl.timeScale(GuiConstants.timeScale);
            this.wordsTl.gotoAndStop(0);
        },

        changeWord: function() {
            this.resetEvents();

            if(this.wordIndex >= this.words.length - 1) {
                console.log('YENAPU');
                return GlobalSignals.textTransformCompleted.dispatch();
            }

            // Fetch next word
            var word = this.words[++this.wordIndex];
            var splitWord = word.split('');
            console.log('[changeWord]', word, this.wordIndex + 1 + "/" + this.words.length);

            var startX = Resize.halfScreenWidth - (splitWord.length * (GuiConstants.letterWidth + GuiConstants.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - GuiConstants.letterHeight;

            // setTimeout(function() {
                this.removeUnusedLetters(splitWord);
                this.addMissingLetters(startX, startY, splitWord);

                this.morphCurrentWord(startX, startY, word);
                this.addEvents();
            // }.bind(this), 2500);// / GuiConstants.timeScale);
        },

        morphCurrentWord: function(x, y, word) {
            for(var i = 0; i < word.length; i++) {
                this.letterGroup[i].morph(word[i], x + i * (GuiConstants.letterWidth + GuiConstants.letterSpacing), y);
            }
        },

        addMissingLetters: function(x, y, newWord) {
            for(i = this.letterGroup.length; i < newWord.length; i++) {
                this.letterGroup[i] = new Letter(newWord[i], Resize.halfScreenWidth, Resize.halfScreenHeight, GuiConstants.letterWidth, GuiConstants.letterHeight, i);
                TweenMax.from(this.letterGroup[i].position, 1, {x: this.letterGroup[i].position.x - 50, y: this.letterGroup[i].position.y - 50, ease: Cubic.easeInOut});
                TweenMax.to(this.letterGroup[i], 1, {
                    opacity: 1,
                    x: i * (GuiConstants.letterWidth + GuiConstants.letterSpacing) + x,
                    y: y,
                    ease: Expo.easeInOut
                });
            }
        },

        removeUnusedLetters: function(newWord) {
            for(i = newWord.length; i < this.letterGroup.length; i++) {
                this.removeLetter(i);
            }
        },

        addLetter: function(letter, index, x, y) {
            // console.log('[addLetter]', index, x, y);
            return new Letter(letter, x, y, GuiConstants.letterWidth, GuiConstants.letterHeight, index);
        },

        removeLetter: function(index) {
            console.log('[removeLetter]', index);
            TweenMax.to(this.letterGroup[index], 1, {opacity: 0, ease: Expo.easeInOut, onComplete: function() {
                    this.letterGroup.splice(index, 1);
                }.bind(this)
            });
        },

        onResize: function() {
            // Update size singleton
            Resize.onResize();

            this.canvas.width = Resize.screenWidth;
            this.canvas.height = Resize.screenHeight;
        },

        explodeText: function() {
            console.log('[explodeText]');
            this.resetEvents();
            TweenMax.to(GuiConstants, 2.5, {mass: 100, ease: Cubic.easeInOut, onComplete: function() {
                    GuiConstants.mass = 0;
                }
            });
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
                this.letterGroup[i].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
            }

            requestAnimationFrame(this.animate.bind(this));
        },

        createGUI: function() {
            this.gui = new dat.GUI();
            this.gui.add(GuiConstants, 'debug');

            var letters = this.gui.addFolder("Letters");
            var widthUpdate = letters.add(GuiConstants, 'letterWidth').min(10).max(200);
            var heightUpdate = letters.add(GuiConstants, 'letterHeight').min(10).max(200);
            var spacingUpdate = letters.add(GuiConstants, 'letterSpacing').min(10).max(200);

            widthUpdate.onChange(function() {
                GlobalSignals.letterWidthChanged.dispatch();
            });

            heightUpdate.onChange(function() {
                GlobalSignals.letterHeightChanged.dispatch();
            });

            spacingUpdate.onChange(function() {
                GlobalSignals.letterSpacingChanged.dispatch();
            });

            letters.open();

            var attractors = this.gui.addFolder("Attractors");
            var mass = attractors.add(GuiConstants, 'mass').min(0).max(120);
            var grav = attractors.add(GuiConstants, 'gravityConstant').min(0).max(100);

            mass.listen();
            mass.onChange(function() {
                for(var i = 0; i < this.letterGroup.length; i++) {
                    for(var j = 0; j < this.letterGroup[i].letterPoints.length; j++) {
                        this.letterGroup[i].letterPoints[j].attractor.mass = GuiConstants.mass;
                    }
                }
            }.bind(this));

            grav.onChange(function() {
                for(var i = 0; i < this.letterGroup.length; i++) {
                    for(var j = 0; j < this.letterGroup[i].letterPoints.length; j++) {
                        this.letterGroup[i].letterPoints[j].attractor.gravityConstant = GuiConstants.gravityConstant;
                    }
                }
            }.bind(this));

            attractors.open();
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