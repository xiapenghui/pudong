import Symbol from "./Symbol";
import SimpleLineSymbol from "./SimpleLineSymbol";
import SimpleFillSymbol from "./SimpleFillSymbol";
import {
    NONE_SYMBOL,
    PICTURE_MARKER_SYMBOL,
    SIMPLE_FILL_SYMBOL,
    SIMPLE_LINE_SYMBOL,
    SIMPLE_MARKER_SYMBOL
} from "./SymbolEnum";
import SimpleMarkerSymbol from "./SimpleMarkerSymbol";
import PictureMarkerSymbol from "./PictureMarkerSymbol";

export default (props) => {
    if(!props){
        return new Symbol({type : NONE_SYMBOL})
    }

    if (!props.hasOwnProperty("type")) {
        return new Symbol(props);
    }

    let type = props.type ? props.type : "";

    if (type === SIMPLE_LINE_SYMBOL) {
        return new SimpleLineSymbol(props);
    }

    if (type === SIMPLE_FILL_SYMBOL) {
        return new SimpleFillSymbol(props);
    }

    if (type === SIMPLE_MARKER_SYMBOL) {
        return new SimpleMarkerSymbol(props);
    }

    if (type === PICTURE_MARKER_SYMBOL) {
        return new PictureMarkerSymbol(props);
    }

    return new Symbol(props);
}