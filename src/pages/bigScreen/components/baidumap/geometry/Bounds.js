import Geometry, {GEOMETRY_TYPE_BOUNDS, GEOMETRY_TYPE_POINT, GEOMETRY_TYPE_POLYGON} from "./Geometry";
import Point from "./Point";
import {multiPoint} from "@turf/turf";
import {isBounds, isPoint} from "./factory";
import Polygon from "./Polygon";


export default class Bounds extends Geometry {
    constructor(props) {
        super({
            type: GEOMETRY_TYPE_BOUNDS,
            coordinates:[]
        });

        let {coordinates = []} = props;

        let gf = multiPoint(coordinates);
        let geoJson = gf.geometry;
        this.coordinates = geoJson.coordinates;
    }

    get coordinates() {
        return this._coordinates;
    }

    set coordinates(value) {
        if (null === value ||//验证是否为空
            undefined === value ||
            !(value instanceof Array) ||//验证值的类型及约束
            2 !== value.length ||
            !(value[0] instanceof Array) ||//验证第一个坐标值得类型及约束
            2 !== value[0].length ||
            Number.isNaN(value[0][0]) ||
            !Number.isFinite(value[0][0]) ||
            Number.isNaN(value[0][1]) ||
            !Number.isFinite(value[0][1]) ||
            !(value[1] instanceof Array) ||//验证第二个坐标值得类型及约束
            2 !== value[1].length ||
            Number.isNaN(value[1][0]) ||
            !Number.isFinite(value[1][0]) ||
            Number.isNaN(value[1][1]) ||
            !Number.isFinite(value[1][1])
        ) {
            this._coordinates = [];
            return;
        }

        this._coordinates = [];
        let xmin = Math.min(value[0][0], value[1][0]);
        let xmax = Math.max(value[0][0], value[1][0]);
        let ymin = Math.min(value[0][1], value[1][1]);
        let ymax = Math.max(value[0][1], value[1][1]);

        this._coordinates.push([xmin, ymin]);
        this._coordinates.push([xmax, ymax]);
    }

    width() {
        return this.xmax - this.xmin;
    }

    height() {
        return this.ymax - this.ymin;
    }

    /**
     * 屏幕左边X坐标
     * @returns {*}
     */
    xstart() {
        return this.xmin;
    }

    /**
     * 屏幕右边X坐标
     * @returns {*}
     */
    xend() {
        return this.xmax;
    }

    /**
     * 屏幕上边Y坐标
     * @returns {*}
     */
    ystart() {
        //屏幕像素坐标和地理坐标在Y轴方向相反
        return this.ymax;
    }

    /**
     * 屏幕下边Y坐标
     * @returns {*}
     */
    yend() {
        //屏幕像素坐标和地理坐标在Y轴方向相反
        return this.ymin;
    }

    from({xmin, ymin, xmax, ymax}) {
        this.coordinates = [
            [xmin, ymin],
            [xmax, ymax]
        ];
    }

    toJson() {
        return Object.assign(
            super.toJson(),
            {
                type: this.type,
                coordinates: this.coordinates
            });
    }

    toJsonObj() {
        return {
            xmin: this.xmin,
            xmax: this.xmax,
            ymin: this.ymin,
            ymax: this.ymax
        };
    }

    fromJsonObj(jsonObj) {
        this.coordinates = [
            [jsonObj.xmin, jsonObj.ymin],
            [jsonObj.xmax, jsonObj.ymax]
        ];
        return this;
    }

    toArr() {
        return [this.xmin, this.ymin, this.xmax, this.ymax];
    }

    fromArr(bbox) {
        this.coordinates = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
        ];

