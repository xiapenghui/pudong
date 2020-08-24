export const NONE_SYMBOL = "none";
export const SIMPLE_LINE_SYMBOL = "simpleLine";
export const SIMPLE_FILL_SYMBOL = "simpleFill";
export const SIMPLE_MARKER_SYMBOL = "simpleMarker";
export const PICTURE_MARKER_SYMBOL = "pictureMarker";

export const COLOR_TRANSPARENT = [0,0,0,0];

export function validateSymbolType(type){
    if(!type){
        return false;
    }

    if(type === NONE_SYMBOL){
        return true;
    }

    if(type === SIMPLE_FILL_SYMBOL){
        return true;
    }

    if(type === SIMPLE_LINE_SYMBOL){
        return true;
    }

    if(type === SIMPLE_MARKER_SYMBOL){
        return true;
    }

    if(type === PICTURE_MARKER_SYMBOL){
        return true;
    }

    return false;
}