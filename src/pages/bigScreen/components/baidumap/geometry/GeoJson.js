export let GEOJSON_TYPE_FEATURE = "Feature";
export let GEOJSON_TYPE_GEOMETRYCOLLECTION = "GeometryCollection";
export let GEOJSON_TYPE_FEATURECOLLECTION = "FeatureCollection";

export function validateType(type) {
    if (!type) {
        return false;
    }

    return GEOJSON_TYPE_FEATURE === type ||
        GEOJSON_TYPE_FEATURECOLLECTION === type ||
        GEOJSON_TYPE_GEOMETRYCOLLECTION === type;
}

export default class GeoJson {

    /**
     *
     * @constructor
     * @param props
     * @param {String} props.type - 对象类型
     */
    constructor(props) {
        let {type = ""} = props;

        this.type = type;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
}

