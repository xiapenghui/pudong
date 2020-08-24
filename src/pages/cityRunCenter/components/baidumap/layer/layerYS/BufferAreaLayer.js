import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import { buffer } from "../../geometry/geometryEngine";
import Point from "../../geometry/Point";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
//故障电站缓冲区
function BufferAreaLayer() {
    return {
        data() {
            return {};
        },
        props: {},
        methods: {
        },
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-BufferAreaLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-addLayer-BufferAreaLayer", this.addHcqAreaLayer);//监听新增缓冲区图层

                // let g = 
                //     type: "Polygon",
                //     coordinates: [[
                //         [121.488286, 31.243221],
                //         [121.538878, 31.236305],
                //         [121.3894, 31.129041],
                //         [121.343407, 31.255076],
                //         [121.39055, 31.301987],
                //         [121.443442, 31.334564],
                //         [121.488286, 31.243221]
                //     ]]

                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: buffer({
                //             type: "Point",
                //             coordinates: [121.6110843, 31.19610456]
                //         }, 10000).geometry,//米
                //         properties: {
                //             field: "Polygon"
                //         }
                //     })
                //     , symbol: { type: NONE_SYMBOL }
                // }));
                // this.refresh();
            }
        },
        methods: {
            addHcqAreaLayer({ graphic, itme, type, point, gid }) {//缓冲区图层
                this.removeAll();//清除当前图层所有Graphic
                //this.remove(gid);
                // this.add(new Graphic({
                //     feature: new Feature({
                //         geometry: buffer({
                //             type: "Point",
                //             coordinates: [point.jd, point.wd]
                //         }, 5000).geometry,//米
                //         properties: {
                //             field: "Polygon"
                //         }
                //     })
                //     , symbol: { type: NONE_SYMBOL }
                // }));
                let bfGeometry = buffer(new Point({
                    type: GEOMETRY_TYPE_POINT,
                    coordinates: [point.jd, point.wd]
                }), 5000)
                this.add(new Graphic({
                    id: "",
                    feature: new Feature({
                        id: "",
                        geometry: bfGeometry,
                        // buffer(new Point({
                        //     type: GEOMETRY_TYPE_POINT,
                        //     coordinates: [point.jd, point.wd]
                        // }), 5000),//米
                        properties: {
                            field: "Polygon"
                        }
                    }),
                    symbol: {
                        type: NONE_SYMBOL
                    }
                }));
                this.refresh();
                this.bfLocation(bfGeometry);//缓冲区定位
            },
            bfLocation(bfGeometry) {//缓冲区定位
                canvasRender.default.eventBus.emit("canvas-renderer-fly", {
                    type: bfGeometry.type,
                    coordinates: bfGeometry.coordinates
                });
                // canvasRender.default.eventBus.emit("canvas-renderer-fly", {
                //     type: "Polygon",
                //     coordinates: [
                //         [
                //             [121.589741, 31.201294],
                //             [121.602101, 31.215995],
                //             [121.597214, 31.196537],
                //             [121.589741, 31.201294]
                //         ]
                //     ]
                // });
            },
            onLayerVisible({ layer }) {//图层显示隐藏
                this.visible = !this.visible
            }
        }
    };
};


export default VectorLayer.extend(BufferAreaLayer());
