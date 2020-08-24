// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
// import PowerStationData from "./PowerStationData";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
// import MapService from "../base/MapServiceUrl";
import {wgs2bd} from "../utils/Convert";//坐标转换

function PowerStationLayer110kv() {//电站-110kv
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 电站");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-PowerStationLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-data-PowerStationLayer110kvService", this.PowerStation);//通过10kv图层拿数据
                this.eventBus.on("graphic-flyShowTips-PowerStationLayer110kv", this.flyShowTips);//定位tips弹框

            }
        },
        methods: {
            PowerStation(list) {//图层渲染
                let data = list;// PowerStationData;//电站数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].longitude == undefined || data[i].longitude == "") {
                        continue;
                    }
                    if (data[i].voltage == "交流110kV" || data[i].voltage == "直流110kV") {
                        let point=wgs2bd(data[i].longitude,data[i].latitude);//世界大地坐标转为百度坐标
                        data[i].jd=point[0];
                        data[i].wd=point[1];
                        gs.push(
                            new Graphic({
                                id: data[i].objId,
                                feature: new Feature({
                                    id: data[i].objId,
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
                }
                this.addGraphics(gs);
                this.refresh();
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
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                let itme = {
                    layerName: "PowerStationLayer110kv",//图层名称
                    title: "电站",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据 
                        { 'type': '设备名称:', 'detail': graphic.feature.properties.name },
                        { 'type': '电压等级:', 'detail': graphic.feature.properties.voltage },
                        { 'type': '维护班组:', 'detail': graphic.feature.properties.team },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
            // this.$$utils.axiosRequest(MapService.getTAqfhStationInfoList, '电站列表').then(result => {
            //     if (result.data.list.length == 0) {
            //         Console.log("电站接口数据null！");
            //         return;
            //     }
            //     Console.debug("电站数据：" + result.data.list.length);
            //     this.PowerStation(result.data.list);
            // });
        }
    };
};


export default VectorLayer.extend(PowerStationLayer110kv());
