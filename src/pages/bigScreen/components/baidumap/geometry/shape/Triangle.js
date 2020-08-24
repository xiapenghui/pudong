import Polygon from "./Polygon";
import {SHAPE_TRIANGLE_TYPE} from "./Shape";

export default class Triangle extends Polygon {

    constructor({type = SHAPE_TRIANGLE_TYPE, size = 0, x = 0, y = 0}) {
        super({type});
        this._size = size;
        this._x = x;
        this._y = y;

        let halfSize = this.size / 2.0;
        let tm = [this.x, this.y - halfSize];
        let bl = [this.x - halfSize, this.y + halfSize];
        let br = [this.x + halfSize, this.y + halfSize];

        this._coordinates = [
            [
                tm,
                bl,
                br,
                tm
            ]
        ]
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    toJson() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            size: this.size
        }
    }


}