import {COLOR_TRANSPARENT, NONE_SYMBOL,SIMPLE_MARKER_SYMBOL} from "./SymbolEnum";
import chroma from "chroma-js";
import ResolveResponse from "../support/ResolveResponse";

const SIMPLE_MARKER_CIRCLE_STYLE = "circle";
const SIMPLE_MARKER_CROSS_STYLE = "cross";
const SIMPLE_MARKER_DIAMOND_STYLE = "diamond";
const SIMPLE_MARKER_SQUARE_STYLE = "square";
const SIMPLE_MARKER_TRIANGLE_STYLE = "triangle";
const SIMPLE_MARKER_X_STYLE = "x";

export default class SimpleMarkerSymbol extends Symbol {

    constructor(props) {
        super(props);
        this._cache = new Map();

        if (this.type === NONE_SYMBOL) {
            return;
        }

        let {
            type,
            color,
            angle,
            size,
            xoffset,
            yoffset,
            style,
            outline
        } = props;

        this.color = color;
        this.angle = angle;
        this.size = size;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.style = style;
        this.outline = outline;

    }


    get color() {
        return this._color;
    }

    set color(value) {
        if (chroma.valid(value)) {
            this._color = chroma(value).css();
        } else {
            this._color = chroma(COLOR_TRANSPARENT).css();
        }
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get xoffset() {
        return this._xoffset;
    }

    set xoffset(value) {
        this._xoffset = value;
    }

    get yoffset() {
        return this._yoffset;
    }

    set yoffset(value) {
        this._yoffset = value;
    }

    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
    }

    get outline() {
        return this._outline;
    }

    set outline(value) {
        this._outline = value;
    }

    styleContext(context){
        return new Promise(function(resolve,reject){
            resolve(new ResolveResponse({message : "default style context"}));
        })
    }

    draw(context , graphics){
        return new Promise(function(resolve,reject){
            resolve(new ResolveResponse({message : "default render styleContext"}));
        })
    }
}