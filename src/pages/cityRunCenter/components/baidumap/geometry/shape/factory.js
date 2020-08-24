import Shape, {
    SHAPE_CIRCLE_TYPE,
    SHAPE_CROSS_TYPE,
    SHAPE_LINE_TYPE,
    SHAPE_MULTIPOLYGON_TYPE, SHAPE_POLYGON_TYPE, SHAPE_POLYLINE_TYPE, SHAPE_RECT_TYPE,
    SHAPE_SHAPE_TYPE, SHAPE_TRIANGLE_TYPE
} from "./Shape";
import Circle from "./Circle";
import Cross from "./Cross";
import Line from "./Line";
import MultiPolygon from "./MultiPolygon";
import Polygon from "./Polygon";
import Polyline from "./Polyline";
import Rect from "./Rect";
import Triangle from "./Triangle";

export default (props)=>{
    let {type = SHAPE_SHAPE_TYPE} = props;

    if(SHAPE_SHAPE_TYPE === type){
        return new Shape(props);
    }

    if(SHAPE_CIRCLE_TYPE === type){
        return new Circle(props);
    }

    if(SHAPE_CROSS_TYPE === type){
        return new Cross(props);
    }

    if(SHAPE_LINE_TYPE === type){
        return new Line(props);
    }

    if(SHAPE_MULTIPOLYGON_TYPE === type){
        return new MultiPolygon(props);
    }

    if(SHAPE_POLYGON_TYPE === type){
        return new Polygon(props);
    }

    if(SHAPE_POLYLINE_TYPE === type){
        return new Polyline(props);
    }

    if(SHAPE_RECT_TYPE === type){
        return new Rect(props);
    }

    if(SHAPE_TRIANGLE_TYPE === type){
        return new Triangle(props);
    }

    return new Shape({type : SHAPE_SHAPE_TYPE});
}