import Symbol from "./Symbol";
import {COLOR_TRANSPARENT, NONE_SYMBOL, SIMPLE_LINE_SYMBOL} from "./SymbolEnum";
import chroma from "chroma-js";
import Console from "../support/Console";
import ResolveResponse from "../support/ResolveResponse";
import Graphic from "../Graphic";
import {GEOMETRY_TYPE_LINESTRING, GEOMETRY_TYPE_MULTILINESTRING} from "../geometry/Geometry";
import {draw as drawGeometry} from "../geometry/factory";
import {validateNum} from "../utils/Utils";

export const CAP_BUTT = "butt";
export const CAP_ROUND = "round";
export const CAP_SQUARE = "square";

const validateCap = (val) => {
    return val &&
        (val === CAP_BUTT ||
            val === CAP_ROUND ||
            val === CAP_SQUARE);
};

export const JOIN_BEVEL = "bevel";
export const JOIN_ROUND = "round";
export const JOIN_MITER = "miter";

const validateJoin = (val) => {
    return val &&
        (val === JOIN_BEVEL ||
            val === JOIN_ROUND ||
            val === JOIN_MITER);
};

const validateMiterLimit = (val) => {
    return validateNum(val);
};

export const STYLE_SOLID = "solid";
export const STYLE_DASH = "dash";
export const STYLE_DASH_DOT = "dash-dot";
export const STYLE_DOT = "dot";
export const STYLE_LONG_DASH = "long-dash";
export const STYLE_LONG_DASH_DOT = "long-dash-dot";
export const STYLE_LONG_DASH_DOT_DOT = "long-dash-dot-dot";
export const STYLE_NONE = "none";
export const STYLE_SHORT_DASH = "short-dash";
export const STYLE_SHORT_DASH_DOT = "short-dash-dot";
export const STYLE_SHORT_DASH_DOT_DOT = "short-dash-dot-dot";
export const STYLE_SHORT_DOT = "short-dot";

const validateStyle = (val) => {
    return val &&
        (
            val === STYLE_NONE ||
            val === STYLE_SOLID ||
            val === STYLE_DASH ||
            val === STYLE_DOT ||
            val === STYLE_DASH_DOT ||
            val === STYLE_LONG_DASH ||
            val === STYLE_LONG_DASH_DOT ||
            val === STYLE_LONG_DASH_DOT_DOT ||
            val === STYLE_SHORT_DASH ||
            val === STYLE_SHORT_DASH_DOT ||
            val === STYLE_SHORT_DASH_DOT_DOT ||
            val === STYLE_SHORT_DOT
        );
};

const style2LineDash = (val , width)=>{
    if(!validateStyle(val)){
        return [];
    }

    if(!validateNum(width)){
        width = 2;
    }

    let space = width * 2.5;
    let dash = width * 4;
    let longDash = width * 7;
    let dot = width;
    let shortSpace = width * 1.5;
    if(val === STYLE_NONE){
        return [];
    }

    if(val === STYLE_SOLID){
        return [];
    }

    if(val === STYLE_DASH){
        return [dash , space];
    }

    if(val === STYLE_DOT){
        return [dot , space];
    }

    if(val === STYLE_DASH_DOT){
        return [dash , space , dot , space];
    }

    if(val === STYLE_LONG_DASH){
        return [longDash , space ];
    }

    if(val === STYLE_LONG_DASH_DOT){
        return [longDash , space , dot , space]
    }

    if(val === STYLE_LONG_DASH_DOT_DOT){
        return [longDash , space , dot , space , dot , space];
    }

    if(val === STYLE_SHORT_DASH){
        return [dash,shortSpace];
    }

    if(val === STYLE_SHORT_DASH_DOT){
        return [dash,shortSpace,dot,shortSpace];
    }

    if(val === STYLE_SHORT_DASH_DOT_DOT){
        return [dash,shortSpace,dot,shortSpace,dot,shortSpace];
    }

    if(val === STYLE_SHORT_DOT){
        return [dot,shortSpace];
    }

    return [];
}

export default class SimpleLineSymbol extends Symbol {

    constructor(props) {
        super(props);
        if (this.type === NONE_SYMBOL) {
            return;
        }

        // let {
        //     type = SIMPLE_LINE_SYMBOL,
        //     color = COLOR_TRANSPARENT,
        //     width = 1,
        //     style = "solid",
        //     cap = "butt",
        //     join = "miter", miterLimit = 10
        // } = props;
        // this.color = color;
        // this.width = width;
        // this.style = style;
        // this.cap = cap;
        // this.join = join;
        // this.miterLimit = miterLimit;
        this.fromJson(props);
    }


