define(['helpers/BufferLoader'], function(BufferLoader) {
    var AudioHelper = function() {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
        }
        catch(e) {
            console.error("Your browser doesn't support AudioContext.", e);
        }
    };

    AudioHelper.prototype = {
        load: function(url) {
            var bufferLoader = new BufferLoader(this.context, [url], this.onLoad.bind(this));
            bufferLoader.load();
        },

        onLoad: function(bufferList) {
            var source = this.context.createBufferSource();
            source.buffer = bufferList[0];
            source.connect(this.context.destination);

            source.connect(this.gainNode);

            var filter = this.context.createBiquadFilter();
            source.connect(filter);
            filter.connect(this.context.destination);
            filter.type = 0;
            filter.frequency.value = 440;

            source.start(0);
        },

        createOscillator: function() {
            var oscillator = this.context.createOscillator();
            oscillator.frequency.value = 200;
            oscillator.connect(this.context.destination);
            oscillator.start(0);
            return oscillator;
        },

        volume: function(value) {
            this.gainNode.gain.value = value;
        },

        dispose: function() {
            this.context = null;
        }
    };

    return AudioHelper;
});