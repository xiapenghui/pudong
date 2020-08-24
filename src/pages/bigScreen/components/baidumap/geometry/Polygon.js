import Geometry, {GEOMETRY_TYPE_POLYGON} from "./Geometry";
import {polygon} from "@turf/turf";
import PolygonShape from "./shape/Polygon";

export default class Polygon extends Geometry {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends Geometry
     */
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_POLYGON,
            coordinates:[]
        });

        let {coordinates = []} = props;

        let gf = polygon(coordinates);
        let geoJson = gf.geometry;
        this.type = geoJson.type;
        this.coordinates = geoJson.coordinates;
    }


    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {Polygon|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new Polygon({
            type: this.type,
            coordinates: this.coordinates.map((ring) => {
                return ring.map((coordinate) => {
                    return fun(coordinate);
                });
            })
        });
    }

    ringsMap(fun){
        let rings = this.coordinates.map((ring)=>{
            return fun(ring);
        }).filter((ring)=>{
            return ring && ring.length && ring.length >= 3;
        });

        return new Polygon({
            type : this.type,
            coordinates : rings
        });
    }

}


export function draw(context, coordinates, symbol) {
    context.beginPath();
    coordinates.forEach((lineString) => {
        lineString.forEach((coordinate, index) => {
            if (0 === index) {
                context.moveTo(coordinate[0], coordinate[1]);
            } else{
                context.lineTo(coordinate[0], coordinate[1]);
            }
        });
        context.closePath();
    });

    return new PolygonShape({coordinates : coordinates});
}