    toJson() {
        return Object.assign({},
            super.toJson(),
            {
                color: chroma(this.color).rgba(),
                width: this.width,
                style: this.style,
                cap: this.cap,
                join: this.join,
                miterLimit: this.miterLimit
            });
    }

    fromJson(json) {
        super.fromJson(json);

        if (this.type === NONE_SYMBOL) {
            return;
        }

        let {
            type = SIMPLE_LINE_SYMBOL,
            color = COLOR_TRANSPARENT,
            width = 1,
            style = STYLE_SOLID,
            cap = CAP_BUTT,
            join = JOIN_MITER,
            miterLimit = 0.75
        } = json;

        this.type = type;
        this.color = color;
        this.width = width;
        this.style = style;
        this.cap = cap;
        this.join = join;
        this.miterLimit = miterLimit;
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

    get width() {
        return this._width;
    }

    set width(value) {
        value = parseInt(value);
        if (Number.isNaN(value) || !Number.isFinite(value)) {
            value = 1;
        }

        this._width = value;
    }

    get style() {
        return this._style ? this._style : STYLE_NONE;
    }

    set style(value) {
        if(validateStyle(value)) {
            this._style = value;
        }else{
            this._style = STYLE_NONE;
        }
    }


    get cap() {
        return this._cap ? this._cap : CAP_BUTT;
    }

    set cap(value) {
        if (validateCap(value)) {
            this._cap = value;
        } else {
            this._cap = CAP_BUTT;
        }
    }

    get join() {
        return this._join ? this._join : JOIN_MITER;
    }

    set join(value) {
        if (validateJoin(value)) {
            this._join = value;
        } else {
            this._join = JOIN_MITER;
        }
    }

    get miterLimit() {
        return this._miterLimit ? this._miterLimit : 0.75;
    }

    set miterLimit(value) {
        if (validateMiterLimit(value)) {
            this._miterLimit = value;
        } else {
            this._miterLimit = 0.75;
        }
    }

    _styleContext(context){
        if(this.style !== STYLE_NONE){
            context.strokeStyle = this.color;
            context.lineWidth = this.width;
            let lineDash = style2LineDash(this.style , this.width);
            Console.debug(lineDash);
            context.setLineDash(lineDash);
            context.lineCap = this.cap;
            context.lineJoin = this.join;
            context.miterLimit = this.miterLimit;
        }
    }

    // styleContext(context) {
    //     return new Promise((resolve, reject) => {
    //         this._styleContext(context);
    //         resolve(new ResolveResponse({message: "style poly"}));
    //     });
    // }

    _draw(context, graphic) {
        let feature = graphic.feature;
        if (!feature) {
            graphic._updateShape(null);
            return;
        }

        let geometry = feature.geometry;
        if (!geometry ||
            !geometry.type ||
            (GEOMETRY_TYPE_LINESTRING !== geometry.type &&
                GEOMETRY_TYPE_MULTILINESTRING !== geometry.type)) {
            graphic._updateShape(null);
            return;
        }

        if (!graphic._getEnableView()) {
            graphic._updateShape(null);
            return;
        }

        //屏幕图形是否存在
        let screen = graphic._getScreen();
        if (!screen) {
            graphic._updateShape(null);
            return;
        }

        let shape = drawGeometry(context, screen, this);
        graphic._updateShape(shape);
    }

    draw(context, graphics) {
        if (!context || !graphics) {
            return new Promise(resolve => resolve(new ResolveResponse({message: "draw success"})))
        }

        if (graphics instanceof Graphic) {
            return new Promise((resolve,reject)=>{
                this._styleContext(context);
                if(this.style !== STYLE_NONE){
                    context.beginPath();
                    this._draw(context, graphics);
                    context.stroke();
                }

                resolve(new ResolveResponse({message: "draw success"}));
            });
        } else if (graphics instanceof Array) {
            return new Promise((resolve,reject)=>{
                this._styleContext(context);
                if(this.style !== STYLE_NONE){
                    context.beginPath();
                    graphics.forEach((graphic) => {
                        this._draw(context, graphic);
                    });
                    context.stroke();
                }

                resolve(new ResolveResponse({message: "draw success"}));
            });
        }

        return new Promise(function (resolve, reject) {
            reject(new Error("error graphics param"));
        });
    }

}