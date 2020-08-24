import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import MultiLineString from "../../geometry/MultiLineString";
import RepairPersonnelLineData from "./RepairPersonnelLineData"//数据 
import DrivingRoute from "../../utils/DrivingRoute";//导航线路
import { buffer } from "../../geometry/geometryEngine";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
import Point from "../../geometry/Point";

//演示图层-抢修人员线路
function RepairPersonnelLineLayer() {
    return {
        data() {
            return {
                pointData: ""
            };
        },
        props: {},
        methods: {
        },
        watch: {
            ready: function () {
                Console.debug("Test layer ready run");
                this.eventBus.on("layer-visible-RepairPersonnelLineLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-visible-onPersonnelLine", this.onPersonnelLine);//监听人员线路
            }
        },
        methods: {
            onPersonnelLine({ point }) {
                canvasRender.default.eventBus.once("canvas-renderer-geometryQuery-result", this.onGeometryQueryResult);//缓冲区查询人员图层监听

                this.visible = true;
                this.pointData = point;
                canvasRender.default.eventBus.emit("canvas-renderer-geometryQuery", {
                    // geometry: buffer({
                    //     type: "Point",
                    //     coordinates: [point.jd, point.wd]
                    // }, 5000),
                    geometry: buffer(new Point({
                        type: GEOMETRY_TYPE_POINT,
                        coordinates: [point.jd, point.wd]
                    }), 5000),//米
                    layersOrFun: ["RepairPersonnelYSLayer"]
                });//缓冲区查询人员图层   

            },
            onGeometryQueryResult(data) {//缓冲区人员线路
                this.removeAll();//清除当前图层所有Graphic
                if (data[0].graphics.length <= 0) {
                    return;
                }
                this.eventBus.emit("layer-visible-RepairPersonnelYSLayer", { layer: "RepairPersonnelYSLayerShowLine" });//抢修人员图层打开
                Promise.all(data[0].graphics.map((graphic) => {
                    return DrivingRoute(
                        //graphic.feature.geometry,
                        { x: graphic.feature.properties.longitude, y: graphic.feature.properties.latitude },
                        { x: this.pointData.jd, y: this.pointData.wd }
                    );
                })).then((responses) => {
                    let results = [];
                    responses.forEach((route, index) => {
                        results.push(new Graphic({
                            feature: new Feature({
                                geometry: {
                                    type: "MultiLineString",
                                    coordinates: route.route,//[linString],//lineSplit
                                },
                                properties: {
                                    field: "LineString"
                                }
                            }), symbol: { type: NONE_SYMBOL }
                        }))
                    });
                    results = results.sort((a, b) => {
                        return a.feature.geometry.coordinates[0].length - b.feature.geometry.coordinates[0].length;
                    })
                    this.add(results[0]);
                    this.refresh();

                    this.yrLocation(results[0].feature.geometry.coordinates[0][0]);//人员tips打开
                    //this.flyPersonnelLine(results[0]);//线路定位
                })
            },
            yrLocation(point) {//人员tips打开
                let layer = {
                    id: "3",//定位对象id 
                    layerName: "RepairPersonnelYSLayer",//定位图层
                    zoom: 18,//定位图层
                    point: {
                        lng: point[0],
                        lat: point[1]
                    }
                }
                this.eventBus.emit("layer-flyClickTips", { layer });//演示图层人员定位
            },
            // flyPersonnelLine(results) {//线路定位
            //     let lineList = results.feature.geometry.coordinates[0];//当前渲染的线路
            //     let pointX = [];
            //     let pointY = [];
            //     pointX.push(lineList[0][0]);
            //     pointX.push(lineList[lineList.length - 1][0]);
            //     pointY.push(lineList[0][1]);
            //     pointY.push(lineList[lineList.length - 1][1]);
            //     pointX = pointX.sort((a, b) => {
            //         return a - b;
            //     })
            //     pointY = pointY.sort((a, b) => {
            //         return a - b;
            //     })
            //     canvasRender.default.eventBus.emit("canvas-renderer-fly", [pointX[1], pointY[1], pointX[0], pointY[0]]);//xy最大值,xy最小值
            // },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        }
    };
};


export default VectorLayer.extend(RepairPersonnelLineLayer());
