// import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import RepairPersonnelYSData from "./RepairPersonnelYSData";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
import Point from "../../geometry/Point";

//演示图层-抢修人员
function RepairPersonnelYSLayer() {//
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-RepairPersonnelYSLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("graphic-flyShowTips-RepairPersonnelYSLayer", this.flyShowTips);//定位tips弹框


                let data = RepairPersonnelYSData;//抢修人员数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].longitude == undefined || data[i].longitude == "") {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: data[i].id,
                            feature: new Feature({
                                id: data[i].id,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [data[i].longitude, data[i].latitude]
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
            flyShowTips({ pixel, layer, map }) {//定位tips弹框
                let point = layer.point;
               // canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位

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
                    layerName: "RepairPersonnelYSLayer",//图层名称
                    title: "抢修人员",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  线路名称、告警类型、告警事件、告警时间
                        { 'type': '名称:', 'detail': graphic.feature.properties.name },
                        { 'type': '专业:', 'detail': graphic.feature.properties.zy },
                        { 'type': '类别:', 'detail': graphic.feature.properties.lb },
                        { 'type': '联系方式:', 'detail': graphic.feature.properties.lxfs },
                        // { 'type': '工作完成量:', 'detail': graphic.feature.properties.zzwcl },
                        // { 'type': '完成工作数:', 'detail': graphic.feature.properties.wcgzs }
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'db', 'name': '4G连线' },
                        // { 'type': 'pd', 'name': '派单' },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
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
            // this.$$utils.axiosRequest(MapService.getTodayWarnMessageList, '获取今日告警消息列表').then(result => {
            //     if (result.data.list.length == 0) {
            //         Console.log("今日告警消息口数据null！");
            //         return;
            //     }
            //     Console.debug("今日告警消息数据：" + result.data.list.length);
            //     this.PowerStation(result.data.list);
            // });
        }
    };
};


export default VectorLayer.extend(RepairPersonnelYSLayer());
