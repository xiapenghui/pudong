// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import CommandCentreData from "./CommandCentreData";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";

function CommandCentreLayer() {//指挥中心
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 指挥中心");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-CommandCentreLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-CommandCentreLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("graphic-flyShowTips-CommandCentreLayer", this.flyShowTips);//定位tips弹框

                let graphics = CommandCentreData.map((data) => {
                    return new Graphic({
                        id: data.ISC_ID,
                        feature: new Feature({
                            id: data.ISC_ID,
                            geometry: new Point({
                                type: GEOMETRY_TYPE_POINT,
                                coordinates: [data.LONGITUDE, data.LATITUDE]
                            }),
                            properties: Object.assign({
                            }, data)
                        }),
                        symbol: {
                            type: NONE_SYMBOL
                        }
                    });
                });
                this.addGraphics(graphics);
                this.refresh();
            }
        },
        methods: {
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                let itme = {
                    layerName: "CommandCentreLayer",//图层名称
                    title: "指挥中心",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据 
                        { 'type': '名称:', 'detail': graphic.feature.properties.MC },
                        { 'type': '地址:', 'detail': graphic.feature.properties.DZ },
                        { 'type': '负责人:', 'detail': graphic.feature.properties.FZR },
                        { 'type': '联系方式:', 'detail': graphic.feature.properties.LXDH },
                        { 'type': '人员数量:', 'detail': '' },
                        { 'type': '车辆数量:', 'detail': '' },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
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
            clickBut({ itme, type }) {//图层二级按钮
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
                console.log("aaa")
            }
        }
    };
};


export default VectorLayer.extend(CommandCentreLayer());
