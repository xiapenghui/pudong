import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import ConstructionSiteData from "./ConstructionSiteData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function ConstructionSiteLayer() {//施工现场
    return {
        data() {
            return {
                personnelAll: null,//所有人员数据
            };
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 施工现场");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-ConstructionSiteLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-ConstructionSiteLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("graphic-flyShowTips-ConstructionSiteLayer", this.flyShowTips);//定位tips弹框

            }
        },
        methods: {
            ConstructionSite(list) {//图层渲染

                // if (this.personnelAll.length > 0) {//4G单兵数据-施工人员合并
                //     for (let i = 0; i < list.length; i++) {
                //         for (let j = 0; j < this.personnelAll.length; j++) {
                //             if (this.personnelAll[j].detailSource == "02" && list[i].personId == this.personnelAll[j].personId) {//施工人员 
                //                 list[i].dbItme = this.personnelAll[j];
                //             }
                //         }
                //     }
                // }
                if (list.length == 0) {
                    return;
                }

                let data = list; //ConstructionSiteData;//施工现场数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].longitude == undefined || data[i].longitude == "") {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: data[i].personName,
                            feature: new Feature({
                                id: data[i].personName,
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
                let but = [];//按钮 type:类型  name:名称
                if (graphic.feature.properties.dbItme != null && graphic.feature.properties.dbItme != undefined) {//带单兵
                    but.push({ 'type': 'lsgj', 'name': '历史轨迹' });
                    but.push({ 'type': 'gzrw', 'name': '工作任务' });
                    but.push({ 'type': 'db', 'name': '4G单兵' });
                } else {
                    but.push({ 'type': 'lsgj', 'name': '历史轨迹' });
                    but.push({ 'type': 'gzrw', 'name': '工作任务' });
                }

                let itme = {
                    layerName: "ConstructionSiteLayer",//图层名称
                    title: "施工现场",//tips标题
                    type: "",//tips展示类型 
                    data: [//tips数据  人员姓名、工作票分类、编号、开始时间、结束时间
                        { 'type': '人员姓名:', 'detail': graphic.feature.properties.personName },
                        { 'type': '工作票分类:', 'detail': graphic.feature.properties.ticketType },
                        { 'type': '编号:', 'detail': graphic.feature.properties.personId },
                        { 'type': '开始时间:', 'detail': graphic.feature.properties.workDate + " " + graphic.feature.properties.beginTime },
                        { 'type': '结束时间:', 'detail': graphic.feature.properties.workDate + " " + graphic.feature.properties.endTime },
                    ],
                    button: but
                    // [//按钮 type:类型  name:名称
                    //     { 'type': 'lsgj', 'name': '历史轨迹' },
                    //     { 'type': 'gzrw', 'name': '工作任务' },
                    // ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "lsgj") {//历史轨迹
                    let ryId = graphic.feature.properties.personId;
                    this.$$utils.axiosRequest(MapService.getOnlineHistoryTrack + "personId=" + ryId + "", '施工现场-人员历史轨迹').then(result => {
                        if (result.data.length == 0 || result.data[0].points == undefined) {
                            this.eventBus.emit("graphic-ErrorTips", "施工现场-历史轨迹数据null！");
                            //Console.debug("施工现场-历史轨迹数据null！");
                            return;
                        }

                        let data = [];
                        for (let i = 0; i < result.data.length; i++) {
                            if (result.data[i].points.length > 0) {
                                data.push(result.data[i]);
                            }
                        }

                        if (data.length > 0) {//有轨迹数据
                            this.eventBus.emit("layer-addLayer-ConstructionTrajectoryLayer", data);
                        } else {
                            this.eventBus.emit("graphic-ErrorTips", "暂无施工人员轨迹！！");
                        }
                    });
                }
                if (type == "gzrw") {//工作任务
                    let ryid = graphic.feature.properties.personId;
                    this.$$utils.axiosRequest("/pdaqfh_Web_exploded/f/sggk/getWorkTicketDetail?personId=" + ryid + "", '施工现场-人员工作任务').then(result => {
                        if (result.data.fileIds.length > 0) {
                            let data = {
                                title: "施工现场-工作票",
                                fileIds: result.data.fileIds
                            }
                            this.eventBus.emit("graphic-LunboInfo-showImg", data);
                        } else {
                            this.eventBus.emit("graphic-ErrorTips", "工作任务");
                        }
                    });
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            },
            // PersonnelAll(data) {
            //     this.personnelAll = null;
            //     this.personnelAll = data;

            //     this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=supervisor", '施工现场-查岗人员').then(result => {
            //         if (result.data.list == 0) {
            //             Console.debug("施工现场-查岗人员数据null！");
            //             return;
            //         }
            //         Console.debug("施工现场-查岗人员数据：" + result.data.list.length);
            //         this.ConstructionSite(result.data.list);
            //     });
            //     this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=manage", '施工现场-管理人员').then(result => {
            //         if (result.data.list == 0) {
            //             Console.debug("施工现场-管理人员数据null！");
            //             return;
            //         }
            //         Console.debug("施工现场-管理人员数据：" + result.data.list.length);
            //         this.ConstructionSite(result.data.list);
            //     });
            //     this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=wkapprover", '施工现场-工作许可人').then(result => {
            //         if (result.data.list == 0) {
            //             Console.debug("施工现场-工作许可人数据null！");
            //             return;
            //         }
            //         Console.debug("施工现场-工作许可人数据：" + result.data.list.length);
            //         this.ConstructionSite(result.data.list);
            //     });
            //     this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=wkresponser", '施工现场-工作负责人').then(result => {
            //         if (result.data.list == 0) {
            //             Console.debug("施工现场-工作负责人数据null！");
            //             return;
            //         }
            //         Console.debug("施工现场-工作负责人数据：" + result.data.list.length);
            //         this.ConstructionSite(result.data.list);
            //     });
            // }
        },
        created() {
            //this.eventBus.on("layer-getTaqfhUserInfoList-PersonnelAll", this.PersonnelAll);//监听全部人员接口
            this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=supervisor", '施工现场-查岗人员').then(result => {
                if (result.data.list == 0) {
                    Console.debug("施工现场-查岗人员数据null！");
                    return;
                }
                Console.debug("施工现场-查岗人员数据：" + result.data.list.length);
                this.ConstructionSite(result.data.list);
            });
            this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=manage", '施工现场-管理人员').then(result => {
                if (result.data.list == 0) {
                    Console.debug("施工现场-管理人员数据null！");
                    return;
                }
                Console.debug("施工现场-管理人员数据：" + result.data.list.length);
                this.ConstructionSite(result.data.list);
            });
            this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=wkapprover", '施工现场-工作许可人').then(result => {
                if (result.data.list == 0) {
                    Console.debug("施工现场-工作许可人数据null！");
                    return;
                }
                Console.debug("施工现场-工作许可人数据：" + result.data.list.length);
                this.ConstructionSite(result.data.list);
            });
            this.$$utils.axiosRequest(MapService.getCurConstructorList + "&personType=wkresponser", '施工现场-工作负责人').then(result => {
                if (result.data.list == 0) {
                    Console.debug("施工现场-工作负责人数据null！");
                    return;
                }
                Console.debug("施工现场-工作负责人数据：" + result.data.list.length);
                this.ConstructionSite(result.data.list);
            });
        }
    };
};


export default VectorLayer.extend(ConstructionSiteLayer());
