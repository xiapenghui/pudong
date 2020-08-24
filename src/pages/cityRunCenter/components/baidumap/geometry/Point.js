import Geometry, {GEOMETRY_TYPE_POINT} from "./Geometry";
import {point} from "@turf/turf";
import RectShape from "./shape/Rect";

export default class Point extends Geometry {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends Geometry
     */
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_POINT,
            coordinates: []
        });

        let {coordinates = []} = props;

        let gf = point(coordinates);
        let geoJson = gf.geometry;
        this.type = geoJson.type;
        this.coordinates = geoJson.coordinates;
    }


    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {Point|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new Point({
            type: this.type,
            coordinates: fun(this.coordinates)
        });
    }

    get x(){
        return this._coordinates[0];
    }

    set x(value){
        this._coordinates[0] = parseFloat(value);
    }

    get y(){
        return this._coordinates[1];
    }

    set y(value){
        this._coordinates[1] = parseFloat(value);
    }
}

export function draw(context, coordinates, symbol) {
    let imageData = symbol._imageData;
    let width = imageData.width;
    let height = imageData.height;
    let halfWidth = width / 2.0;
    let halfHeight = height / 2.0;
    if(imageData){
        let dx = coordinates[0] - halfWidth + symbol.xoffset;
        let dy = coordinates[1] - halfHeight + symbol.yoffset;

        context.drawImage(imageData ,
            0,
            0,
            width ,
            height ,
            dx,
            dy,
            width ,
            height);

        return new RectShape({
            type : "rect",
            x : dx + halfWidth,
            y : dy + halfHeight,
            width : width ,
            height : height
        });
    }

    return [];
}