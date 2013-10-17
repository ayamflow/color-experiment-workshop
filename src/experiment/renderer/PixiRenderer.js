define(['PIXI', 'helpers/Resize'], function(PIXI, Resize) {
    var PixiRenderer = function(width, height) {
        this.renderer = new PIXI.WebGLRenderer(width, height, null, true);
        this.renderer.view.id = "pixi";
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Stage();
    };

    PixiRenderer.prototype = {
        addChild: function(object) {
            this.stage.addChild(object);
        },

        removeChild: function(object) {
            this.stage.removeChild(object);
        },

        update: function() {
            this.renderer.render(this.stage);
        }
    };

    // return PixiRenderer;
    var rendererSingleton = new PixiRenderer(Resize.screenWidth, Resize.screenHeight);
    return rendererSingleton;

});