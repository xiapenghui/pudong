import Geometry, {GEOMETRY_TYPE_MULTILINESTRING} from "./Geometry";
import {multiLineString} from "@turf/turf";
import PolylineShape from "./shape/Polyline";

export default class MultiLineString extends Geometry {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends Geometry
     */
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_MULTILINESTRING,
            coordinates: []
        });

        let {coordinates = []} = props;

        let gf = multiLineString(coordinates);
        let geoJson = gf.geometry;
        this.type = geoJson.type;
        this.coordinates = geoJson.coordinates;
    }

    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {MultiLineString|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new MultiLineString({
            type: this.type,
            coordinates: this.coordinates.map((lineString) => {
                return lineString.map((coordinate) => {
                    return fun(coordinate);
                })
            })
        });
    }

    pathsMap(fun){
        let paths = this.coordinates.map((path)=>{
            return fun(path);
        }).filter((path)=>{
            return path && path.length && path.length >= 2;
        });

        return new MultiLineString({
            type : this.type,
            coordinates : paths
        });
    }
}

export function draw(context, coordinates, symbol) {
    coordinates.forEach((lineString) => {
        lineString.forEach((coordinate, index) => {
            if (0 === index) {
                context.moveTo(coordinate[0], coordinate[1]);
            } else {
                context.lineTo(coordinate[0], coordinate[1]);
            }
        });
    });

    return new PolylineShape({coordinates : coordinates});
}