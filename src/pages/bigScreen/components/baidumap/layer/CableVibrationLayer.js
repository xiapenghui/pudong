// import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import CableVibrationData from "./CableVibrationData";
import { GEOMETRY_TYPE_POINT } from "../geometry/Geometry";
import Point from "../geometry/Point";
import MapService from "../base/MapServiceUrl";
import * as backApiData from "../../../../bigScreen/api/backApiData.js";

function CableVibrationLayer() {//电缆振动
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run 电缆振动");
                this.eventBus.on("layer-addLayer-CableVibrationLayer", this.resData);//监听电缆振动告警数据

                this.$on("graphic-click", this.graphicClickHandler);//点击tips信息监听
                this.eventBus.on("layer-visible-CableVibrationLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("graphic-flyShowTips-CableVibrationLayer", this.flyShowTips);//定位tips弹框

               


				// let data =  CableVibrationData;//电缆振动数据
				// let gs = [];
				// for (let i = 0; i < data.length; i++) {
				//     if (data[i].longitude == undefined || data[i].longitude == "") {
				//         continue;
				//     }
				//     gs.push(
				//         new Graphic({
				//             id: data[i].id,
				//             feature: new Feature({
				//                 id: data[i].id,
				//                 geometry: new Point({
				//                     type: GEOMETRY_TYPE_POINT,
				//                     coordinates: [data[i].longitude, data[i].latitude]
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
				//  this.addGraphics(gs);
				//  this.refresh();
			}
		},
		methods: {
			resData(type) {
				if (type) {
					let params = {
						types: 'das_alarm',
						rangeType: 'today'
					};
					backApiData.getjrgj(params).then(result => {
						if (result.data.data.list.length == 0) {
							Console.log("今日告警消息口数据null！");
							return;
						}
						Console.debug("今日告警消息数据：" + result.data.data.list.length);
						this.CableVibration(result.data.data.list); //图层渲染
					})

					// this.$$utils.axiosRequest(
					// 	"/pdaqfh_war_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList?types=das_alarm&rangeType=today",
					// 	'获取今日告警消息列表').then(result => {
					// 	if (result.data.list.length == 0) {
					// 		Console.log("今日告警消息口数据null！");
					// 		return;
					// 	}
					// 	Console.debug("今日告警消息数据：" + result.data.list.length);
					// 	this.CableVibration(result.data.list); //图层渲染
					// });
				}
				//this.eventBus.emit("layer-addLayer-CableVibrationLayer", true);//光纤振动
			},
			CableVibration(list) { //图层渲染
				let data = list; //CableVibrationData;//电缆振动数据
				let gs = [];
				for (let i = 0; i < data.length; i++) {
					if (data[i].longitude == undefined || data[i].longitude == "") {
						continue;
					}
					gs.push(
						new Graphic({
							id: data[i].i,
							feature: new Feature({
								id: data[i].i,
								geometry: new Point({
									type: GEOMETRY_TYPE_POINT,
									coordinates: [data[i].longitude, data[i].latitude]
								}),
								properties: Object.assign({}, data[i])
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
			flyShowTips({
				pixel,
				layer,
				map
			}) { //定位tips弹框
				//let point = layer.point;
				//canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: point.lng, y: point.lat, zoom: layer.zoom });//定位

				let graphic = null; //当前定位graphic
				let graphicList = []; //所有graphic
				let flyLayer = null; //当前图层
				let layerList = canvasRender.default.layers; //所有图层
				for (let i = 0; i < layerList.length; i++) {
					if (layerList[i].$data.name == layer.layerName) {
						flyLayer = layerList[i];
						graphicList = layerList[i].$data.graphics;
					}
				}
				var point = {
					lng: 0,
					lat: 0,
				}
				if (graphicList.length > 0) {
					for (let i = 0; i < graphicList.length; i++) {
						var entity = JSON.parse(graphicList[i].feature.properties.entity); //告警内容
						if (entity.device_id == layer.id) {
							graphic = graphicList[i];
							var x = parseFloat(graphic.feature.geometry.coordinates[0]);
							var y = parseFloat(graphic.feature.geometry.coordinates[1]);
							point.lng = x;
							point.lat = y;
							canvasRender.default.eventBus.emit("canvas-renderer-fly", {
								x: x,
								y: y,
								zoom: layer.zoom
							}); //定位
							break;
						}
					}
					if (graphic != null) {
						setTimeout(function() {
							flyLayer.graphicClickHandler({
								pixel,
								point,
								graphic,
								map
							});
						}, 1000)
					} else {
						this.eventBus.emit("graphic-ErrorTips", "定位失败,图层中没有该数据！");
					}
				} else {
					this.eventBus.emit("graphic-ErrorTips", "定位失败！！");
				}
			},
			graphicClickHandler({
				pixel,
				point,
				graphic,
				map
			}) { //点击tips信息
				Console.debug("graphic click CableVibrationLayer", pixel.x, pixel.y, point.lng, point.lat, graphic.toJson());
				let itme = {
					layerName: "CableVibrationLayer", //图层名称
					title: "电缆振动", //tips标题
					type: "", //tips展示类型
					data: [ //tips数据  线路名称、告警类型、告警事件、告警时间
						// { 'type': '线路名称:', 'detail': ""},
						// { 'type': '告警类型:', 'detail': "" },
						{
							'type': '告警事件:',
							'detail': graphic.feature.properties.title
						},
						{
							'type': '告警时间:',
							'detail': graphic.feature.properties.announceTime
						},
					],
					button: [ //按钮 type:类型  name:名称
					],
				}
				this.eventBus.emit("graphic-click-showTips", {
					pixel,
					point,
					graphic,
					map,
					itme
				});
			},
			onLayerVisible({
				layer
			}) { //图层显示隐藏
				this.visible = !this.visible
			}
		},
		created() {
			// this.$$utils.axiosRequest("/pdaqfh_war_exploded/f/xczy/tXczyWarnMessage/getTXczyWarnMessageList?types=das_alarm&rangeType=month", '获取今日告警消息列表').then(result => {
			//     if (result.data.list.length == 0) {
			//         Console.log("今日告警消息口数据null！");
			//         return;
			//     }
			//     Console.debug("今日告警消息数据：" + result.data.list.length);
			//     this.resData(true);
			// });
		}
	};
};


export default VectorLayer.extend(CableVibrationLayer());
