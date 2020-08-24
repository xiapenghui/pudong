import {mat2d,vec2} from "gl-matrix";

export default class Transformer {

    constructor(options) {
        this.xstart = options.xstart;
        this.ystart = options.ystart;
        this.xstep = options.xstep;
        this.ystep = options.ystep;
        this.mat = mat2d.fromValues(this.xstep, 0, 0, this.ystep, this.xstart, this.ystart);
        this.invertMat = mat2d.invert(mat2d.create(), this.mat);
    }

    toGeo(x, y) {
        let out = vec2.create();
        vec2.transformMat2d(
            out,
            vec2.fromValues(x , y),
            this.mat
        );
        return out;
    }

    toScreen(x, y) {
        let out = vec2.create();
        vec2.transformMat2d(
            out,
            vec2.fromValues(x , y),
            this.invertMat
        );
        vec2.floor(out , out);
        return out;
    }

}