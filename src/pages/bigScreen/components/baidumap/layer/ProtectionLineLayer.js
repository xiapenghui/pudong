// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import ProtectionLineData from "./ProtectionLineData";
import MultiLineString from "../geometry/MultiLineString";
// import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
// import Point from "../geometry/Point";
// import MapService from "../base/MapServiceUrl";

function ProtectionLineLayer() {//保电对象-线路
    return {
        data() {
            return {
            };
        },
        props: {},
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-ProtectionLineLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-addLayer-ProtectionLineLayer", this.addProtectionLineLayer);//监听保电对象-线路
            }
        },
        methods: {
            addProtectionLineLayer(itme) {
                this.removeAll();//清除当前图层所有Graphic

                let data = ProtectionLineData;//保电对象-线路数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {//data.features.length
                    if (itme.ID == data[i][0].ID) {
                        for (let j = 0; j < data[i][1].features.length; j++) {
                            gs.push(
                                new Graphic({
                                    feature: new Feature({
                                        geometry: new MultiLineString({
                                            type: "MultiLineString",
                                            coordinates: [data[i][1].features[j].geometry.coordinates]
                                        }),
                                        properties: Object.assign({
                                        }, data[i][1].features[j].properties)
                                    }),
                                    symbol: {
                                        type: NONE_SYMBOL
                                    }
                                })
                            );
                        }
                    }
                }
                if (gs.length == 0) {
                    this.eventBus.emit("graphic-ErrorTips", "暂无保电路径！！");
                } else {
                    this.addGraphics(gs);
                    this.refresh();
                }
                this.flyLine(gs);//线路定位
                this.visible=true;
            },
            flyLine(gs) {
                let pointX = [];//所有X值
                let pointY = [];//所有Y值
                for(let i=0;i<gs.length;i++){
                    for(let j=0;j<gs[i].feature.geometry.coordinates[0].length;j++){
                        pointX.push(gs[i].feature.geometry.coordinates[0][j][0]);
                        pointY.push(gs[i].feature.geometry.coordinates[0][j][1]);
                    }
                }
                pointX = pointX.sort((a, b) => {
                    return a - b;
                })
                pointY = pointY.sort((a, b) => {
                    return a - b;
                })
                canvasRender.default.eventBus.emit("canvas-renderer-fly", [ pointX[0], pointY[0],pointX[pointX.length-1], pointY[pointY.length-1] ]);//xy最小值,xy最大值
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


export default VectorLayer.extend(ProtectionLineLayer());
