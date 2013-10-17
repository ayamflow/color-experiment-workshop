require.config({
    baseUrl: 'src/experiment',
    paths: {
        Stats: '../../lib/stats.min',
        Leap: '../../lib/leap.min',
        PIXI: '../../lib/pixi/bin/pixi',
        THREE: '../../lib/threejs/build/three.min',
        dat: '../../lib/dat.gui.min',
        tinycolor: '../../lib/tinycolor.min',
        TweenMax: '../../lib/TweenMax.min',
        signals: '../../lib/signals.min',
        Howler: '../../lib/howler.min'
    },
    shim: {
        'Stats': {
            exports: 'Stats'
        },
        'Leap': {
            exports: 'Leap'
        },
        'PIXI': {
            exports: 'PIXI'
        },
        'THREE': {
            exports: 'THREE'
        },
        'dat': {
            exports: 'dat'
        },
        'tinycolor': {
            exports: 'tinycolor'
        },
        'TweenMax': {
            exports: 'TweenMax'
        },
        'signals': {
            exports: 'signals'
        },
        'Hower': {
            exports: 'Howler'
        }
    }
});

require(['Playground'], function(Playground) {
    var playground = new Playground();
});