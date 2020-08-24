import Symbol from "./Symbol";
import {COLOR_TRANSPARENT, NONE_SYMBOL, SIMPLE_FILL_SYMBOL} from "./SymbolEnum";
import chroma from "chroma-js";
import Console from "../support/Console";
import SymbolFactory from "./factory";
import SimpleLineSymbol from "./SimpleLineSymbol";
import ResolveResponse from "../support/ResolveResponse";
import Graphic from "../Graphic";
import {GEOMETRY_TYPE_MULTIPOLYGON, GEOMETRY_TYPE_POLYGON} from "../geometry/Geometry";
import {draw as drawGeometry} from "../geometry/factory";


export default class SimpleFillSymbol extends Symbol {

    constructor(props) {
        super(props);
        if (this.type === NONE_SYMBOL) {
            return;
        }

        this.fromJson(props);
    }


    toJson() {
        return Object.assign({},
            super.toJson(),
            {
                color: chroma(this.color).rgba(),
                style: this.style,
                outline: this.outline ? this.outline.toJson() : null
            });
    }

    fromJson(json) {
        super.fromJson(json);

        if (this.type === NONE_SYMBOL) {
            return;
        }

        let {
            type = SIMPLE_FILL_SYMBOL,
            color = null,
            style = "solid",
            outline = null
        } = json;
        this.color = color;
        this.outline = outline;
        this.style = style;
    }

    get style() {
        return this._style ? this._style : null;
    }

    set style(value) {
        Console.warn("style options effect hat not implement");
        this._style = value;
    }

    get color() {
        return this._color ? this._color : null;
    }

    set color(value) {
        if (chroma.valid(value)) {
            this._color = chroma(value).css();
        } else {
            this._color = chroma(COLOR_TRANSPARENT).css();
        }
    }

    get outline() {
        return this._outline ? this._outline : null;
    }

    set outline(value) {
        this._outline = SymbolFactory(value);
    }

    // styleContext(context) {
    //     context.fillStyle = this.color;
    //     let outline = null;
    //     if (this.outline) {
    //         outline = this.outline;
    //     } else {
    //         outline = new SimpleLineSymbol({
    //             type: "simpleLine",
    //             color: this.color,
    //             width: 1,
    //             style: "solid",
    //             cap: "butt",
    //             join: "miter",
    //             miterLimit: 10
    //         });
    //     }
    //
    //     return outline.styleContext(context);
    // }

    _styleContext(context){
        context.fillStyle = this.color;
        let outline = null;
        if (this.outline) {
            outline = this.outline;
        } else {
            outline = new SimpleLineSymbol({
                type: "simpleLine",
                color: this.color,
                width: 1,
                style: "solid",
                cap: "butt",
                join: "miter",
                miterLimit: 10
            });
        }

        outline._styleContext(context);
    }

    _draw(context, graphic) {
        //Feature对象是否存在
        let feature = graphic.feature;
        if(!feature){
            graphic._updateShape(null);
            return;
        }

        //Geometry对象是否为面状图形
        let geometry = feature.geometry;
        if (!geometry ||
            !geometry.type ||
            (GEOMETRY_TYPE_POLYGON !== geometry.type &&
                GEOMETRY_TYPE_MULTIPOLYGON !== geometry.type)) {
            graphic._updateShape(null);
            return;
        }

        if(!graphic._getEnableView()){
            graphic._updateShape(null);
            return;
        }

        //屏幕图形是否存在
        let screen = graphic._getScreen();
        if(!screen){
            graphic._updateShape(null);
            return;
        }

        //绘制屏幕范围
        let shape = drawGeometry(context, screen, this);
        graphic._updateShape(shape);

        context.fill();
        context.stroke();

        // Console.debug("graphic" , graphic.id , "draw");
    }

    draw(context, graphics) {
        if(!context || !graphics){
            return new Promise(resolve => resolve(new ResolveResponse({message : "draw success"})))
        }

        if (graphics instanceof Graphic) {
            return new Promise((resolve,reject)=>{
                this._styleContext(context);
                this._draw(context, graphics);

                resolve(new ResolveResponse({message: "draw success"}));
            });
        } else if (graphics instanceof Array) {
            return new Promise((resolve) => {
               this._styleContext(context);
                graphics.forEach((graphic) => {
                    this._draw(context, graphic);
                });
                resolve(new ResolveResponse({message: "draw success"}));
            });
        }

        return new Promise(function (resolve, reject) {
            reject(new Error("error graphics param"));
        })
    }

}