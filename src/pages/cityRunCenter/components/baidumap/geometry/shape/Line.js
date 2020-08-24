import Shape, {SHAPE_LINE_TYPE} from "./Shape";
import {point, lineString} from "@turf/turf";

export default class Line extends Shape {
    constructor({type = SHAPE_LINE_TYPE, coordinates = []}) {
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
            lineString(this.getCoordinates()),
            tolerance
        );
    }

    draw(context , needFill , needStroke){
        context.beginPath();
        this.getCoordinates().forEach((p , index)=>{
            if(0 === index){
                context.moveTo(p[0] , p[1]);
            }else{
                context.lineTo(p[0] , p[1]);
            }
        });

        if(needStroke){
            context.stroke();
        }
    }

}