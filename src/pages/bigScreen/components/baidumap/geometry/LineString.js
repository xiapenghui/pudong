import Geometry, {GEOMETRY_TYPE_LINESTRING} from "./Geometry";
import {lineString} from "@turf/turf";
import LineShape from "./shape/Line";

export default class LineString extends Geometry {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends Geometry
     */
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_LINESTRING,
            coordinates: []
        });

        let {coordinates = []} = props;

        let gf = lineString(coordinates);
        let geoJson = gf.geometry;
        this.type = geoJson.type;
        this.coordinates = geoJson.coordinates;
    }

    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {LineString|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new LineString({
            type: this.type,
            coordinates: this.coordinates.map((coordinate) => {
                return fun(coordinate);
            })
        });
    }

    pathsMap(fun){
        let path = fun(this.coordinates);
        if(!path || path.length < 2){
            return new LineString({
                type : this.type,
                coordinates : []
            });
        }

        return new LineString({
            type : this.type,
            coordinates : path
        });
    }
}

export function draw( context , coordinates , symbol ){
    coordinates.forEach((coordinate , index)=>{
        if(0 === index){
            context.moveTo(coordinate[0] , coordinate[1]);
        }else{
            context.lineTo(coordinate[0] , coordinate[1]);
        }
    });

    return new LineShape({coordinates : coordinates});
}