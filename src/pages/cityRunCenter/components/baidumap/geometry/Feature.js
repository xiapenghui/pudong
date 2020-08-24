import {IDFactory} from "../support/IDGen";
import Geometry from "./Geometry";
import {bbox as bboxCreate, bboxPolygon} from "@turf/turf";
import GeoJson from "./GeoJson";
import {geometryFactory} from "./factory";

let idGen = IDFactory("_f_id_");

export default class Feature extends GeoJson {


    /**
     * @constructor
     * @param props
     * @param {String} props.id - ID
     * @param {Geometry} props.geometry - 几何对象或能够初始化几何对象的JSON格式数据
     * @param {Object} props.properties - 属性数据
     */
    constructor(props) {
        super({type: "Feature"});

        if(!props){
            props = {};
        }

        let {
            id = idGen.next(),
            geometry = null,
            properties = null
        } = props;

        this.id = id;
        this.geometry = geometry;
        this.properties = properties;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get geometry() {
        return this._geometry;
    }

    set geometry(value) {
        if (value instanceof Geometry) {
            this._geometry = value;
        } else {
            this._geometry = geometryFactory(value);
        }

        if (this._geometry) {
            this.bbox = bboxCreate(this.geometry.toJson());
        } else {
            this.bbox = null;
        }
    }

    get properties() {
        return this._properties;
    }

    set properties(value) {
        this._properties = value;
    }

    get bbox() {
        return this._bbox;
    }

    set bbox(value) {
        this._bbox = value;
    }

    bboxPolygon() {
        if (this.bbox) {
            return new Feature(bboxPolygon(this.bbox)).geometry;
        }

        return null;
    }

    toJson(){
        return {
            type : this.type,
            id : this.id,
            bbox : this.bbox,
            geometry : this.geometry.toJson(),
            properties : this.properties
        };
    }

    hasProp(field){
        if(!field){
            return false;
        }

        if(!this.properties){
            return false;
        }

        return this.properties.hasOwnProperty(field);
    }

    getIntPropVal(field, defaultVal) {
        let val = null;
        if (this.properties && this.properties.hasOwnProperty(field)) {
            val = parseInt(this.properties[field]);
        }

        if (null !== val && !isNaN(val) && isFinite(val)) {
            return val;
        } else if (null !== defaultVal && undefined !== defaultVal) {
            return defaultVal;
        }

        return null;
    }

    getFloatPropVal(field, defaultVal) {
        let val = null;
        if (this.properties && this.properties.hasOwnProperty(field)) {
            val = parseFloat(this.properties[field]);
        }

        if (null !== val && !isNaN(val) && isFinite(val)) {
            return val;
        } else if (null !== defaultVal && undefined !== defaultVal) {
            return defaultVal;
        }

        return null;
    }

    getStringPropVal(field, defaultVal) {
        let val = null;
        if (this.properties && this.properties.hasOwnProperty(field)) {
            val = this.properties[field];
        }

        if (null !== val) {
            if(val instanceof String){
                return val
            }

            if(typeof val === "string"){
                return val;
            }

            return JSON.stringify(val);
        } else if (null !== defaultVal && undefined !== defaultVal) {
            return defaultVal;
        }

        return null;
    }

    getPropVal(field, defaultVal) {
        let val = null;
        if (this.properties && this.properties.hasOwnProperty(field)) {
            val = this.properties[field];
        }

        if (null !== val && undefined !== val) {
            return val;
        } else if (null !== defaultVal && undefined !== defaultVal) {
            return defaultVal;
        }

        return null;
    }
}