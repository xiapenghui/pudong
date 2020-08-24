import GeoJson from "./GeoJson";

export let GEOMETRY_TYPE_POINT = "Point";
export let GEOMETRY_TYPE_MULTIPOINT = "MultiPoint";
export let GEOMETRY_TYPE_LINESTRING = "LineString";
export let GEOMETRY_TYPE_MULTILINESTRING = "MultiLineString";
export let GEOMETRY_TYPE_POLYGON = "Polygon";
export let GEOMETRY_TYPE_MULTIPOLYGON = "MultiPolygon";
export let GEOMETRY_TYPE_BOUNDS = "bounds";//扩招GeoJSON格式的对象，用来描述矩形包络范围


function coordinatesDeep(coordinates) {
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

export function validateType(type) {
    if (!type) {
        return false;
    }

    return GEOMETRY_TYPE_POINT === type ||
        GEOMETRY_TYPE_MULTIPOINT === type ||
        GEOMETRY_TYPE_LINESTRING === type ||
        GEOMETRY_TYPE_MULTILINESTRING === type ||
        GEOMETRY_TYPE_POLYGON === type ||
        GEOMETRY_TYPE_MULTIPOLYGON === type;
}

export default class Geometry extends GeoJson {

    /**
     * @constructor
     * @param props
     * @param {String} props.type - 几何对象类型
     * @param {Number[]} props.coordinates - 几何对象坐标
     * @extends GeoJson
     */
    constructor(props) {
        super({type: props.type});

        let {
            type = "Geometry",
            coordinates = []
        } = props;

        this.type = type;
        this.coordinates = coordinates;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get coordinates() {
        return this._coordinates;
    }

    set coordinates(value) {
        this._coordinates = value;
    }

    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {Geometry|null}
     */
    coordinatesMap(fun) {
        if (null === fun || undefined === fun || !(fun instanceof Function)) {
            return null;
        }

        return new Geometry({
            type: this.type,
            coordinates: this.coordinates
        });
    }

    toJson(){
        return {
            type : this.type,
            coordinates : this.coordinates
        };
    }

    isEmpty(){
        return !this.coordinates ||
            0 === this.coordinates.length ||
            (this.coordinates[0] instanceof Array && (!this.coordinates[0] || 0 === this.coordinates[0].length) ) ||
            (this.coordinates[0][0] instanceof Array && (!this.coordinates[0][0] || 0 === this.coordinates[0][0].length) );
    }
}


/**
 * @alias coordinatesMapCallback
 * @function coordinatesMapCallback
 * @param {Number[]} coordinate
 * @return Number[]
 */