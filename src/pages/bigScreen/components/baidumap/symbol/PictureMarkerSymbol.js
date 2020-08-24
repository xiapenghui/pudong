import {NONE_SYMBOL, PICTURE_MARKER_SYMBOL} from "./SymbolEnum";
import Symbol from "./Symbol";
import Console from "../support/Console";
import ResolveResponse from "../support/ResolveResponse";
import Graphic from "../Graphic";
import {GEOMETRY_TYPE_MULTIPOINT, GEOMETRY_TYPE_POINT , draw} from "../geometry/Geometry";
import {draw as drawGeometry } from "../geometry/factory";

export default class PictureMarkerSymbol extends Symbol {
    constructor(props) {
        super(props);
        this._cache.set("imageData", null);

        if (this.type === NONE_SYMBOL) {
            return;
        }

        this.fromJson(props);

        this._loadImage();
    }

    _loadImage() {
        if (!this.url) {
            this._loadImageDataPromise = new Promise((resolve, reject) => {
                reject(new Error("url is empty"));
            });
            return;
        }

        this._loadImageDataPromise = new Promise((resolve, reject) => {
            let imageDom = document.createElement("img");
            if (this.width) {
                imageDom.width = this.width;
            }
            if (this.height) {
                imageDom.height = this.height;
            }
            imageDom.onload = () => {
                this._imageData = imageDom;
                Console.debug("load image data success");
                resolve(new ResolveResponse({message: "load image data success ", data: this._imageData}));
            };
            imageDom.onerror = (error) => {
                this._imageData = null;
                Console.debug("load image data error");
                reject(error);
            };
            imageDom.src = this.url;
        });
    }

    toJson() {
        return Object.assign({},
            super.toJson(),
            {
                angle: this.angle,
                height: this.height,
                width: this.width,
                url: this.url,
                xoffset: this.xoffset,
                yoffset: this.yoffset
            });
    }

    fromJson(json) {
        super.fromJson(json);

        if (this.type === NONE_SYMBOL) {
            return;
        }

        let {
            type = PICTURE_MARKER_SYMBOL,
            angle = 0,
            height = 0,
            width = 0,
            url = "",
            xoffset = 0,
            yoffset = 0
        } = json;
        this.angle = angle;
        this.height = height;
        this.width = width;
        this.url = url;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get xoffset() {
        return this._xoffset;
    }

    set xoffset(value) {
        if (null === value ||
            undefined === value ||
            Number.isNaN(value)
        ) {
            this._xoffset = 0;
            return;
        }

        this._xoffset = value;
    }

    get yoffset() {
        return this._yoffset;
    }

    set yoffset(value) {
        if (null === value ||
            undefined === value ||
            Number.isNaN(value)
        ) {
            this._yoffset = 0;
            return;
        }

        this._yoffset = value;
    }

    styleContext() {
        return this._loadImageDataPromise;
    }

    _draw(context, graphic) {
        let feature = graphic.feature;
        if(!feature){
            graphic._updateShape(null);
            return;
        }

        let geometry = feature.geometry;
        if (!geometry ||
            !geometry.type ||
            (GEOMETRY_TYPE_POINT !== geometry.type &&
                GEOMETRY_TYPE_MULTIPOINT !== geometry.type)) {
            graphic._updateShape(null);
            return;
        }

        if(!graphic._getEnableView()){
            graphic._updateShape(null);
            return;
        }

        let screen = graphic._getScreen();
        if(!screen){
            graphic._updateShape(null);
            return;
        }

        let shape = drawGeometry(context , screen , this);
        graphic._updateShape(shape);

        // Console.debug("graphic" , graphic.id , "draw");
    }

    draw(context, graphics) {
        if(!context || !graphics){
            return new Promise(resolve => resolve(new ResolveResponse({message : "draw success"})))
        }

        if (graphics instanceof Graphic) {
            return this.styleContext(context)
                .then(() => {
                    this._draw(context, graphics);

                    return new ResolveResponse({message: "draw success"});
                })
        } else if (graphics instanceof Array) {
            return this.styleContext(context)
                .then(() => {
                    graphics.forEach((graphic) => {
                        this._draw(context, graphic);
                    });

                    return new ResolveResponse({message: "draw success"});
                })
        }

        return new Promise(function (resolve, reject) {
            reject(new Error("error graphics param"));
        })
    }
}