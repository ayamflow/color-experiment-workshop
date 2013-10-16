define(['signals'], function(signals) {
    var globalSignals =  {
        particlesAppeared: new signals.Signal(),
        trianglesAppeared: new signals.Signal(),
        lineAppeared: new signals.Signal()
    };

    return globalSignals;
});