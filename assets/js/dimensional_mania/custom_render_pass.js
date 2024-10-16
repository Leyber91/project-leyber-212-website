// custom_render_pass.js

export class CustomRenderPass {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
    }

    render(renderer) {
        renderer.render(this.scene, this.camera);
    }
}
