import Vue from "vue";
import VectorLayer from "./VectorLayer";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import { NONE_SYMBOL } from "../symbol/SymbolEnum";
import Console from "../support/Console";
import stations from "../assets/mock/station";


function getRandomInclusive(min, max) {
    return Math.random() * (max - min) + min; //The maximum is inclusive and the minimum is inclusive
}

function TestLayerMixin() {
    return {
        data() {
            return {};
        },
        props: {},
        methods: {
            graphicClickHandler({ pixel, point, graphic }) {
                Console.debug("graphic click ", pixel.x, pixel.y, point.lng, point.lat, graphic.toJson());
                this.eventBus.emit("graphic-click-showTips", { pixel, point, graphic });
            }
        },
        watch: {
            ready: function () {
                Console.debug("Test layer ready run");
                //this.$on("graphic-click", this.graphicClickHandler);

                //绘图测试
                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: {
                //             type: "Polygon",
                //             coordinates: [[
                //                 [121.488286, 31.243221],
                //                 [121.538878, 31.236305],
                //                 [121.3894, 31.129041],
                //                 [121.343407, 31.255076],
                //                 [121.39055, 31.301987],
                //                 [121.443442, 31.334564],
                //                 [121.488286, 31.243221]
                //             ]]
                //         },
                //         properties: {
                //             field: "Polygon"
                //         }
                //     }),
                //     symbol: { type: NONE_SYMBOL }
                // }));
                //
                //
                //
                //
                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: {
                //             type: "MultiLineString",
                //             coordinates: [[
                //                 [121.589741,31.201294],
                //                 [121.602101,31.215995],
                //                 [121.597214,31.196537],
                //                 [121.589741,31.201294]
                //             ]]
                //         },
                //         properties: {
                //             field: "Polyline"
                //         }
                //     }), symbol: { type: NONE_SYMBOL }
                // }));
                //
                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: {
                //             type: "MultiLineString",
                //             coordinates: [[
                //                 [121.689741,31.201294],
                //                 [121.702101,31.215995],
                //                 [121.697214,31.196537],
                //                 [121.689741,31.201294]
                //             ]]
                //         },
                //         properties: {
                //             field: "AFSD"
                //         }
                //     }), symbol: { type: NONE_SYMBOL }
                // }));

                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: {
                //             type: "Polygon",
                //             coordinates: [[
                //                 // [120.488286, 31.243221],
                //                 // [120.538878, 31.236305],
                //                 // [120.3894, 31.129041],
                //                 // [120.343407, 31.255076],
                //                 // [120.39055, 31.301987],
                //                 // [120.443442, 31.334564],
                //                 // [120.488286, 31.243221]
                //
                //                     [121.589741,31.201294],
                //                         [121.602101,31.215995],
                //                         [121.597214,31.196537],
                //                         [121.589741,31.201294]
                //             ]]
                //         },
                //         properties: {
                //             field: "Polygon"
                //         }
                //     }), symbol: { type: NONE_SYMBOL }
                // }));
                //
                // let bounds = [120.8191, 30.659993, 122.831304, 31.589842];
                // let gs = [];
                // for (let i = 0; i < 10000; i++) {
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
                //                 field: "Point"
                //             }
                //         }),
                //         symbol: {
                //             type: NONE_SYMBOL
                //         }
                //     }));
                // }
                // this.addGraphics(gs);

                // 其他测试
                // let gs = [
                //     new Graphic({
                //         feature : new Feature({
                //             geometry : {
                //                 type : "Point",
                //                 coordinates : [121.810879060185,30.9054938903592]
                //             },
                //             properties : {
                //                 field : "Point"
                //             }
                //         }),
                //         symbol : {
                //             type : NONE_SYMBOL
                //         }
                //     }),
                //     new Graphic({
                //         feature : new Feature({
                //             geometry : {
                //                 type : "Point",
                //                 coordinates : [121.830955609028,30.8717020938284]
                //             },
                //             properties : {
                //                 field : "Point"
                //             }
                //         }),
                //         symbol : {
                //             type : NONE_SYMBOL
                //         }
                //     })
                // ];
                // this.addGraphics(gs);


                //动画测试点位
                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: {
                //             type: "Point",
                //             coordinates: [121.488286, 31.243221]
                //         },
                //         properties: {
                //             field: "Point"
                //         }
                //     }), symbol: { type: NONE_SYMBOL }
                // }));


                // 热力图测试
                // let bounds = [120.8191, 30.659993, 122.831304, 31.589842];
                // let valueRange = [0 , 100 ];
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

                let gs = [];
                for(let item of stations.data.list){
                    gs.push(new Graphic({
                        feature : {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    item.longitude,
                                    item.latitude
                                ]
                            },
                            properties: Object.assign({}, item)
                        },
                        symbol : {
                            type : NONE_SYMBOL
                        }
                    }));
                }
                this.addGraphics(gs);





                this.refresh();
            }
        }
    };
};


export default VectorLayer.extend(TestLayerMixin());
