import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import IntelligentCoverData from "./IntelligentCoverData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function IntelligentCoverLayer() {//智能井盖
    return {
        data() {
            return {
            };
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 智能井盖");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-IntelligentCoverLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-IntelligentCoverLayer", this.clickBut);//监听当前图层二级按钮
            }
        },
        methods: {
            IntelligentCover(list) {//图层渲染
                let data = list//IntelligentCoverData;//智能井盖数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].lon == undefined || data[i].lon == "") {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: data[i].primaryId,
                            feature: new Feature({
                                id: data[i].primaryId,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [data[i].lon, data[i].lat]
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
            graphicClickHandler({ pixel, point, graphic,map }) {//点击tips信息
                Console.debug("graphic click PowerStationLayer！", pixel.x, pixel.y, point.lng, point.lat, graphic.toJson());
                let itme = {
                    layerName: "IntelligentCoverLayer",//图层名称
                    title: "智能井盖",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  井盖名称、所属公司、运维人员、联系方式
                        { 'type': '井盖名称:', 'detail': graphic.feature.properties.name },
                        { 'type': '所属公司:', 'detail': "" },
                        { 'type': '运维人员:', 'detail': "" },
                        { 'type': '联系方式:', 'detail': "" },
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'chart', 'name': '查看曲线' },
                        // { 'type': 'query', 'name': '周边查询' },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic,map, itme });
            },
            clickBut({graphic,itme,type }) {//图层二级按钮
                if (type == "chart") {//查看曲线
                    //&deviceId=5bd6be2d21dcd82a9b2021ab&startTime=2019-05-01 00:00:00&endTime=2019-05-20 23:59:59
                    this.$$utils.axiosRequest(MapService.getCollectionDataList+"&deviceId="+graphic.feature.properties.primaryId+"&startTime=2019-05-01 00:00:00&endTime=2019-05-20 23:59:59", '井盖曲线信息').then(result => {
                        if (result.data.page.list.length == 0) {
                            Console.log("井盖曲线信息接口数据null！");
                            this.eventBus.emit("graphic-ErrorTips", "暂无曲线数据！！");
                            return;
                        }
                        itme.chartList=result.data.page.list;//曲线图数据
                        itme.twoTitle="曲线图";//曲线图数据
                        this.eventBus.emit("graphic-clickTwoMenu-IntelligentCoverChart", {itme});//井盖曲线图
                    });
                } else if (type == "query") {//周边查询
                    this.eventBus.emit("graphic-ErrorTips", "暂无功能！！");
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
            this.$$utils.axiosRequest(MapService.getDeviceList, '智能井盖列表').then(result => {
                if (result.data.page.list.length == 0) {
                    Console.log("井盖接口数据null！");
                    return;
                }
                Console.debug("井盖接口数据：" + result.data.page.list.length);
                this.IntelligentCover(result.data.page.list);
            });

            //&deviceId=5bd6be2d21dcd82a9b2021ab&startTime=2019-05-01 00:00:00&endTime=2019-05-20 23:59:59
            // this.$$utils.axiosRequest(MapService.getCollectionDataList+"&deviceId=5bd6be2d21dcd82a9b2021ab&startTime=2019-05-01 00:00:00&endTime=2019-05-10 23:59:59", '智能井盖历史采集信息').then(result => {
            //     if (result.data.page.list.length == 0) {
            //         Console.log("井盖接口数据null！");
            //         return;
            //     }
            //     Console.debug("井盖接口数据：" + result.data.page.list.length);
            //     this.IntelligentCover(result.data.page.list);
            // });
        }
    };
};


export default VectorLayer.extend(IntelligentCoverLayer());
