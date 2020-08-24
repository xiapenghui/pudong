import Feature from "./geometry/Feature";
import symbolFactory from "./symbol/factory";
import {NONE_SYMBOL} from "./symbol/SymbolEnum";
import {draw as drawGraphic} from "./geometry/factory";

import {IDFactory} from "./support/IDGen";
import {GEOMETRY_TYPE_MULTIPOINT, GEOMETRY_TYPE_POINT} from "./geometry/Geometry";

let idGen = IDFactory("_g_id_");

export function isGraphic(graphic){
    if(graphic instanceof Graphic){
        return true;
    }

    graphic = new Graphic(graphic);
    return !(null === graphic.feature && NONE_SYMBOL === graphic.symbol.type);
}

export default class Graphic {
    constructor(props) {
        let {
            feature = null,
            symbol = {type: NONE_SYMBOL}
        } = props;

        this.feature = feature;
        this.symbol = symbol;

        //初始化内部缓存信息，外部无需关注
        this._cache = new Map();
        this._updateWorld(null);
        this._updateClippedWorld(null);
        this._updateScreen(null);
        this._updateGroupedInfo(null);
    }

    get feature() {
        return this._feature;
    }

    set feature(f) {
        if(!f){
            this._feature = null;
            this.id = idGen.next();
            return;
        }

        if (f instanceof Feature) {
            this._feature = f;
        } else {
            this._feature = new Feature(f);
        }

        if (this.feature) {
            this.id = this.feature.id;
        }
    }

    get symbol() {
        return this._symbol;
    }

    set symbol(symbol) {
        if(!symbol){
            this._symbol = null;
            return;
        }

        if (symbol instanceof Symbol) {
            this._symbol = symbol;
        } else {
            this._symbol = symbolFactory(symbol);
        }
    }

    get id() {
        return this._id;
    }

    set id(value) {
        if (value) {
            this._id = value;
        } else {
            this._id = idGen.next();
        }


    }

    toJson() {
        return {
            id: this.id,
            feature: this.feature ? this.feature.toJson() : null,
            symbol: this.symbol ? this.symbol.toJson() : null
        };
    }

    hasProp(field) {
        if (!this.feature) {
            return false;
        }

        return this.feature.hasProp(field);
    }

    getIntPropVal(field, defaultVal) {
        if (this.feature) {
            return this.feature.getIntPropVal(field, defaultVal);
        }

        if (null === defaultVal || undefined === defaultVal) {
            return null;
        } else {
            return defaultVal;
        }
    }

    getFloatPropVal(field, defaultVal) {
        if (this.feature) {
            return this.feature.getFloatPropVal(field, defaultVal);
        }

        if (null === defaultVal || undefined === defaultVal) {
            return null;
        } else {
            return defaultVal;
        }
    }

    getStringPropVal(field, defaultVal) {
        if (this.feature) {
            return this.feature.getStringPropVal(field, defaultVal);
        }

        if (null === defaultVal || undefined === defaultVal) {
            return null;
        } else {
            return defaultVal;
        }
    }

    getPropVal(field, defaultVal) {
        if (this.feature) {
            return this.feature.getPropVal(field, defaultVal);
        }

        if (null === defaultVal || undefined === defaultVal) {
            return null;
        } else {
            return defaultVal;
        }
    }

    draw(context, symbol) {
        let f = this._cache.get("screen");
        if (!f) {
            return;
        }

        let drawResult = drawGraphic(context, f, symbol);
        let type = this.feature.geometry.type;
        if (GEOMETRY_TYPE_POINT === type) {
            this._cache.set("screenRegion", [drawResult]);
        } else if (GEOMETRY_TYPE_MULTIPOINT === type) {
            this._cache.set("screenRegion", drawResult);
        }
    }

    hit(x, y, tolerance) {
        if(!this._getEnableView()){
            return;
        }

        let screen = this._getScreen();
        if (!screen) {
            return false;
        }

        let shape = this._getShape();
        if (!shape) {
            return false;
        }

        if (shape instanceof Array) {
            for (let s of shape) {
                if (s.hit(x, y, tolerance)) {
                    return true;
                }
            }
        } else {
            return shape.hit(x, y, tolerance);
        }

        return false;

    }

    _updateWorld(feature) {
        this._cache.set("world", feature);
    }

    _updateZoomWorld(feature){
        this._cache.set("zoomWorld" , feature);
    }

    _updateClippedZoomWorld(feature){
        this._cache.set("zoomWorldClipped" , feature);
    }

    _updateClippedWorld(feature) {
        this._cache.set("clippedWorld", feature);
    }

    _updateScreen(feature) {
        this._cache.set("screen", feature);
    }

    _getWorld() {
        return this._cache.get("world");
    }

    _getZoomWorld(){
        return this._cache.get("zoomWorld");
    }

    _getClippedZoomWorld(){
        return this._cache.get("zoomWorldClipped");
    }


    _getClippedWorld() {
        return this._cache.get("clippedWorld");
    }

    _getScreen() {
        return this._cache.get("screen");
    }

    _updateEnableView(b){
        this._cache.set("enableView" , b);
    }

    _getEnableView(){
        return !!this._cache.get("enableView" );
    }

    _updateShape(shape) {
        this._cache.set("shape", shape);
    }

    _getShape() {
        return this._cache.get("shape");
    }

    _updateGroupedInfo(index) {
        this._cache.set("grouped", index);
    }

    _getGroupedInfo() {
        return this._cache.get("grouped");
    }

    _updateAnimalStartSize(size) {
        this._cache.set("animalStartSize", size);
    }

    _getAnimalStartSize() {
        return this._cache.get("animalStartSize");
    }

}