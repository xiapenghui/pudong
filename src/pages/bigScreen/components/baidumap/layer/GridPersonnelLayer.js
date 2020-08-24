import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import GridPersonnelData from "./GridPersonnelData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function GridPersonnelLayer() {//网格化人员
    return {
        data() {
            return {
                getWgywPersonList: null,//网格化-人员数据
                personnelAll: null,//所有人员数据
            };
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 网格化人员");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-GridPersonnelLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-GridPersonnelLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("graphic-flyShowTips-GridPersonnelLayer", this.flyShowTips);//定位tips弹框

                this.loadData();
            }
        },
        methods: {
            GridPersonnel(list) {//图层渲染
                // if (this.personnelAll.length > 0) {//4G单兵数据-网格化人员数据合并
                //     for (let i = 0; i < list.length; i++) {
                //         for (let j = 0; j < this.personnelAll.length; j++) {
                //             if (this.personnelAll[j].detailSource == "01" && list[i].entity_name == this.personnelAll[j].user_id) {//网格化 
                //                 list[i].dbItme = this.personnelAll[j];
                //             }
                //         }
                //     }
                // }
                if (list.length == 0) {
                    return;
                }

                let data = list;//HiddenHefectsData;//网格化人员数据
                let gs = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].realtime_point.location.length == 0) {
                        continue;
                    }
                    gs.push(
                        new Graphic({
                            id: data[i].entity_name,
                            feature: new Feature({
                                id: data[i].entity_name,
                                geometry: new Point({
                                    type: GEOMETRY_TYPE_POINT,
                                    coordinates: [data[i].realtime_point.location[0], data[i].realtime_point.location[1]]
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
                            canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位
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
                    but.push({ 'type': 'jrgz', 'name': '今日工作' });
                    but.push({ 'type': 'lsgj', 'name': '历史轨迹' });
                    but.push({ 'type': 'db', 'name': '4G单兵' });
                } else {
                    but.push({ 'type': 'jrgz', 'name': '今日工作' });
                    but.push({ 'type': 'lsgj', 'name': '历史轨迹' });
                   // but.push({ 'type': 'db', 'name': '4G单兵' });
                }

                let itme = {
                    layerName: "GridPersonnelLayer",//图层名称
                    title: "网格化运维",//tips标题
                    type: "",//tips展示类型
                    data: [//tips数据  队伍名称、专业、联系电话
                        { 'type': '人员名称:', 'detail': graphic.feature.properties.user_name },
                        { 'type': '专业:', 'detail': graphic.feature.properties.dept_name },
                        { 'type': '联系电话:', 'detail': "" },
                    ],
                    button: but
                    // [//按钮 type:类型  name:名称
                    //     { 'type': 'jrgz', 'name': '今日工作' },
                    //     { 'type': 'lsgj', 'name': '历史轨迹' },
                    // ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "jrgz") {//今日工作
                    let id = graphic.id;
                    this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getPersonInfo?id=' + id + '', '网格化运维-获取人员信息').then(result => {
                        if (result.data.length > 0) {
                            itme.twoTitle = "今日工作";
                            itme.detail = [//今日工作 result.data[0].professional_name
                                { 'type': '部门:', 'detail': result.data[0].dept_name },
                                { 'type': '人员名称:', 'detail': result.data[0].full_name },
                                { 'type': '专业名称:', 'detail': result.data[0].professional_name },
                                { 'type': '班组名称:', 'detail': result.data[0].working_team_name },
                                { 'type': '在线时长:', 'detail': result.data[0].online_times },
                                { 'type': '离线时长:', 'detail': result.data[0].offline_times },
                                { 'type': '今日里程:', 'detail': result.data[0].distance + "(米)" },
                            ];
                            this.eventBus.emit("graphic-clickTwoMenu-GridPersonnelWork", { itme });//详情
                        } else {
                            this.eventBus.emit("graphic-ErrorTips", "该人员暂无工作信息！");
                        }
                    });
                }
                if (type == "lsgj") {//历史轨迹
                    let us_id = graphic.feature.properties.entity_name;
                    let day = new Date();
                    let time = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                    let startTime = time + " 00:00:00";
                    let endTime = time + " 23:59:59"
                    // let usid = result.data.page.list[0].user_id + "," + result.data.page.list[1].user_id;

                    this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getPersonTrace?id=' + us_id + '&startTime=' + startTime + '&endTime=' + endTime + '', '网格化运维-人员轨迹').then(result => {
                        if (result.data.points.length > 0) {//有轨迹数据
                            this.eventBus.emit("layer-addLayer-GridPersonnelTrajectoryLayer", result.data);
                        } else {
                            this.eventBus.emit("graphic-ErrorTips", "该人员暂无轨迹信息！");
                        }
                    });
                }
                if (type == "db") {//单兵
                    //let deviceNo=graphic.feature.properties.dbItme.deviceAccount;//单兵设备账号
                   // let url = "/common-assets/plugins/singlePawn/singlePawn.html?deviceNo=501000000000000036";
                    let url = "/common-assets/plugins/singlePawn/singlePawn.html?deviceNo=501000000000000099";
                    this.eventBus.emit("showVue-SinglePawn", url);
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            },
            loadData : function(){
                this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getOnlinePeopleLocations', '网格化运维-所有人员在线位置').then(result => {
                    if (result.data.length == 0) {
                        Console.log("网格化运维-所有人员在线位置数据null！");
                        return;
                    }
                    Console.debug("网格化运维-所有人员在线位置数据：" + result.data.length);

                    this.removeAll();
                    this.GridPersonnel(result.data);
                });

            }
        },
        created() {

            // this.$$utils.axiosRequest('/pdaqfh_Web_exploded/a/pdaqfh/taqfhUserInfo/getTaqfhUserInfoList', '获取全部用户信息列表单兵').then(result => {
            //     if (result.list.length == 0) {
            //         Console.log("获取全部用户信息列表单兵-数据null！");
            //         return;
            //     }
            //     Console.debug("获取全部用户信息列表单兵：" + result.list.length);

                // this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getOnlinePeopleLocations', '网格化运维-所有人员在线位置').then(result => {
                //     if (result.data.length == 0) {
                //         Console.log("网格化运维-所有人员在线位置数据null！");
                //         return;
                //     }
                //     Console.debug("网格化运维-所有人员在线位置数据：" + result.data.length);

                //     this.GridPersonnel(result.data);
                // });

            //     this.personnelAll = null;
            //     this.personnelAll = result.list;//获取全部用户信息列表单兵
            //     this.eventBus.emit("layer-getTaqfhUserInfoList-PersonnelAll", this.personnelAll);//获取全部用户信息
            // });


            

            // this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/sjafpt/monitorDevice', '线缆断线列表').then(result => {
            //     
            // });

            // this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/sjafpt/lineDevice', '线缆断线-线路设备列表').then(result => {
            //     
            // });





            // this.$$utils.axiosRequest('/pdaqfh_Web_exploded/a/pdaqfh/taqfhUserInfo/getTaqfhUserInfoList', '获取全部用户信息列表单兵').then(result => {
            //     if (result.list.length == 0) {
            //         Console.log("获取全部用户信息列表单兵-数据null！");
            //         return;
            //     }
            //     Console.debug("获取全部用户信息列表单兵：" + result.list.length);

            //     this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getWgywPersonList?isOnline=true&offset=0&limit=1000', '网格化运维-人员数据').then(result => {
            //         if (result.data.page.list.length == 0) {
            //             Console.log("网格化运维-人员数据null！");
            //             return;
            //         }
            //         Console.debug("网格化运维-人员数据：" + result.data.page.list.length);
            //         this.getWgywPersonList = null;
            //         this.getWgywPersonList = result.data.page.list;//网格化运维-人员数据

            //         this.$$utils.axiosRequest('/pdaqfh_war_exploded/f/wgyw/getOnlinePeopleLocations', '网格化运维-所有人员在线位置').then(result => {
            //             if (result.data.length == 0) {
            //                 Console.log("网格化运维-所有人员在线位置数据null！");
            //                 return;
            //             }
            //             Console.debug("网格化运维-所有人员在线位置数据：" + result.data.length);
            //             this.GridPersonnel(result.data);
            //         });
            //     });

            //     this.personnelAll = result.list;//获取全部用户信息列表单兵
            // });

        }
    };
};


export default VectorLayer.extend(GridPersonnelLayer());
