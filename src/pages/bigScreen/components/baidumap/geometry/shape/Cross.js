import Polyline from "./Polyline";
import {SHAPE_CROSS_TYPE} from "./Shape";

export default class Cross extends Polyline {
    constructor({type = SHAPE_CROSS_TYPE, x = 0, y = 0, size = 0}) {
        super({type});
        this._x = x;
        this._y = y;
        this._size = size;


        let halfSize = this.size / 2.0;

        let tl = [this.x - halfSize, this.y - halfSize];
        let br = [this.x + halfSize, this.y + halfSize];
        let tr = [this.x + halfSize, this.y - halfSize];
        let bl = [this.x - halfSize, this.y + halfSize];

        this._coordinates = [
            [tl, br],
            [tr, bl]
        ];
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

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    toJson(){
        return {
            type : this.type,
            x : this.x,
            y : this.y,
            size : this.size
        };
    }

}