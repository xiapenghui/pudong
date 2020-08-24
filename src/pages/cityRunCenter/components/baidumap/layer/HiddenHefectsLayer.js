import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import HiddenHefectsData from "./HiddenHefectsData"
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";

function HiddenHefectsLayer() {//隐患缺陷
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 隐患缺陷");
                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-HiddenHefectsLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-clickBut-HiddenHefectsLayer", this.clickBut);//监听当前图层二级按钮
                this.eventBus.on("graphic-flyShowTips-HiddenHefectsLayer", this.flyShowTips);//定位tips弹框

            }
        },
        methods: {
            HiddenHefects(list) {//图层渲染
                let data = list;//HiddenHefectsData;//隐患缺陷数据
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
                Console.debug("graphic click PowerStationLayer！", pixel.x, pixel.y, point.lng, point.lat, graphic.toJson());
                let itme = {
                    layerName: "HiddenHefectsLayer",//图层名称
                    title: "隐患缺陷",//tips标题
                    type: "",//tips展示类型 
                    data: [//tips数据  发现人、发现时间、情况描述
                        { 'type': '发现人:', 'detail': graphic.feature.properties.verify_by },
                        { 'type': '发现时间:', 'detail': graphic.feature.properties.create_on },
                        { 'type': '情况描述:', 'detail': graphic.feature.properties.remark },
                    ],
                    button: [//按钮 type:类型  name:名称
                        { 'type': 'detail', 'name': '详情' },
                        { 'type': 'fj', 'name': '附件' },
                    ],
                }
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic, map, itme });
            },
            clickBut({ graphic, itme, type }) {//图层二级按钮
                if (type == "detail") {//查看详情
                    // 单据类别（隐患/缺陷）、危险程度（一般/严重/危急）、
                    // 性质、电压等级、设备名称、线路描述、情况描述、地址、审核人、审核时间
                    itme.twoTitle = "隐患缺陷详情";
                    itme.detail = [//详情数据
                        { 'type': '单据类别:', 'detail': graphic.feature.properties.bug_type_name },
                        { 'type': '危险程度:', 'detail': graphic.feature.properties.bug_property_name },
                        { 'type': '性质:', 'detail': graphic.feature.properties.bug_class_name },
                        { 'type': '电压等级:', 'detail': graphic.feature.properties.voltage_class_name },
                        { 'type': '设备名称:', 'detail': graphic.feature.properties.device_name },
                        { 'type': '线路名称:', 'detail': graphic.feature.properties.line_name },
                        { 'type': '情况描述:', 'detail': graphic.feature.properties.remark },
                        { 'type': '地址:', 'detail': graphic.feature.properties.create_address },
                        { 'type': '审核人:', 'detail': graphic.feature.properties.verify_by },
                        { 'type': '审核时间:', 'detail': graphic.feature.properties.create_on },
                    ];
                    this.eventBus.emit("graphic-clickTwoMenu-HiddenHefectsDetail", { itme });//详情
                };
                if (type == "fj") {//查看附件
                    let id=graphic.feature.properties.id;
                    this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/wgyw/getBugPicture?id='+id+'', '隐患缺陷-附件').then(result => {
                        if (result.data.length > 0) {
                            let imgUrl = [];
                            for (let i = 0; i < result.data.length; i++) {
                                if (result.data[i].file_path.length > 0) {
                                    imgUrl.push("http://pddl.yungcloud.cn" + result.data[i].file_path);
                                }
                            }
                            if (imgUrl.length > 0) {
                                let data = {
                                    title: "隐患缺陷-附件",
                                    //fileIds: ["http://pddl.yungcloud.cn/upload/2019/06/25/1561453719840.png"],
                                    fileIds: imgUrl
                                }
                                this.eventBus.emit("graphic-LunboInfo-showImg", data);
                            } else {
                                this.eventBus.emit("graphic-ErrorTips", "暂无图片！！");
                            }
                        }
                    });
                }
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        },
        created() {
            this.$$utils.axiosRequest(MapService.getBugList + "&rangeType=today", '隐患缺陷').then(result => {
                if (result.data.page.list.length == 0) {
                    Console.log("隐患缺陷数据null！");
                    return;
                }
                Console.debug("隐患缺陷数据：" + result.data.page.list.length);
                this.HiddenHefects(result.data.page.list);
            });

            // this.$$utils.axiosRequest('/pdaqfh_Web_exploded/f/wgyw/getBugPicture?id=115669', '隐患缺陷-附件').then(result => {
            //     debugger
            // });
        }
    };
};


export default VectorLayer.extend(HiddenHefectsLayer());
