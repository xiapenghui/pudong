import ResolveResponse from "../../support/ResolveResponse";
import {booleanPointInPolygon, nearestPointOnLine, polygonToLine} from "@turf/turf";

export const SHAPE_SHAPE_TYPE = "shape";
export const SHAPE_CIRCLE_TYPE = "circle";
export const SHAPE_CROSS_TYPE = "cross";
export const SHAPE_LINE_TYPE = "line";
export const SHAPE_MULTIPOLYGON_TYPE = "multiPolygon";
export const SHAPE_POLYGON_TYPE = "polygon";
export const SHAPE_POLYLINE_TYPE = "polyline";
export const SHAPE_RECT_TYPE = "rect";
export const SHAPE_TRIANGLE_TYPE = "triangle";

export default class Shape {
    constructor({type = SHAPE_SHAPE_TYPE}) {
        this._type = type;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    getCoordinates() {
        return [];
    }

    hit(x, y,tolerance) {
        return false;
    }

    toJson(){
        return {
            type : this.type
        };
    }

    coordinatesDeep(coordinates) {
        let arr = coordinates;
        let deep = 0;
        while (undefined !== arr && null !== arr && Array.isArray(arr)) {
            deep++;

            if (arr.length > 0) {
                arr = arr[0];
            } else {
                arr = null;
            }
        }

        return deep;
    }

    isPointOnLine(point , line , tolerance){
        let snapped = nearestPointOnLine(
            line,
            point,
            {units: "miles"}
        );
        let xnearest = snapped.geometry.coordinates[0];
        let ynearest = snapped.geometry.coordinates[1];

        let x = point.geometry.coordinates[0];
        let y = point.geometry.coordinates[1];

        let xdelta = x - xnearest;
        let ydelta = y - ynearest;

        return (xdelta * xdelta + ydelta * ydelta) <= tolerance * tolerance;
    }

    isPointInPolygon(point , polygon , tolerance){
        if(booleanPointInPolygon(point , polygon)){
            return true;
        }

        return this.isPointOnLine(point , polygonToLine(polygon) , tolerance);
    }



    style(context, graphics) {
        return new Promise(resolve => resolve(new ResolveResponse({message: "default shape style"})))
    }

    draw(context , needFill , needStoke ){
        return new Promise(resolve => resolve(new ResolveResponse({message : "default shape draw"})));
    }
}