        return this;
    }

    get xmin() {
        return this._coordinates[0][0];
    }

    set xmin(value) {
        this._coordinates[0][0] = value;
    }


    get ymin() {
        return this._coordinates[0][1];
    }

    set ymin(value) {
        this._coordinates[0][1] = value;
    }

    get xmax() {
        return this._coordinates[1][0];
    }

    set xmax(value) {
        this._coordinates[1][0] = value;
    }

    get ymax() {
        return this._coordinates[1][1];
    }

    set ymax(value) {
        this._coordinates[1][1] = value;
    }

    get min(){
        return new Point({
            type : GEOMETRY_TYPE_POINT,
            coordinates : [
                this.xmin , this.ymin
            ]
        });
    }

    set min(p){
        p = new Point(p);
        if(!p.isEmpty()){
            this.xmin = Number.NaN;
            this.ymin = Number.NaN;
            return;
        }

        this.xmin = p.x;
        this.ymin = p.y;
    }

    get max(){
        return new Point({
            type : GEOMETRY_TYPE_POINT,
            coordinates : [
                this.xmax , this.ymax
            ]
        });
    }

    set max(p){
        p = new Point(p);
        if(!p.isEmpty()){
            this.xmax = Number.NaN;
            this.ymax = Number.NaN;
            return;
        }

        this.xmax = p.x;
        this.ymax = p.y;
    }

    /**
     * 映射几何对象内的点，返回新的几何对象
     *
     * @param {coordinatesMapCallback} fun
     * @returns {Bounds|null}
     */
    coordinatesMap(fun) {
        let geometry = super.coordinatesMap(fun);
        if (!geometry) {
            return geometry;
        }

        return new Bounds({
            type: this.type,
            coordinates: this.coordinates.map((coordinate) => {
                return fun(coordinate);
            })
        });
    }

    expand(x, y) {
        if (this.isEmpty()) {
            this.coordinates = [
                [x, y],
                [x, y]
            ];
            return this;
        }

        this.xmin = Math.min(this.xmin, x);
        this.xmax = Math.max(this.xmax, x);
        this.ymin = Math.min(this.ymin, y);
        this.ymax = Math.max(this.ymax, y);

        return this;
    }

    getCenter() {
        return new Point({
            type: "Point",
            coordinates: [
                (this.xmin + this.xmax) / 2,
                (this.ymin + this.ymax) / 2
            ]
        })
    }

    getBootomLeft() {
        return new Point({
            type: "Point",
            coordinates: [
                this.xmin, this.ymin
            ]
        });
    }

    getTopRight() {
        return new Point({
            type: "Point",
            coordinates: [
                this.xmax, this.ymax
            ]
        });
    }

    getTopLeft() {
        return new Point({
            type: "Point",
            coordinates: [
                this.xmin, this.ymax
            ]
        });
    }

    getBottomRight() {
        return new Point({
            type: "Point",
            coordinates: [
                this.xmax, this.ymin
            ]
        })
    }

    toPolygon(){
        let bl = this.getBootomLeft();
        let br = this.getBottomRight();
        let tr = this.getTopRight();
        let tl = this.getTopLeft();

        return new Polygon({
            type : GEOMETRY_TYPE_POLYGON,
            coordinates : [
                [
                    [bl.x , bl.y],
                    [br.x , br.y],
                    [tr.x , tr.y],
                    [tl.x , tl.y],
                    [bl.x , bl.y]
                ]
            ]
        });
    }

    /**
     * 是否包含
     *
     * @param {Point|Bounds} obj
     * @return {boolean}
     */
    contain(obj) {
        let xmin = null, ymin = null, xmax = null, ymax = null;

        let point = null;
        try {
            if (isPoint(obj)) {
                point = obj;
            }
        }catch (e) {
            console.log(e);
        }

        let bounds = null;
        if(isBounds(obj)){
            bounds = obj;
        }

        if ((!point || point.isEmpty()) &&( !bounds || bounds.isEmpty())) {
            return false;
        }

        if (point && !point.isEmpty()) {
            xmin = point.coordinates[0];
            xmax = point.coordinates[0];
            ymin = point.coordinates[1];
            ymax = point.coordinates[1];
        } else if(bounds && !bounds.isEmpty()){
            xmin = bounds.xmin;
            ymin = bounds.ymin;
            xmax = bounds.xmax;
            ymax = bounds.ymax
        }else{
            return false;
        }

        return xmin >= this.xmin &&
            xmax <= this.xmax &&
            ymin >= this.ymin &&
            ymax <= this.ymax;
    }

    /**
     * 相交（只要有一个点同时落在两个矩形范围内）
     *
     * @param {Bounds} bounds
     * @return {boolean}
     */
    intersects(bounds){
        bounds = new Bounds(bounds);
        if(bounds.isEmpty()){
            return false;
        }

        let xIntersects = (bounds.xmax >= this.xmin && bounds.xmin <= this.xmax);
        let yIntersects = (bounds.ymax >= this.ymin && bounds.ymin <= this.ymax);

        return xIntersects && yIntersects;
    }

    /**
     * 重叠（要有一个面同时落在两个矩形范围内）
     *
     * @param {Bounds} bounds
     * @return {boolean}
     */
    overlaps(bounds){
        bounds = new Bounds(bounds);
        if(bounds.isEmpty()){
            return false;
        }

        let xIntersects = (bounds.xmax > this.xmin && bounds.xmin < this.xmax);
        let yIntersects = (bounds.ymax > this.ymin && bounds.ymin < this.ymax);

        return xIntersects && yIntersects;
    }

}