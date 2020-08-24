import Geometry, {GEOMETRY_TYPE_MULTIPOINT} from "./Geometry";
import {multiPoint} from "@turf/turf";
import RectShape from "./shape/Rect";

export default class MultiPoint extends Geometry {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends Geometry
     *
     */
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_MULTIPOINT,
            coordinates: []
        });

        let {coordinates = []} = props;

        let gf = multiPoint(coordinates);
        let geoJson = gf.geometry;
        this.type = geoJson.type;
        this.coordinates = geoJson.coordinates;
    }

    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {MultiPoint|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new MultiPoint({
            type: this.type,
            coordinates: this.coordinates.map((coordinate)=>{
                return fun(coordinate);
            })
        });
    }


}

export function draw(context, coordinates, symbol) {
    let imageData = symbol._imageData;
    let width = imageData.width;
    let height = imageData.height;
    let halfWidth = width / 2.0;
    let halfHeight = height / 2.0;
    if(imageData){
        return coordinates.map((coordinate)=>{
            let dx = coordinate[0] - halfWidth + symbol.xoffset;
            let dy = coordinate[1] - halfHeight + symbol.yoffset;

            context.drawImage(imageData ,
                0 ,
                0,
                width ,
                height ,
                dx,
                dy,
                width ,
                height);

            return new RectShape({
                x : dx + halfWidth,
                y : dy + halfHeight,
                width : width,
                height : height
            });
        });
    }

    return [];
}