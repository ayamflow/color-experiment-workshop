require.config({
    baseUrl: 'src/experiment',
    paths: {
        Stats: '../../lib/stats.min',
        Leap: '../../lib/leap.min',
        PIXI: '../../lib/pixi/bin/pixi',
        THREE: '../../lib/threejs/build/three.min',
        dat: '../../lib/dat.gui.min'
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
        }
    }
});

require(['Playground'], function(Playground) {
    var playground = new Playground();
});