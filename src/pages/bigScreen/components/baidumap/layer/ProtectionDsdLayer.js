import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import ProtectionLineData from "./ProtectionLineData";
import MultiLineString from "../geometry/MultiLineString";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
// import MapService from "../base/MapServiceUrl";
// import ProtectionDsdLayerChartData from "./ProtectionDsdLayerChartData";//曲线数据

function ProtectionDsdLayer() {//保电对象-蹲守点
    return {
        data() {
            return {
            };
        },
        props: {},
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-ProtectionDsdLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-addLayer-ProtectionDsdLayer", this.addProtectionDsdLayer);//增加保电对象-蹲守点
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-clickBut-ProtectionDsdLayer", this.clickBut);//监听当前图层二级按钮
            }
        },
        methods: {
            addProtectionDsdLayer(itme) {
                this.removeAll();//清除当前图层所有Graphic

                let data = ProtectionLineData;//保电对象-蹲守点数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {//data.features.length
                    if (itme.ID == data[i][0].ID) {
                        for (let j = 0; j < data[i][0].features.length; j++) {
                            gs.push(
                                new Graphic({
                                    feature: new Feature({
                                        geometry: new Point({
                                            type: GEOMETRY_TYPE_POINT,
                                            coordinates: data[i][0].features[j].geometry.coordinates
                                        }),
                                        properties: Object.assign({
                                        }, data[i][0].features[j].properties)
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
                    this.eventBus.emit("graphic-ErrorTips", "暂无保电路径蹲守点！！");
                } else {
                    this.addGraphics(gs);
                    this.refresh();
                }
                this.visible = true;
            },
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                let dydj = graphic.feature.properties.DYDJ;
                let dydjmc = dydj == 22 ? "10kV" : dydj == 25 ? "35kV" : dydj == 32 ? "110kV" : dydj == 33 ? "220kV" : "500kV";

                var dzmc = graphic.feature.properties.SBMC;//点站名称

                var but = [];//按钮
                if (dzmc == "祖冲站") {
                    but.push({ 'type': 'ckqx', 'name': '查看曲线' });
                }

                let itme = {
                    layerName: "ProtectionDsdLayer",//图层名称
                    title: "保电对象-值守点",//tips标题
                    type: "",//tips展示类型
                    data: [
                        { 'type': '蹲守点名称:', 'detail': dzmc },
                        { 'type': '电压等级:', 'detail': dydjmc },

                    ],
                    button: []
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "ckqx") {//查看曲线
                
                    //保障对象
                    let layer = {
                        id: '1', //primaryId, //定位对象id
                        layerName: 'FlyPointBdLayer', //定位图层
                        zoom: 16, //定位图层
                        point: {
                            lng: 121.608677,
                            lat: 31.234436,
                        }
                    };
                    this.eventBus.emit("layer-flyClickTips", {
                        layer
                    }); //隐患缺陷图层定位

                    // itme.chartData = ProtectionDsdLayerChartData;
                    // this.eventBus.emit("graphic-clickTwoMenu-ProtectionDsdLayer", { itme });//电站曲线图
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


export default VectorLayer.extend(ProtectionDsdLayer());
