import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import GridPersonnelTrajectoryData from "./GridPersonnelTrajectoryData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";
import MultiLineString from "../geometry/MultiLineString";

function GridPersonnelTrajectoryLayer() {//网格化运维-历史轨迹
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-GridPersonnelTrajectoryLayer", this.onLayerVisible);//图层显示隐藏监听
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-addLayer-GridPersonnelTrajectoryLayer", this.addGridPersonnelTrajectory);//图层渲染

            }
        },
        methods: {
            addGridPersonnelTrajectory(data) {//图层渲染
                this.removeAll();//清除当前图层所有Graphic
                let list =data; //GridPersonnelTrajectoryData;//网格化运维-轨迹数据
                let gs = [];

                let start = list.start_point;//起点
                start.start_time = list.points[0].create_time;
                start.type = "start";

                let end = list.end_point;//终点
                end.end_time = list.points[list.points.length - 1].create_time;
                end.type = "end";

                let lineList = [];//线路
                for (let i = 0; i < list.points.length; i++) {
                    lineList.push(list.points[i].location);
                }

                gs.push(//起点
                    new Graphic({
                        feature: new Feature({
                            geometry: new Point({
                                type: GEOMETRY_TYPE_POINT,
                                coordinates: [start.longitude, start.latitude]
                            }),
                            properties: Object.assign({
                            }, start)
                        }),
                        symbol: {
                            type: NONE_SYMBOL
                        }
                    })
                );
                gs.push(//终点
                    new Graphic({
                        feature: new Feature({
                            geometry: new Point({
                                type: GEOMETRY_TYPE_POINT,
                                coordinates: [end.longitude, end.latitude]
                            }),
                            properties: Object.assign({
                            }, end)
                        }),
                        symbol: {
                            type: NONE_SYMBOL
                        }
                    })
                );
                gs.push(//线路
                    new Graphic({
                        feature: new Feature({
                            geometry: new MultiLineString({
                                type: "MultiLineString",
                                coordinates: [lineList]//[coordinatesLine]
                            }),
                            properties: Object.assign({
                            }, { type: "line" })
                        }),
                        symbol: {
                            type: NONE_SYMBOL
                        }
                    })
                );

                this.addGraphics(gs);
                this.refresh();

                this.flyLine(lineList);//线路定位
                this.eventBus.emit("layer-visible-GridPersonnelTrajectoryLayer", true);
            },
            flyLine(lineList) {//线路定位
                let pointX = [];//所有X值
                let pointY = [];//所有Y值

                for (let i = 0; i < lineList.length; i++) {
                    pointX.push(lineList[i][0]);
                    pointY.push(lineList[i][1]);
                }
                pointX = pointX.sort((a, b) => {
                    return a - b;
                })
                pointY = pointY.sort((a, b) => {
                    return a - b;
                })
                canvasRender.default.eventBus.emit("canvas-renderer-fly", [pointX[0], pointY[0], pointX[pointX.length - 1], pointY[pointY.length - 1]]);//xy最小值,xy最大值
            },
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                if (graphic.feature.properties.type != "line") {//点击点
                    //let time = (new Date(graphic.feature.properties.loc_time).toTimeString()).substring(0, 8)
                    let time = graphic.feature.properties.start_time;
                    let typeName = "开始时间：";
                    if (graphic.feature.properties.type == "end") {
                        typeName = "结束时间：";
                        time = graphic.feature.properties.end_time;
                    }
                    let itme = {
                        layerName: "GridPersonnelTrajectoryLayer",//图层名称
                        title: "网格化运维-历史轨迹",//tips标题
                        type: "",//tips展示类型 
                        data: [
                            { 'type': typeName, 'detail': time },
                        ],
                    }
                    this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
                }
            },
            onLayerVisible(type) {//图层显示隐藏
                if (type) {
                    this.visible = type;
                } else {
                    this.visible = !this.visible
                }
            }
        },
        created() {
        }
    };
};


export default VectorLayer.extend(GridPersonnelTrajectoryLayer());
