import {COLOR_TRANSPARENT, NONE_SYMBOL} from "../symbol/SymbolEnum";
import SimpleRenderer from "./SimpleRenderer";
import {GEOMETRY_TYPE_POINT} from "../geometry/Geometry";
import shapeFactory from "../geometry/shape/factory";
import {SHAPE_CIRCLE_TYPE} from "../geometry/shape/Shape";
import chroma from "chroma-js";
import ResolveResponse from "../support/ResolveResponse";

const FRAME_SPEED = 16;
const TRANSPARENT_CSS = chroma(COLOR_TRANSPARENT).css();

export default class RippleMarkerRenderer extends SimpleRenderer {
    constructor(props) {
        super(props);

        let {
            symbol = {type: NONE_SYMBOL},
            color = null,
            fromSize = 0,
            toSize = 0,
            speed = 0.5
        } = props;

        this.symbol = symbol;
        this.color = color;
        this.fromSize = fromSize;
        this.toSize = toSize;
        this.speed = speed;
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

    get fromSize() {
        return this._fromSize;
    }

    set fromSize(value) {
        this._fromSize = value;
    }


    get toSize() {
        return this._toSize;
    }

    set toSize(value) {
        this._toSize = value;
    }


    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }


    _canDrawAnimal() {
        return (this.color !== TRANSPARENT_CSS &&
            this.fromSize !== this.toSize) &&
            this.speed
    }

    _drawAnimal(context, graphic) {
        let size = graphic._getAnimalStartSize();
        if (!size) {
            size = this.fromSize;
        } else {
            size += this.speed;
            if (size >= this.toSize) {
                size = this.fromSize;
            }
        }
        graphic._updateAnimalStartSize(size);

        let clipped = graphic._getClippedWorld();
        if(!clipped){
            return;
        }

        let shape = graphic._getShape();
        if (!(shape instanceof Array)) {
            shape = [shape];
        }

        shape.forEach((s) => {
            let x = s.x;
            let y = s.y;

            let newShape = shapeFactory({
                type : SHAPE_CIRCLE_TYPE,
                x : x,
                y : y,
                radius : size
            });
            newShape.draw(context, false, true);
        })
    }

    _drawSelfRendererGroupItem(context, symbol, graphic) {
        let promise = symbol.draw(context, graphic);
        if(!this._canDrawAnimal()){
            return promise;
        }

        return promise.then(()=>{
            context.save();

            context.strokeStyle = this.color;
            if (graphic.feature.geometry.type === GEOMETRY_TYPE_POINT) {
                this._drawAnimal(context, graphic);
            }

            context.restore();

            return new ResolveResponse({message : "draw animal success"});
        });
    }

    _drawCachedRendererGroupItems(context, symbol, graphics) {
        let promise = symbol.draw(context, graphics);
        if(!this._canDrawAnimal()){
            return promise;
        }

        return promise.then(()=>{
            context.save();

            context.strokeStyle = this.color;
            graphics.forEach((graphic) => {
                if (graphic.feature.geometry.type === GEOMETRY_TYPE_POINT) {
                    this._drawAnimal(context, graphic);
                }
            });

            context.restore();

            return new ResolveResponse({message : "draw animal success"});
        });
    }

    clear(context){
        let prev = context.globalCompositeOperation;
        context.fillStyle = "rgba(0,0,0,0.95)";
        context.globalCompositeOperation = "destination-in";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalCompositeOperation = prev;
    }

    hasAnimal() {
        return true;
    }

    // draw(context, graphics) {
    //     return super.draw(context, graphics);
    // }
}