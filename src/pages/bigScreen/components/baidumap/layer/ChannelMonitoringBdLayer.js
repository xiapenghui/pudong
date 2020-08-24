// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import ChannelMonitoringBdData from "./ChannelMonitoringBdData";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
// import MapService from "../base/MapServiceUrl";

function ChannelMonitoringBdLayer() {//通道监拍-保电
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 通道监拍-保电");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-ChannelMonitoringBdLayer", this.onLayerVisible);//图层显示隐藏监听

                let data =  ChannelMonitoringBdData;//通道监拍-保电 数据
                let gs = [];
                
                for (let i = 0; i < data.length; i++) {
                    if (data[i].jd == undefined || data[i].jd == "") {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: i,
                            feature: new Feature({
                                id: i,
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
            graphicClickHandler({ pixel, point, graphic,map }) {//点击tips信息
                let itme = {
                    layerName: "ChannelMonitoringBdLayer",//图层名称
                    title: "通道监拍",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  线路名称、告警类型、告警事件、告警时间
                        // { 'type': '用户名称:', 'detail': graphic.feature.properties.yhmc},
                        { 'type': '线路名称:', 'detail': graphic.feature.properties.xlmc},
                        { 'type': '杆塔号:', 'detail': graphic.feature.properties.gth },
                        { 'type': '电压等级:', 'detail': graphic.feature.properties.dydj},
                        { 'type': '安装方向:', 'detail': graphic.feature.properties.azfx },
                    ],
                    button: [//按钮 type:类型  name:名称
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic,map, itme });
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
        }
    };
};


export default VectorLayer.extend(ChannelMonitoringBdLayer());
