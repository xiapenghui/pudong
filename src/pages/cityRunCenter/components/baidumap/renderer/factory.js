import {
    CLASS_BREAKS_RENDERER,
    HEATMAP_RENDERER,
    RIPPLE_MARKER_RENDERER,
    SIMPLE_RENDERER,
    UNIQUE_VALUE_RENDERER
} from "./Renderer";
import Renderer from "./Renderer";
import SimpleRenderer from "./SimpleRenderer";
import UniqueValueRenderer from "./UniqueValueRenderer";
import ClassBreaksRenderer from "./ClassBreaksRenderer";
import HeatMapRenderer from "./HeatMapRenderer";
import RippleMarkerRenderer from "./RippleMarkerRenderer";

export default (props)=>{
    let {type} = props;

    if(!type){
        return new Renderer(props);
    }

    if(type === SIMPLE_RENDERER){
        return new SimpleRenderer(props);
    }

    if(type === UNIQUE_VALUE_RENDERER){
        return new UniqueValueRenderer(props);
    }

    if(type === CLASS_BREAKS_RENDERER){
        return new ClassBreaksRenderer(props);
    }

    if(type === HEATMAP_RENDERER){
        return new HeatMapRenderer(props);
    }

    if(type === RIPPLE_MARKER_RENDERER){
        return new RippleMarkerRenderer(props);
    }

    return new Renderer(props);
}