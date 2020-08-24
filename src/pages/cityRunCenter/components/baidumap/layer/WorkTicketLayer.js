import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import WorkTicketData from "./WorkTicketData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function WorkTicketLayer() {//工作票
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 工作票");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-ConstructionSiteLayer", this.onLayerVisible);//图层显示隐藏监听 目前与施工现场监听一致
                this.eventBus.on("layer-clickBut-WorkTicketLayer", this.clickBut);//监听当前图层二级按钮
            }
        },
        methods: {
            ConstructionSite(list) {//图层渲染
                let data = list;// WorkTicketData;//工作票数据
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
            },
            graphicClickHandler({ pixel, point, graphic, map }) {//点击tips信息
                Console.debug("graphic click PowerStationLayer！", pixel.x, pixel.y, point.lng, point.lat, graphic.toJson());
                let itme = {
                    layerName: "WorkTicketLayer",//图层名称
                    title: "工作票",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  人员姓名、工作票分类、编号、开始时间、结束时间
                        { 'type': '人员姓名:', 'detail': graphic.feature.properties.personName },
                        { 'type': '工作票分类:', 'detail': graphic.feature.properties.ticketType },
                        { 'type': '编号:', 'detail': graphic.feature.properties.personId },
                        { 'type': '开始时间:', 'detail': graphic.feature.properties.workDate + " " + graphic.feature.properties.beginTime },
                        { 'type': '结束时间:', 'detail': graphic.feature.properties.workDate + " " + graphic.feature.properties.endTime },
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'queryGzp', 'name': '查看工作票' },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "queryGzp") {//查看工作票
                    let data = {
                        title: "工作票",
                        fileIds: graphic.feature.properties.fileIds
                    }
                    this.eventBus.emit("graphic-LunboInfo-showImg", data);
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
            this.$$utils.axiosRequest(MapService.getWorkTicketList + "&rangeType=today", '工作票汇总列表').then(result => {
                if (result.data.list.length == 0) {
                    Console.log("工作票数据null！");
                    return;
                }
                Console.debug("工作票数据：" + result.data.list.length);
                this.ConstructionSite(result.data.list);
            });
        }
    };
};


export default VectorLayer.extend(WorkTicketLayer());
