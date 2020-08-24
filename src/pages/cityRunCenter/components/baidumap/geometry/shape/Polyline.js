import Shape, {SHAPE_POLYLINE_TYPE} from "./Shape";
import {point, multiLineString} from "@turf/turf";

export default class Polyline extends Shape {

    constructor({type = SHAPE_POLYLINE_TYPE, coordinates = []}) {
        super({type});
        this._coordinates = coordinates;
    }


    get coordinates() {
        return this._coordinates;
    }

    set coordinates(value) {
        this._coordinates = value;
    }

    getCoordinates() {
        return this.coordinates;
    }

    toJson() {
        return {
            type: this.type,
            coordinates: this.coordinates
        };
    }

    hit(x, y, tolerance) {
        return this.isPointOnLine(
            point([x, y]),
            multiLineString(this.getCoordinates()),
            tolerance
        );
    }

    draw(context, needFill, needStroke) {
        context.beginPath();
        this.getCoordinates().forEach((lineString) => {
            lineString.forEach((p, index) => {
                if (0 === index) {
                    context.moveTo(p[0], p[1]);
                } else {
                    context.lineTo(p[0], p[1]);
                }
            });
        });

        if (needStroke) {
            context.stroke();
        }
    }
}