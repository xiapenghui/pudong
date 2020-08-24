import Polygon from "./Polygon";
import {SHAPE_RECT_TYPE} from "./Shape";

export default class Rect extends Polygon {
    constructor({type = SHAPE_RECT_TYPE, x = 0, y = 0, width = 0, height = 0}) {
        super({type});
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        let halfWidth = this.width / 2.0;
        let halfHeight = this.height / 2.0;

        let tl = [this.x - halfWidth, this.y - halfHeight];
        let bl = [this.x - halfWidth, this.y + halfHeight];
        let br = [this.x + halfWidth, this.y + halfHeight];
        let tr = [this.x + halfWidth, this.y - halfHeight];
        this._coordinates = [
            [
                tl,
                bl,
                br,
                tr,
                tl
            ]
        ]
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

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    toJson() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };

    }

}