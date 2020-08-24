// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
// import IntelligentCoverBdData from "./IntelligentCoverBdData";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";
import { wgs2bd } from "../utils/Convert";//坐标转换
import * as backApiData from "../../../../bigScreen/api/backApiData.js";
//演示图层-智能井盖
function IntelligentCoverBdLayer() {
    return {
        data() {
            return {
            };
        },
        props: {},
        watch: {
            ready: function () {
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-clickBut-IntelligentCoverBdLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("layer-visible-IntelligentCoverBdLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("graphic-flyShowTips-IntelligentCoverBdLayer", this.flyShowTips);//定位tips弹框

                // let data = IntelligentCoverYSData//智能井盖数据
                // let gs = [];
                // for (let i = 0; i < data.length; i++) {
                //     if (data[i].lon == undefined || data[i].lon == "") {
                //         continue;
                //     }
                //     gs.push(
                //         new Graphic({
                //             id: data[i].primaryId,
                //             feature: new Feature({
                //                 id: data[i].primaryId,
                //                 geometry: new Point({
                //                     type: GEOMETRY_TYPE_POINT,
                //                     coordinates: [data[i].lon, data[i].lat]
                //                 }),
                //                 properties: Object.assign({
                //                 }, data[i])
                //             }),
                //             symbol: {
                //                 type: NONE_SYMBOL
                //             }
                //         })
                //     );
                // }
                // this.addGraphics(gs);
                // this.refresh();
            }
        },
        methods: {
            IntelligentCoverBdLayer(list) {//图层渲染
                let data = list;//IntelligentCoverYSData;//智能井盖数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].lon == undefined || data[i].lon == "") {
                        continue;
                    }
                    let point = wgs2bd(data[i].lon, data[i].lat);//世界大地坐标转为百度坐标
                    data[i].jd = point[0];
                    data[i].wd = point[1];
                    gs.push(
                        new Graphic({
                            id: data[i].uid,
                            feature: new Feature({
                                id: data[i].uid,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [data[i].jd, data[i].wd]//[data[i].lon, data[i].lat]
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
                        if (graphicList[i].feature.properties.id == layer.id) {
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
                    layerName: "IntelligentCoverBdLayer",//图层名称
                    title: "智能井盖",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  井盖名称、所属公司、运维人员、联系方式
                        { 'type': '井盖名称:', 'detail': graphic.feature.properties.name },
                        { 'type': '线路名称:', 'detail': graphic.feature.properties.channelName },
                        //{ 'type': '所属公司:', 'detail': "上海浦东电力有限公司" },
                        { 'type': '井盖地址:', 'detail': graphic.feature.properties.address },
                        { 'type': '监测状态:', 'detail': "正常" },
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'chart', 'name': '查看曲线' },
                        // { 'type': 'query', 'name': '周边查询' },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "chart") {//查看曲线
                    let day = new Date();
                    day.setTime(day.getTime() - 24 * 60 * 60 * 1000);
                    let Yesterday = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();//昨天

                    let day1 = new Date();
                    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000 * 30);
                    let FrontDay = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();//前30天

                    //&deviceId=5bd6be2d21dcd82a9b2021ab&startTime=2019-05-01 00:00:00&endTime=2019-05-20 23:59:59
                    this.$$utils.axiosRequest(MapService.getCollectionDataList + "&deviceId=" + graphic.feature.properties.primaryId + "&startTime=" + FrontDay + " 00:00:00&endTime=" + Yesterday + " 23:59:59", '井盖曲线信息').then(result => {
                        if (result.data.page.list.length == 0) {
                            this.eventBus.emit("graphic-ErrorTips", "暂无曲线数据！！");
                            return;
                        }
                        itme.chartList = result.data.page.list;//曲线图数据
                        itme.twoTitle = "曲线图";//曲线图数据
                        this.eventBus.emit("graphic-clickTwoMenu-IntelligentCoverChart", { itme });//井盖曲线图
                    });
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            },
			// 智能井盖列表
			znjgList(){
				let params={
					pmsIds:"FF000000-0000-0050-0000-000000001300-18751,FF000000-0000-0050-0000-000000001300-18736,FF000000-0000-0050-0000-000000001300-18907,FF000000-0000-0050-0000-000000001300-03688,FF000000-0000-0050-0000-000000001300-14871,FF000000-0000-0050-0000-000000001300-20286",
				     offset:"0",
					 limit:"-1"
				};
				backApiData.getznjgNumber(params).then(result=>{
					if (result.data.data.page.list.length == 0) {
					        Console.log("井盖接口数据null！");
					        return;
					    }
					 Console.debug("井盖接口数据：" + result.data.data.page.list.length);
					 this.IntelligentCoverBdLayer(result.data.data.page.list);
				})
			}
        },
		mounted(){
			this.znjgList()
		},
        created() {
        }
    };
};


export default VectorLayer.extend(IntelligentCoverBdLayer());
