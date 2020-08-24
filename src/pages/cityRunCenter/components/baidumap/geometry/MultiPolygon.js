import Geometry, {GEOMETRY_TYPE_MULTIPOLYGON} from "./Geometry";
import {multiPolygon} from "@turf/turf";
import MultiPolygonShape from "./shape/MultiPolygon";

export default class MultiPolygon extends Geometry {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends Geometry
     */
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_MULTIPOLYGON,
            coordinates: []
        });

        let {coordinates = []} = props;

        let gf = multiPolygon(coordinates);
        let geoJson = gf.geometry;
        this.type = geoJson.type;
        this.coordinates = geoJson.coordinates;
    }

    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {MultiPolygon|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new MultiPolygon({
            type: this.type,
            coordinates: this.coordinates.map((polygon) => {
                return polygon.map((ring) => {
                    return ring.map((coordinate) => {
                        return fun(coordinate);
                    })
                })
            })
        });
    }

    ringsMap(fun){
        let polygon = this.coordinates.map((polygon)=>{
            return polygon.map((ring)=>{
                return fun(ring);
            }).filter((ring)=>{
                return ring && ring.length && ring.length >= 3;
            });
        }).filter((polygon)=>{
            return polygon && polygon.length && polygon.length > 0;
        });

        return new MultiPolygon({
            type : this.type,
            coordinates : polygon
        });
    }
}


export function draw(context, coordinates, symbol) {
    coordinates.forEach((polygon) => {
        context.beginPath();
        polygon.forEach((lineString) => {
            lineString.forEach((coordinate, index) => {
                if (0 === index) {
                    context.moveTo(coordinate[0], coordinate[1]);
                } else {
                    context.lineTo(coordinate[0], coordinate[1]);
                }
            });
            context.closePath();
        });
    });

    return new MultiPolygonShape({coordinates:coordinates});
}