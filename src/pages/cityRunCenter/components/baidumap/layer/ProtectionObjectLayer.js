import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import ProtectionObjectData from "./ProtectionObjectData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function ProtectionObjectLayer() {//保电对象
    return {
        data() {
            return {
            };
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 保电对象");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-ProtectionObjectLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-ProtectionObjectLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("graphic-flyShowTips-ProtectionObjectLayer", this.flyShowTips);//定位tips弹框

                let data = ProtectionObjectData.features;//保电对象数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].properties.X == undefined || data[i].properties.X == "") {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: data[i].properties.ID,
                            feature: new Feature({
                                id: data[i].properties.ID,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [data[i].properties.X, data[i].properties.Y]
                                }),
                                properties: Object.assign({
                                }, data[i].properties)
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
            flyShowTips({ pixel, layer, map }) {//定位tips弹框
                let point = layer.point;
                canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位

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
                let but = [];
                if (graphic.feature.properties.zydj == "一级" || graphic.feature.properties.zydj == "二级") {
                    but.push({ 'type': 'xslx', 'name': '巡视路径' });//二级按钮
                }
                let itme = {
                    layerName: "ProtectionObjectLayer",//图层名称
                    title: "保电对象",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  井盖名称、所属公司、运维人员、联系方式
                        { 'type': '保电级别:', 'detail': graphic.feature.properties.zydj },
                        { 'type': '所属公司:', 'detail': graphic.feature.properties.ssgs },
                        { 'type': '用户名:', 'detail': graphic.feature.properties.yhm },

                    ],
                    button: but
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "xslx") {//巡视线路
                    this.eventBus.emit("layer-addLayer-ProtectionLineLayer", graphic.feature.properties);//保电对象-线路
                    this.eventBus.emit("layer-visible-ProtectionLineLayer", true);//保电对象-线路
                    this.eventBus.emit("layer-addLayer-ProtectionDsdLayer", graphic.feature.properties);//保电对象-蹲守点
                    this.eventBus.emit("layer-visible-ProtectionDsdLayer", true);//保电对象-蹲守点
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
        }
    };
};


export default VectorLayer.extend(ProtectionObjectLayer());
