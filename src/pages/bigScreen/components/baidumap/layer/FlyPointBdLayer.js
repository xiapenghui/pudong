// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
// import ProtectionObjectData from "./ProtectionObjectData";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
// import MapService from "../base/MapServiceUrl";

function FlyPointBdLayer() {//坐标定位点
    return {
        data() {
            return {
            };
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 保电对象");
                this.eventBus.on("layer-visible-FlyPointBdLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("graphic-flyShowTips-FlyPointBdLayer", this.flyShowTips);//定位tips弹框


                //{"lng":121.608677,"lat":31.234436}
                // var gs = [];
                // gs.push(
                //     new Graphic({
                //         id: 1,
                //         feature: new Feature({
                //             id: 1,
                //             geometry: new Point({
                //                 type: GEOMETRY_TYPE_POINT,
                //                 coordinates: [121.608677, 31.234436]
                //             }),
                //             properties: Object.assign({
                //             }, {})
                //         }),
                //         symbol: {
                //             type: NONE_SYMBOL
                //         }
                //     })
                // );
                // this.addGraphics(gs);
                // this.refresh();
            }
        },
        methods: {
            flyShowTips({ pixel, layer, map }) {//定位tips弹框
                let point = layer.point;
                if (point.lng != "" && point.lng != undefined) {//坐标不为空
                    var gs = [];
                    gs.push(
                        new Graphic({
                            id: 1,
                            feature: new Feature({
                                id: 1,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [point.lng, point.lat]
                                }),
                                properties: Object.assign({
                                }, {})
                            }),
                            symbol: {
                                type: NONE_SYMBOL
                            }
                        })
                    );
                    this.addGraphics(gs);
                    this.refresh();


                    this.eventBus.emit("layer-visible-FlyPointBdLayer", true);//打开图层

                    canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位

                    // setTimeout((gs) => {
                    //     
                    //     canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: 121.608677, y: 31.234436, zoom: 17 });//定位
                    // }, 1000);

                } else {
                    this.eventBus.emit("graphic-ErrorTips", "坐标不能为空！！");
                }

                // let point = layer.point;
                // canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位

                // let graphic = null;//当前定位graphic
                // let graphicList = [];//所有graphic
                // let flyLayer = null;//当前图层
                // let layerList = canvasRender.default.layers;//所有图层
                // for (let i = 0; i < layerList.length; i++) {
                //     if (layerList[i].$data.name == layer.layerName) {
                //         flyLayer = layerList[i];
                //         graphicList = layerList[i].$data.graphics;
                //     }
                // }

                // var point = {
                //     lng: 0,
                //     lat: 0,
                // }
                // if (graphicList.length > 0) {
                //     for (let i = 0; i < graphicList.length; i++) {
                //         if (graphicList[i].id == layer.id) {
                //             graphic = graphicList[i];

                //             graphic = graphicList[i];
                //             var x = parseFloat(graphic.feature.geometry.coordinates[0]);
                //             var y = parseFloat(graphic.feature.geometry.coordinates[1]);
                //             point.lng = x;
                //             point.lat = y;
                //             canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: x, y: y, zoom: layer.zoom });//定位
                //         }
                //     }
                //     if (graphic != null) {
                //         setTimeout(function () {
                //             flyLayer.graphicClickHandler({ pixel, point, graphic, map });
                //         }, 1000)
                //     } else {
                //         this.eventBus.emit("graphic-ErrorTips", "定位失败,图层中没有该数据！");
                //     }
                // } else {
                //     this.eventBus.emit("graphic-ErrorTips", "定位失败！！");
                // }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible;
            }
        },
        created() {
        }
    };
};


export default VectorLayer.extend(FlyPointBdLayer());
