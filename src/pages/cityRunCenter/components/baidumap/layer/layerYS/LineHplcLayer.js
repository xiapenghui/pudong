import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import MultiLineString from "../../geometry/MultiLineString";
import LineHplcData from "./LineHplcData"//线数据-HPLC
import { wgs2bd } from "../../utils/Convert";//坐标转换
import RendererFactory from "../../renderer/factory";//更换Symbol

function LineHplcLayer() {//线路 HPLC
    return {
        data() {
            return {
                timer: 0//计时器
            };
        },
        props: {},
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-LineHplcLayer", this.onLayerVisible);//图层显示隐藏监听

                let data = LineHplcData;//线数据
                let wgs2bdData = [];
                for (let i = 0; i < data.features.length; i++) {//坐标转换
                    let jArr = [];
                    for (let j = 0; j < data.features[i].geometry.paths.length; j++) {
                        let kArr = [];
                        for (let k = 0; k < data.features[i].geometry.paths[j].length; k++) {
                            let jd = data.features[i].geometry.paths[j][k][0];
                            let wd = data.features[i].geometry.paths[j][k][1];
                            let point = wgs2bd(jd, wd);//世界大地坐标转为百度坐标
                            kArr.push([point[0], point[1]]);
                        }
                        jArr.push(kArr);
                    }
                    data.features[i].geometry.lineData = jArr;
                    //data.features[i].geometry.lineData.push(jArr);
                }

                let gs = [];
                for (let i = 0; i < data.features.length; i++) {//data.features.length
                    // if (data.features[i].geometry.paths.length <= 0) {
                    //     //console.log("i："+i+"！！！！"+data.features[i].attributes.OBJECTID)
                    //     continue;
                    // }
                    // if (data.features[i].geometry.paths[0].length <= 2) {//过滤线路数据

                    //     if (data.features[i].geometry.paths[0][0][0] == data.features[i].geometry.paths[0][1][0] &&
                    //         data.features[i].geometry.paths[0][0][1] == data.features[i].geometry.paths[0][1][1]) {
                    //         continue;
                    //     }
                    // }
                    gs.push(
                        new Graphic({
                            id: data.features[i].attributes.OBJECTID,
                            feature: new Feature({
                                id: data.features[i].attributes.OBJECTID,
                                geometry: new MultiLineString({
                                    type: MultiLineString,
                                    coordinates: data.features[i].geometry.lineData//[data.features[i].geometry.paths[0]]
                                }),
                                properties: Object.assign({
                                }, data.features[i].attributes)
                            }),
                            symbol: {
                                type: NONE_SYMBOL
                            }
                        })
                    );
                }
                this.addGraphics(gs);
                this.refresh();
            }
        },
        methods: {
            timeRefresh() {//定时渲染symbol
                setTimeout(() => {
                    this.onLayerReplaceSymbol();
                }, 500)
            },
            onLayerReplaceSymbol() {
                let re = null;
                if (this.timer == 10) {
                    this.timer=0;
                    return;
                }
                if (this.timer % 2 == 0) {
                    re = {
                        type: "uniqueValueRenderer",
                        field: "Layer",
                        defaultSymbol: {
                            type: "simpleLine",
                            color: [13, 136, 229],
                            width: 2
                        },
                        uniqueValueInfos: [//低压站内-隔离开关
                            {
                                value: "用电-计量箱",
                                symbol: {
                                    type: "simpleLine",
                                    color: [236, 74, 75],
                                    width: 2
                                }
                            }
                        ]
                    }
                } else {
                    re = {
                        type: "uniqueValueRenderer",
                        field: "Layer",
                        defaultSymbol: {
                            type: "simpleLine",
                            color: [13, 136, 229],
                            width: 2
                        },
                        uniqueValueInfos: [
                            {
                                value: "用电-计量箱",
                                symbol: {
                                    type: "simpleLine",
                                    color: [255, 204, 0],
                                    width: 2
                                }
                            }
                        ]
                    }
                }
                this.timer++;
                let renderer = RendererFactory(re);
                let layers=canvasRender.default.layers;
                for(let i=0;i<layers.length;i++){
                    if(layers[i].name=="LineHplcLayer"){
                        layers[i].setRenderer(renderer);
                    }
                }
                this.timeRefresh();
            },
            onLayerVisible(type) {//图层显示隐藏
                if (type) {
                    this.visible = type;
                } else {
                    this.visible = !this.visible
                }
            }
        }
    };
};


export default VectorLayer.extend(LineHplcLayer());
