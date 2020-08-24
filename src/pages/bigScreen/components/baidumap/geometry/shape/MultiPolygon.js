import Shape, {SHAPE_MULTIPOLYGON_TYPE} from "./Shape";
import {point, multiPolygon} from "@turf/turf";

export default class MultiPolygon extends Shape {
    constructor({type = SHAPE_MULTIPOLYGON_TYPE, coordinates = []}) {
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
        return this.isPointInPolygon(
            point([x, y]),
            multiPolygon(this.getCoordinates()),
            tolerance);
    }

    draw(context , needFill , needStroke){
        context.beginPath();
        this.getCoordinates().forEach((polygon) => {
            context.beginPath();
            polygon.forEach((lineString) => {
                lineString.forEach((p, index) => {
                    if (0 === index) {
                        context.moveTo(p[0], p[1]);
                    } else {
                        context.lineTo(p[0], p[1]);
                    }
                });
                context.closePath();
            });
        });

        if(needFill){
            context.fill();
        }

        if(needStroke){
            context.stroke();
        }
    }
}