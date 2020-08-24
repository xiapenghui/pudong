import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import HouseholdTableData from "./HouseholdTableData";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
import Point from "../../geometry/Point";
import DrivingRoute from "../../utils/DrivingRoute";//导航线路
import { wgs2bd } from "../../utils/Convert";//坐标转换

//演示图层-户表
function HouseholdTableLayer() {
    return {
        data() {
            return {};
        },
        props: {},
        methods: {
        },
        watch: {
            ready: function () {//121.602863 31.193731

                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-HouseholdTableLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-HouseholdTableLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("graphic-flyShowTips-HouseholdTableLayer", this.flyShowTips);//定位tips弹框

                let graphics = HouseholdTableData.map((data) => {
                    return new Graphic({
                        id: data.objId,
                        feature: new Feature({
                            id: data.objId,
                            geometry: new Point({
                                type: GEOMETRY_TYPE_POINT,
                                coordinates: [data.longitude, data.latitude]
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
                    layerName: "HouseholdTableLayer",//演示图层-故障电站
                    title: "HPHL户表失电",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据 
                        { 'type': '用户户号:', 'detail': "0060351731" },
                        { 'type': '智能表号:', 'detail': "110000366519" },
                        { 'type': '用户名称:', 'detail': "盛卫明" },
                        { 'type': '用电地址:', 'detail': "高斯路 986弄 16号 101室" },
                        { 'type': '采集点名称:', 'detail': "古桐四村乙_10kV变压器采集点" },
                        { 'type': '失电时间:', 'detail': "2019-05-28 12:54:23" },
                        // { 'type': '设备名称:', 'detail': graphic.feature.properties.name },
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'hb_znzd', 'name': '智能诊断' },
                        { 'type': 'hb_zndd', 'name': '智能调度' },
                        { 'type': 'hb_ytzyh', 'name': '预通知用户' },
                    ]
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if(type=="hb_znzd"){//智能诊断
                    this.eventBus.emit("showVue-HplcZnzdInfo", );
                }
                if(type=="hb_ytzyh"){//预通知用户
                    this.eventBus.emit("showVue-HplcDxnrInfo", );
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏 
                this.visible = !this.visible
            }
        }
    };
};


export default VectorLayer.extend(HouseholdTableLayer());
