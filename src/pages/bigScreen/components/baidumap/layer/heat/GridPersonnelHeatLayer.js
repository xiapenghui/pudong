import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import {
	NONE_SYMBOL
} from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import * as backApiData from "../../../../../bigScreen/api/backApiData.js";

function GridPersonnelHeatLayer() { //网格化运维人员热力图
	return {
		data() {
			return {};
		},
		props: {},
		watch: {
			ready: function() {
				Console.debug("Test layer ready run");
				this.eventBus.on("layer-visible-GridPersonnelHeatLayer", this.onLayerVisible); //图层显示隐藏监听

				// 热力图测试
				// let bounds = [120.8191, 30.659993, 122.831304, 31.589842];
				// let valueRange = [0, 100];
				// let gs = [];
				// for (let i = 0; i < 100; i++) {
				//     gs.push(new Graphic({
				//         feature: new Feature({
				//             geometry: {
				//                 type: "Point",
				//                 coordinates: [
				//                     getRandomInclusive(bounds[0], bounds[2]),
				//                     getRandomInclusive(bounds[1], bounds[3])
				//                 ]
				//             },
				//             properties: {
				//                 value: 1//getRandomInclusive(valueRange[0], valueRange[1])
				//             }
				//         }),
				//         symbol: {
				//             type: NONE_SYMBOL
				//         }
				//     }));
				// }
				// this.addGraphics(gs);
				// this.refresh();
			}
		},
		methods: {
			//网格化运维-所有人员在线位置
			wghOnline() {
				backApiData.getwghyw().then(result => {
					if (result.data.data.length == 0) {
						Console.log("网格化运维-所有人员在线位置数据null！");
						return;
					}
					Console.debug("网格化运维-所有人员在线位置数据：" + result.data.data.length);
					this.GridPersonnelHeat(result.data.data);
				})
			},

			GridPersonnelHeat(list) { //图层渲染
				let data = list;
				let gs = [];
				for (let i = 0; i < data.length; i++) {
					if (data[i].realtime_point.location.length == 0) {
						continue;
					}
					gs.push(new Graphic({
						feature: new Feature({
							geometry: {
								type: "Point",
								coordinates: [data[i].realtime_point.location[0], data[i].realtime_point.location[1]]
							},
							properties: {
								value: 1 //getRandomInclusive(valueRange[0], valueRange[1])
							}
						}),
						symbol: {
							type: NONE_SYMBOL
						}
					}));
				}
				this.addGraphics(gs);
				this.refresh();
			},
			onLayerVisible(layer) { //图层显示隐藏
				this.visible = layer
			}
		},
		mounted() {
			this.wghOnline()
		}
	};
};


export default VectorLayer.extend(GridPersonnelHeatLayer());
