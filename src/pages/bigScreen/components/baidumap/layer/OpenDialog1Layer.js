import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import OpenDialog1Data from "./OpenDialog1Data";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
// import MapService from "../base/MapServiceUrl";

import eventBus from "../base/EventBus";

function OpenDialog1Layer() {//弹框图层1
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 弹框图层1");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-OpenDialog1Layer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("graphic-flyShowTips-OpenDialog1Layer", this.flyShowTips);//定位tips弹框


                let data = OpenDialog1Data;//弹框图层1数据
                let gs = [];

                for (let i = 0; i < data.length; i++) {
                    if (data[i].jd == undefined || data[i].jd == "") {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: data[i].id,
                            feature: new Feature({
                                id: data[i].id,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [data[i].jd, data[i].wd]
                                }),
                                properties: Object.assign({
                                }, data[i])
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
            openDilog1() {//弹框
                let layers = [
                //     {
                //     id: "1",//定位对象id 
                //     layerName: "OpenDialog1Layer",//定位图层
                //     zoom: 0,//定位图层
                //     point: {
                //         lng: 121.517319,
                //         lat: 31.240997
                //     }
                // }, 
                {
                    id: "2",//定位对象id 
                    layerName: "OpenDialog1Layer",//定位图层
                    zoom: 0,//定位图层
                    point: {
                        lng: 121.614013,
                        lat: 31.190009
                    }
                }]
                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    eventBus.emit("layer-flyClickTips", { layer });//定位
                }
            },
            flyShowTips({ pixel, layer, map }) {//定位tips弹框
                let point = layer.point;
                //canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位

                let graphic = null;//当前定位graphic
                let graphicList = [];//所有graphic
                let flyLayer = null;//当前图层
                let layerList = canvasRender.default.layers;//所有图层
                for (let i = 0; i < layerList.length; i++) {
                    if (layerList[i].$data.name == layer.layerName) {
                        flyLayer = layerList[i];
                        graphicList = layerList[i].$data.graphics;
                    }
                }
                if (graphicList.length > 0) {
                    for (let i = 0; i < graphicList.length; i++) {
                        if (graphicList[i].id == layer.id) {
                            graphic = graphicList[i];
                        }
                    }
                    if (graphic != null) {
                        setTimeout(function () {
                            flyLayer.graphicClickHandler({ pixel, point, graphic, map });
                        }, 1000)
                    } else {
                        this.eventBus.emit("graphic-ErrorTips", "定位失败,图层中没有该数据！");
                    }
                } else {
                    this.eventBus.emit("graphic-ErrorTips", "定位失败！！");
                }
            },
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                let itme = {
                    layerName: "OpenDialog1Layer",//图层名称
                    title: graphic.feature.properties.name,//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  线路名称、告警类型、告警事件、告警时间
                        { 'type': '线缆断线报警(台):', 'detail': "24" },
                        { 'type': '光纤振动监测(台):', 'detail': "38" },
                        { 'type': '智能井盖(个):', 'detail': "65" },
                        { 'type': '线路监拍(个):', 'detail': "58" },
                        { 'type': '变电站视频(台):', 'detail': "31" },
                        { 'type': '配电站视频(台):', 'detail': "34" },
                    ],
                    button: [//按钮 type:类型  name:名称
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
                // if (graphic.feature.properties.name == "张江科学城能源互联网示范区") {
                //     this.eventBus.emit("graphic-click-showTips1", { pixel, point, graphic, map, itme });
                // } else {
                //     this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
                // }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
        }
    };
};


export default VectorLayer.extend(OpenDialog1Layer());
