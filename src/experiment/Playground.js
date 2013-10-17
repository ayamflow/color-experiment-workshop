define(['helpers/Resize', 'helpers/Mouse', 'helpers/MathHelper', 'entities/Letter', 'entities/Attractor', 'entities/Particle', 'Stats', 'dat', 'helpers/ColorHelper', 'data/GlobalSignals', 'data/GuiConstants', 'entities/Glitcher', 'helpers/AudioHelper', 'Howler'], function(Resize, Mouse, MathHelper, Letter, Attractor, Particle, Stats, dat, ColorHelper, GlobalSignals, GuiConstants, Glitcher, AudioHelper, Howler) {

    var Playground = function()
    {
        this.isDebug = true;
        if(this.isDebug)
        {
            this.debug();
        }
        this.trails = false;

        // Kick it !
        this.init();
        // this.createGUI();
        this.loadSong();
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
            this.canvas.id = "world";
            this.context = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
            Resize.enableSmoothing(false);

            // Glitch init
            this.glitchNoises = [];
            var glitches = [1, 2, 3, 16, 17, 19, 20, 23, 24, 26, 29];
            var index;
            for(var i = 0; i < glitches.length; i++) {
                index = glitches[i] < 10 ? "0" + glitches[i] : glitches[i];
                this.glitchNoises[i] = "sounds/glitchs/" + index + ".wav";
            }
            this.glitchTimer = 0;
            this.glitchBandTimer = 0;
            this.glitchBandInterval = 20;
            this.glitcher = new Glitcher(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight);

            // Words init
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

        loadSong: function() {
            this.audio = new AudioHelper();
            this.windAudio = new Howl({
                urls: ['/sounds/ambiant-wind.mp3']
            }).play().volume(0).fadeIn(0.5, 1000);
            this.ambiant = new Howl({
                urls: ['/sounds/ambiant-dark.mp3'],
                autoplay: false
            });
        },

        playGlitchNoise: function(min, max) {
            min = min || 0;
            max = max || this.glitchNoises.length - 1;
            this.audio.load(this.glitchNoises[~~(MathHelper.rand(min, max))]);
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
            GlobalSignals.particlesAppeared.add(function() {
                this.windAudio.fadeOut(0, 800);
                // this.ambiant = new Howl({
                    // urls: ['/sounds/ambiant-dark.mp3']
                // }).play().volume(0).fadeIn(0.2, 3000);
                this.ambiant.play().volume(0).fadeIn(0.2, 3000);
            }.bind(this));

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
                this.wordsTl.insert(TweenMax.to(this.letterGroup[i], 2, {opacity: 1, ease: Cubic.easeInOut, onStart: function() {
                        this.playGlitchNoise();
                    }.bind(this)
                }), 0.55 * i);
            }

            // Speed up things a bit in debug mode
            if(GuiConstants.debug) this.wordsTl.timeScale(GuiConstants.timeScale);
            this.wordsTl.gotoAndStop(0);

            GlobalSignals.experimentStarted.dispatch();
        },

        changeWord: function() {
            this.resetEvents();

            this.glitchInterval = Math.max(1, 80 - 20 * this.wordIndex);

            this.setGlitchData();
            if(this.wordIndex >= this.words.length - 1) {
                console.log('YENAPU');
                this.ambiant.fadeOut(0, 1500);
                this.bip = this.audio.createOscillator();
                this.trails = true;
                // this.glitchInterval = 35;
                this.glitchInterval = 5;
                // return GlobalSignals.textTransformCompleted.dispatch();
                return this.explodeText();
            }

            // Fetch next word
            var word = this.words[++this.wordIndex];
            var splitWord = word.split('');
            console.log('[changeWord]', word, this.wordIndex + 1 + "/" + this.words.length);

            var startX = Resize.halfScreenWidth - (splitWord.length * (GuiConstants.letterWidth + GuiConstants.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - GuiConstants.letterHeight;

            // var timer = GuiConstants.debug ? 1500 / GuiConstants.timeScale : 1500;
            var timer = 1500;
            setTimeout(function() {
                this.removeUnusedLetters(splitWord);
                this.addMissingLetters(startX, startY, splitWord);

                // this.playGlitchNoise();
                this.audio.load('/sounds/glitchs/34.wav');
                this.morphCurrentWord(startX, startY, word);
                this.addEvents();
            }.bind(this), timer);
        },

        morphCurrentWord: function(x, y, word) {
            // console.log('[morphCurrentWord] Letters to morph:', word, word.length);
            for(var i = 0; i < word.length; i++) {
                this.letterGroup[i].morph(word[i], x + i * (GuiConstants.letterWidth + GuiConstants.letterSpacing), y);
            }
        },

        addMissingLetters: function(x, y, newWord) {
            for(var i = this.letterGroup.length; i < newWord.length; i++) {
                // this.letterGroup[i] = new Letter(newWord[i], Resize.halfScreenWidth, Resize.halfScreenHeight, GuiConstants.letterWidth, GuiConstants.letterHeight, i);
                this.letterGroup[i] = new Letter(newWord[i], this.letterGroup[i - 1].position.x + 15, this.letterGroup[i - 1].position.y, GuiConstants.letterWidth, GuiConstants.letterHeight, i);
                // TweenMax.from(this.letterGroup[i].position, 1, {x: this.letterGroup[i].position.x - 50, y: this.letterGroup[i].position.y - 50, ease: Cubic.easeInOut});
                // TweenMax.to(this.letterGroup[i], 1, {
                    // opacity: 1,
                    // delay: i * 0.15,
                    // ease: Back.easeOut
                // });
                this.letterGroup[i].opacity = 1;
            }
        },

        removeUnusedLetters: function(newWord) {
            for(var i = newWord.length; i < this.letterGroup.length; i++) {
                this.removeLetter(i);
            }
        },

        addLetter: function(letter, index, x, y) {
            // console.log('[addLetter]', index, x, y);
            return new Letter(letter, x, y, GuiConstants.letterWidth, GuiConstants.letterHeight, index);
        },

        removeLetter: function(index) {
            // console.log('[removeLetter]', index);
            TweenMax.to(this.letterGroup[index], 0.5, {opacity: 0, ease: Expo.easeInOut, onComplete: function() {
                    this.letterGroup.splice(index, 1);
                }.bind(this)
            });
        },

        createFluid: function() {
            this.fluid = new Fluid(Resize.screenWidth, Resize.screenHeight, 5000);
        },

        onResize: function() {
            // Update size singleton
            Resize.onResize();

            this.canvas.width = Resize.screenWidth;
            this.canvas.height = Resize.screenHeight;
        },

        explodeText: function() {
            console.log('[explodeText]', GuiConstants.mass);
            this.resetEvents();

            // var explodeTl = new TimelineMax({onUpdate: this.updateAttractorsMass.bind(this), onComplete: this.createFluid.bind(this)});
            var explodeTl = new TimelineMax({onUpdate: this.updateAttractorsMass.bind(this), onComplete: this.stopGlitch.bind(this)});

            var duration = 3;
            explodeTl.insert(TweenMax.to(GuiConstants, duration, {mass: 120}), 0);
            explodeTl.insert(TweenMax.to(GuiConstants, duration, {mass: 0}), duration);

            explodeTl.play();

        },

        updateAttractorsMass: function() {
            for(var i = 0; i < this.letterGroup.length; i++) {
                for(var j = 0; j < this.letterGroup[i].letterPoints.length; j++) {
                    this.letterGroup[i].letterPoints[j].attractor.mass = GuiConstants.mass;
                }
            }
        },

        animate: function()
        {
            if(this.trails) {
                this.context.fillStyle = "rgba(0, 0, 0, 0.05";
                this.context.fillRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            }
            else {
                this.context.clearRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            }
            if(this.isDebug)
            {
                this.stats.update();
            }

            this.context.globalCompositeOperation = "lighter";

            // EXPERIMENT LOGIC
            for(var i = 0; i < this.letterGroup.length; i++) {
                this.letterGroup[i].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
            }

            this.updateGlitchs();

            requestAnimationFrame(this.animate.bind(this));
        },

        updateGlitchs: function() {
            if(this.glitcher) {
                if(this.glitchTimer++ >= this.glitchInterval) {
                    this.glitchTimer = 0;
                    this.playGlitchNoise();
                    // if(this.glitchData) {
                        // this.glitcher.glitchFromData(this.context, 0, 0, this.glitchData, Resize.halfScreenHeight - this.glitchData.height);
                    // }
                    // else {
                        this.glitcher.updateImage(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight);
                        this.glitcher.glitch(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight, 30);
                    // }

                }
                if(this.glitchBand && this.glitchBandTimer++ >= this.glitchBandInterval) {
                    // this.playGlitchNoise();
                    this.glitchBandTimer = 0;
                    this.glitcher.glitchFromData(this.context, 0, 0, this.glitchBand, Resize.halfScreenHeight - this.glitchBand.height, Math.random() > 0.5 ? 1 : 2);
                }
                this.drawScalines();
            }
        },

        stopGlitch: function() {
            TweenMax.to(this, 1, {glitchInterval: 120});
        },

        setGlitchData: function() {
            if(this.wordIndex === 0) {
                this.glitchBand = this.context.getImageData(0, Resize.halfScreenHeight, Resize.screenWidth, 30);
            }
            else if(this.wordIndex == this.words.length - 1) {
                // this.glitchData = this.context.getImageData(0, 0, Resize.screenWidth, Resize.screenHeight);
                this.glitchData = this.context.getImageData(0, Resize.screenHeight >> 2, Resize.screenWidth, 60);
            }
        },

        drawScalines: function() {
            this.context.fillStyle = "#111";
            for(var i = 0; i < Resize.screenHeight; i+= 4) {
                this.context.fillRect(0, i, Resize.screenWidth, 1);
            }
        },

        createGUI: function() {
            this.gui = new dat.GUI();
            this.gui.add(GuiConstants, 'debug');
            this.gui.add(GuiConstants, 'drawAttractor');

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