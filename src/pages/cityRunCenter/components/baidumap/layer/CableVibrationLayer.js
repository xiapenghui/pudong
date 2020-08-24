import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import CableVibrationData from "./CableVibrationData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function CableVibrationLayer() {//电缆振动
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 电缆振动");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-CableVibrationLayer", this.onLayerVisible);//图层显示隐藏监听

                let data =  CableVibrationData;//电缆振动数据
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
            // PowerStation(list) {//图层渲染
            //     let data = list;// CableVibrationData;//电缆振动数据
            //     let gs = [];
            //     for (let i = 0; i < data.length; i++) {
            //         if (data[i].longitude == undefined || data[i].longitude == "") {
            //             continue;
            //         }
            //         gs.push(
            //             new Graphic({
            //                 id: data[i].objId,
            //                 feature: new Feature({
            //                     id: data[i].objId,
            //                     geometry: new Point({
            //                         type: GEOMETRY_TYPE_POINT,
            //                         coordinates: [data[i].longitude, data[i].latitude]
            //                     }),
            //                     properties: Object.assign({
            //                     }, data[i])
            //                 }),
            //                 symbol: {
            //                     type: NONE_SYMBOL
            //                 }
            //             })
            //         );
            //     }
            //     this.addGraphics(gs);
            //     this.refresh();
            // },
            graphicClickHandler({ pixel, point, graphic,map }) {//点击tips信息
                Console.debug("graphic click CableVibrationLayer", pixel.x, pixel.y, point.lng, point.lat, graphic.toJson());
                let itme = {
                    layerName: "CableVibrationLayer",//图层名称
                    title: "电缆振动",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  线路名称、告警类型、告警事件、告警时间
                        { 'type': '线路名称:', 'detail': ""},
                        { 'type': '告警类型:', 'detail': "" },
                        { 'type': '告警事件:', 'detail': graphic.feature.properties.title },
                        { 'type': '告警时间:', 'detail': "" },
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


export default VectorLayer.extend(CableVibrationLayer());
