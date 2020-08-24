import Transformer from "../support/Transformer";
import Bounds from "../geometry/Bounds"
import {GEOMETRY_TYPE_BOUNDS} from "../geometry/Geometry";


class Mate {

    /**
     * @constructor
     * @param props
     * @param {Number} props.width
     * @param {Number} props.height
     * @param {Number} props.xmin
     * @param {Number} props.xmax
     * @param {Number} props.ymin
     * @param {Number} props.ymax
     */
    constructor(props) {
        this.from(props);
    }

    size() {
        return {
            width: this.width,
            height: this.height
        }
    }

    bounds() {
        return this._bounds;
    }

    from(json) {
        let {
            width,
            height,
            xmin,
            ymin,
            xmax,
            ymax
        } = json;

        this.width = width;
        this.height = height;

        this._bounds = new Bounds({
            type: GEOMETRY_TYPE_BOUNDS,
            coordinates: [
                [xmin, ymin],
                [xmax, ymax]
            ]
        });
        let xstep = (this._bounds.xend() - this._bounds.xstart()) / this.width;
        let ystep = (this._bounds.yend() - this._bounds.ystart()) / this.height;

        this._transformer = new Transformer({
            xstart: this._bounds.xstart(),
            xstep: xstep,
            ystart: this._bounds.ystart(),
            ystep: ystep
        });
    }

    toOptions() {
        return {
            width: this.width,
            height: this.height,
            xmin: this.xmin,
            ymin: this.ymin,
            xmax: this.xmax,
            ymax: this.ymax
        };
    }

    get xmin() {
        return this._bounds.xmin;
    }

    set xmin(value) {
        this._bounds.xmin = value;
    }

    get ymin() {
        return this._bounds.ymin;
    }

    set ymin(value) {
        this._bounds.ymin = value;
    }

    get xmax() {
        return this._bounds.xmax;
    }

    set xmax(value) {
        this._bounds.xmax = value;
    }

    get ymax() {
        return this._bounds.ymax;
    }

    set ymax(value) {
        this._bounds.ymax = value;
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

    isEqual(mate) {
        return this.xmin === mate.xmin &&
            this.ymin === mate.ymin &&
            this.xmax === mate.xmax &&
            this.ymax === mate.ymax &&
            this.width === mate.width &&
            this.height === mate.height;
    }
}

export function mapZoomStep(map) {
    return Math.pow(2, map.getZoom() - 18);
}

export function matePropsFactory(map, expandSize = 0) {
    let size = map.getSize();
    size.width += 2 * expandSize;
    size.height += 2 * expandSize;

    let bounds = map.getBounds();
    let ne = bounds.getNorthEast();
    let sw = bounds.getSouthWest();

    let mapType = map.getMapType();
    let project = mapType.getProjection();

    let expandWorldSize = expandSize / mapZoomStep(map);

    let worldSW = project.lngLatToPoint(sw);
    worldSW.x -= expandWorldSize;
    worldSW.y -= expandWorldSize;

    let worldNE = project.lngLatToPoint(ne);
    worldNE.x += expandWorldSize;
    worldNE.y += expandWorldSize;

    let props = {
        width: size.width,
        height: size.height,
        xmin: worldSW.x,
        ymin: worldSW.y,
        xmax: worldNE.x,
        ymax: worldNE.y
    };

    return props;
}

export function mateFactory(map, expandSize = 0) {
    let props = matePropsFactory(map, expandSize);
    let mate = new Mate(props);
    mate.toScreen = function (x, y) {
        return map.pointToPixel(new BMap.Point(x, y));
    };
    mate.toGeo = function (x, y) {
        return map.pixelToPoint(new BMap.Pixel(x, y));
    };
    mate.toWorld = function (lng, lat) {
        return map.getMapType().getProjection().lngLatToPoint(new BMap.Point(lng, lat));
    };
    mate.toWgs84 = function (x, y) {
        return map.getMapType().getProjection().pointToLngLat(new BMap.Pixel(x, y));
    };
    mate.screenToWorld = function (x, y) {
        let p = this.toGeo(x, y);
        return this.toWorld(p.lng, p.lat);
    };
    mate.getFactor = function () {
        return mapZoomStep(map);
    };
    return mate;
}
