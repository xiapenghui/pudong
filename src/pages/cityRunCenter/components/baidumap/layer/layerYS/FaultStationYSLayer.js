import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import FaultStationYSData from "./FaultStationYSData";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
import Point from "../../geometry/Point";
import DrivingRoute from "../../utils/DrivingRoute";//导航线路
import { wgs2bd } from "../../utils/Convert";//坐标转换

//演示图层-故障电站
function FaultStationYSLayer() {
    return {
        data() {
            return {};
        },
        props: {},
        methods: {
        },
        watch: {
            ready: function () {//121.62186901612826,31.199534181022717

                //this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.$on("graphic-click", this.faultTripTips);//点击tips信息监听
                this.eventBus.on("layer-clickBut-FaultStationYSLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("layer-visible-FaultStationYSLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("graphic-flyShowTips-FaultStationYSLayer", this.flyShowTips);//定位tips弹框

                let graphics = FaultStationYSData.map((data) => {
                    let point = wgs2bd(data.longitude, data.latitude);//世界大地坐标转为百度坐标
                    data.jd = point[0];
                    data.wd = point[1];
                    return new Graphic({
                        id: data.objId,
                        feature: new Feature({
                            id: data.objId,
                            geometry: new Point({
                                type: GEOMETRY_TYPE_POINT,
                                coordinates: [data.jd, data.wd]//[data.longitude, data.latitude]
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
                            flyLayer.faultTripTips({ pixel, point, graphic, map });
                        }, 1000)
                    } else {
                        this.eventBus.emit("graphic-ErrorTips", "定位失败,图层中没有该数据！");
                    }
                } else {
                    this.eventBus.emit("graphic-ErrorTips", "定位失败！！");
                }
            },
            faultTripTips({ pixel, point, graphic, map }) {//点击tips信息
                let itme = {
                    layerName: "FaultStationYSLayer",//演示图层-故障电站
                    title: "故障跳闸",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据 
                        { 'type': '设备名称:', 'detail': "蔡伦站" },
                        { 'type': '电压等级:', 'detail': "35kV" },
                        { 'type': '运维班组:', 'detail': "川沙变电中心站" },
                        { 'type': '跳闸设备:', 'detail': "伦 12 沈括" },
                        { 'type': '发生时间:', 'detail': "2019-05-28 07:05:36" },
                        { 'type': '影响范围:', 'detail': "伽利略路以西，蔡伦路以北，李冰路以南，影响高科苑" },
                        { 'type': '影响户数:', 'detail': "10户" },
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'ybb', 'name': '预报备(城运中心)' },
                        { 'type': 'znzd', 'name': '智能诊断' },
                        { 'type': 'video', 'name': '视频(城运中心)' },
                        { 'type': 'zndd', 'name': '智能调度' },
                    ]
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                let itme = {
                    layerName: "FaultStationYSLayer",//演示图层-故障电站
                    title: "故障电站",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据 
                        { 'type': '设备名称:', 'detail': graphic.feature.properties.name },
                        { 'type': '电压等级:', 'detail': graphic.feature.properties.voltage },
                        { 'type': '维护班组:', 'detail': graphic.feature.properties.team },
                    ]
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {
                let point = {//智能感知Buffer
                    jd: 121.621537,
                    wd: 31.195175
                }
                if (type == "znzd") {//智能诊断
                    this.eventBus.emit("layer-visible-IntelligentDeviceLayer", true);//智能装置
                    this.eventBus.emit("layer-visible-LineFz1Layer", true);//伦12沈括 线路
                    this.eventBus.emit("layer-visible-RepairPersonnelYSLayer", true);//抢修人员
                    this.eventBus.emit("layer-addPulseGraphic", { point });//脉冲 121.610732 31.191723
                    this.eventBus.emit("layer-visible-PulseLayer", true);//脉冲

                    this.eventBus.emit("layer-znddYpjg-show");//打开两边通道监拍
                    this.eventBus.emit("showVue-GzGjInfo");//打开地图下方告警
                }
                if (type == "zndd") {//智能调度
                    let gid = "";
                    this.eventBus.emit("layer-visible-onPersonnelLine", { point });//抢修人员 线路
                    this.eventBus.emit("layer-addLayer-BufferAreaLayer", { graphic, itme, type, point, gid });//缓冲区 
                    this.eventBus.emit("showVue-GzRyInfo");//左上人员信息 
                }
                if (type == "video") {//视频
                    this.eventBus.emit("showVue-GzVideoInfo");//视频 
                }
                if (type == "ybb") {//预报备
                    this.eventBus.emit("showVue-GzYbbInfo");//预报备 
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏 
                this.visible = !this.visible
            }
        }
    };
};


export default VectorLayer.extend(FaultStationYSLayer());
